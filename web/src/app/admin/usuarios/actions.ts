"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { and, eq, ne, sql } from "drizzle-orm";
import { z } from "zod";
import { requireDb } from "@/db";
import { sesiones, usuarios } from "@/db/schema";
import { hashearPassword, validarPassword } from "@/lib/password";
import { cerrarTodasLasSesiones, exigirSesion } from "@/lib/sesion";

/**
 * Gestión de cuentas.
 *
 * Dos reglas atraviesan todo este archivo:
 *
 *  1. Cada acción vuelve a exigir el rol admin. Una acción de servidor se
 *     puede invocar directamente, sin pasar por la página que la contiene.
 *  2. Nadie puede dejarse afuera. Un admin no puede suspenderse, cambiarse
 *     el rol ni borrarse a sí mismo, y no se puede quitar al último admin
 *     que queda: si no, el panel se vuelve inaccesible y solo se recupera
 *     por consola.
 */

const ROLES = ["admin", "comerciante", "mayorista", "marca"] as const;

export type EstadoUsuarios = {
  ok?: boolean;
  aviso?: string;
  errores?: Record<string, string>;
  /**
   * Contraseña recién generada, para mostrarla UNA vez en pantalla.
   * No se guarda en claro ni se escribe en los registros.
   */
  passwordNueva?: string;
};

/** Cuenta cuántos admin activos quedan además del indicado. */
async function otrosAdminsActivos(exceptoId: string): Promise<number> {
  const db = requireDb();
  const [fila] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(usuarios)
    .where(
      and(
        eq(usuarios.rol, "admin"),
        eq(usuarios.estado, "activo"),
        ne(usuarios.id, exceptoId),
      ),
    );
  return fila?.n ?? 0;
}

/** Contraseña inicial: 18 bytes al azar, sin caracteres ambiguos. */
const generarPassword = () => randomBytes(18).toString("base64url");

/* ------------------------------------------------------------------ crear */

const crearSchema = z.object({
  correo: z.string().trim().toLowerCase().max(254).pipe(z.email("Revisá el correo.")),
  nombre: z.string().trim().min(2, "Indicá el nombre.").max(120),
  rol: z.enum(ROLES),
  negocio: z.string().trim().max(120).optional().or(z.literal("")),
  ciudad: z.string().trim().max(120).optional().or(z.literal("")),
});

export async function crearUsuario(
  _anterior: EstadoUsuarios,
  formData: FormData,
): Promise<EstadoUsuarios> {
  await exigirSesion(["admin"]);

  const parsed = crearSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errores: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const campo = String(i.path[0] ?? "_");
      if (!errores[campo]) errores[campo] = i.message;
    }
    return { ok: false, aviso: "Revisá los campos marcados.", errores };
  }

  const d = parsed.data;
  const db = requireDb();

  const [existente] = await db
    .select({ id: usuarios.id })
    .from(usuarios)
    .where(eq(usuarios.correo, d.correo))
    .limit(1);

  if (existente) {
    return {
      ok: false,
      aviso: "Ya existe una cuenta con ese correo.",
      errores: { correo: "Ya está registrado." },
    };
  }

  const password = generarPassword();

  try {
    await db.insert(usuarios).values({
      correo: d.correo,
      nombre: d.nombre,
      rol: d.rol,
      negocio: d.negocio || null,
      ciudad: d.ciudad || null,
      hash: await hashearPassword(password),
    });
  } catch (err) {
    // El error se registra sin la contraseña, obviamente.
    console.error("[admin] no se pudo crear la cuenta:", err);
    return { ok: false, aviso: "No se pudo crear la cuenta." };
  }

  revalidatePath("/admin/usuarios");
  revalidatePath("/admin");

  return {
    ok: true,
    aviso: `Cuenta creada para ${d.correo}.`,
    passwordNueva: password,
  };
}

/* ------------------------------------------------------------------- rol */

export async function cambiarRol(formData: FormData) {
  const yo = await exigirSesion(["admin"]);

  const id = z.uuid().parse(formData.get("id"));
  const rol = z.enum(ROLES).parse(formData.get("rol"));

  // No puede cambiarse el rol a sí mismo: es la forma más directa de
  // quedarse sin acceso al panel.
  if (id === yo.id) return;

  const db = requireDb();
  const [objetivo] = await db
    .select({ rol: usuarios.rol, estado: usuarios.estado })
    .from(usuarios)
    .where(eq(usuarios.id, id))
    .limit(1);
  if (!objetivo) return;

  // Si es el último admin activo, no se lo baja de rol.
  if (
    objetivo.rol === "admin" &&
    objetivo.estado === "activo" &&
    rol !== "admin" &&
    (await otrosAdminsActivos(id)) === 0
  ) {
    return;
  }

  await db.update(usuarios).set({ rol }).where(eq(usuarios.id, id));
  revalidatePath("/admin/usuarios");
}

/* ---------------------------------------------------------------- estado */

export async function cambiarEstadoUsuario(formData: FormData) {
  const yo = await exigirSesion(["admin"]);

  const id = z.uuid().parse(formData.get("id"));
  const estado = z.enum(["activo", "suspendido"]).parse(formData.get("estado"));

  if (id === yo.id) return; // no puede suspenderse a sí mismo

  const db = requireDb();
  const [objetivo] = await db
    .select({ rol: usuarios.rol })
    .from(usuarios)
    .where(eq(usuarios.id, id))
    .limit(1);
  if (!objetivo) return;

  if (
    estado === "suspendido" &&
    objetivo.rol === "admin" &&
    (await otrosAdminsActivos(id)) === 0
  ) {
    return;
  }

  await db.update(usuarios).set({ estado }).where(eq(usuarios.id, id));

  // Suspender cierra las sesiones abiertas en el acto, sin esperar a que
  // venzan.
  if (estado === "suspendido") await cerrarTodasLasSesiones(id);

  revalidatePath("/admin/usuarios");
  revalidatePath("/admin");
}

/* ----------------------------------------------------- restablecer clave */

export async function restablecerPassword(
  _anterior: EstadoUsuarios,
  formData: FormData,
): Promise<EstadoUsuarios> {
  const yo = await exigirSesion(["admin"]);
  const id = z.uuid().parse(formData.get("id"));

  // Sobre la propia cuenta, no: restablecer cierra todas las sesiones, y al
  // cerrarse la actual el panel redirige al acceso antes de que se alcance a
  // leer la contraseña generada. Para cambiarla está Mi cuenta, que conserva
  // la sesión de este navegador.
  if (id === yo.id) {
    return {
      ok: false,
      aviso: "Para cambiar tu propia contraseña usá «Mi cuenta».",
    };
  }

  const db = requireDb();
  const [objetivo] = await db
    .select({ correo: usuarios.correo })
    .from(usuarios)
    .where(eq(usuarios.id, id))
    .limit(1);
  if (!objetivo) return { ok: false, aviso: "La cuenta no existe." };

  const password = generarPassword();
  await db
    .update(usuarios)
    .set({ hash: await hashearPassword(password) })
    .where(eq(usuarios.id, id));

  // Cambiar la contraseña invalida lo que esa persona tuviera abierto.
  await cerrarTodasLasSesiones(id);

  revalidatePath("/admin/usuarios");
  return {
    ok: true,
    aviso: `Contraseña nueva para ${objetivo.correo}. Se cerraron sus sesiones.`,
    passwordNueva: password,
  };
}

/* -------------------------------------------------------------- sesiones */

export async function cerrarSesionesDe(formData: FormData) {
  const yo = await exigirSesion(["admin"]);
  const id = z.uuid().parse(formData.get("id"));

  // Sobre la propia cuenta cerraría la sesión en curso desde una pantalla que
  // no es la de cerrar sesión: para eso está el botón «Salir».
  if (id === yo.id) return;

  await cerrarTodasLasSesiones(id);
  revalidatePath("/admin/usuarios");
}

/* --------------------------------------------------------------- eliminar */

export async function eliminarUsuario(formData: FormData) {
  const yo = await exigirSesion(["admin"]);
  const id = z.uuid().parse(formData.get("id"));

  if (id === yo.id) return;

  const db = requireDb();
  const [objetivo] = await db
    .select({ rol: usuarios.rol })
    .from(usuarios)
    .where(eq(usuarios.id, id))
    .limit(1);
  if (!objetivo) return;

  if (objetivo.rol === "admin" && (await otrosAdminsActivos(id)) === 0) return;

  // Las sesiones caen solas por la clave foránea en cascada.
  await db.delete(usuarios).where(eq(usuarios.id, id));

  revalidatePath("/admin/usuarios");
  revalidatePath("/admin");
}

/* ------------------------------------------------- contraseña propia */

const cambioSchema = z
  .object({
    actual: z.string().min(1, "Poné tu contraseña actual."),
    nueva: z.string(),
    repetir: z.string(),
  })
  .refine((d) => d.nueva === d.repetir, {
    message: "Las contraseñas nuevas no coinciden.",
    path: ["repetir"],
  });

export async function cambiarMiPassword(
  _anterior: EstadoUsuarios,
  formData: FormData,
): Promise<EstadoUsuarios> {
  const yo = await exigirSesion(["admin", "comerciante", "mayorista", "marca"]);

  const parsed = cambioSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errores: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const campo = String(i.path[0] ?? "_");
      if (!errores[campo]) errores[campo] = i.message;
    }
    return { ok: false, aviso: "Revisá los campos marcados.", errores };
  }

  const problema = validarPassword(parsed.data.nueva);
  if (problema) {
    return { ok: false, aviso: problema, errores: { nueva: problema } };
  }

  // Se comprueba la actual: con una sesión robada, no alcanza con tener la
  // cookie para cambiar la contraseña.
  const { verificarPassword } = await import("@/lib/password");
  if (!(await verificarPassword(parsed.data.actual, yo.hash))) {
    return {
      ok: false,
      aviso: "La contraseña actual no es correcta.",
      errores: { actual: "No coincide." },
    };
  }

  const db = requireDb();
  await db
    .update(usuarios)
    .set({ hash: await hashearPassword(parsed.data.nueva) })
    .where(eq(usuarios.id, yo.id));

  // Se cierran las demás sesiones, no la actual: si la contraseña se cambió
  // por sospecha, el intruso queda afuera y la persona sigue trabajando.
  const { cookies } = await import("next/headers");
  const { createHash } = await import("node:crypto");
  const token = (await cookies()).get("dc-sesion")?.value;
  if (token) {
    const actual = createHash("sha256").update(token).digest("hex");
    await db
      .delete(sesiones)
      .where(
        and(eq(sesiones.usuarioId, yo.id), ne(sesiones.tokenHash, actual)),
      );
  } else {
    await cerrarTodasLasSesiones(yo.id);
  }

  return {
    ok: true,
    aviso: "Contraseña cambiada. Se cerraron tus otras sesiones.",
  };
}
