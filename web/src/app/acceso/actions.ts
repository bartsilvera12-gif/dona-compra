"use server";

import { redirect } from "next/navigation";
import { and, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { intentosAcceso, usuarios } from "@/db/schema";
import { ipHash } from "@/lib/antispam";
import {
  gastarTiempoComoSiExistiera,
  verificarPassword,
} from "@/lib/password";
import { cerrarSesion, crearSesion } from "@/lib/sesion";

const MAX_INTENTOS = 8;
const VENTANA_MIN = 15;

const schema = z.object({
  correo: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  password: z.string().min(1).max(200),
});

export type EstadoAcceso = { error?: string };

/** Cuenta los fallos recientes de un correo o de un origen. */
async function demasiadosIntentos(correo: string, hash: string | null) {
  if (!db) return false;
  const desde = new Date(Date.now() - VENTANA_MIN * 60 * 1000);

  const [porCorreo] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(intentosAcceso)
    .where(
      and(eq(intentosAcceso.correo, correo), gte(intentosAcceso.creadoEn, desde)),
    );
  if ((porCorreo?.n ?? 0) >= MAX_INTENTOS) return true;

  if (hash) {
    const [porIp] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(intentosAcceso)
      .where(
        and(eq(intentosAcceso.ipHash, hash), gte(intentosAcceso.creadoEn, desde)),
      );
    // Desde un mismo origen se tolera más, porque puede ser una oficina
    // entera detrás de la misma salida a internet.
    if ((porIp?.n ?? 0) >= MAX_INTENTOS * 3) return true;
  }

  return false;
}

export async function entrar(
  _anterior: EstadoAcceso,
  formData: FormData,
): Promise<EstadoAcceso> {
  if (!db) {
    return { error: "El acceso no está disponible: falta configurar la base." };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData));
  // Un mensaje único para todos los fallos: decir "ese correo no existe" o
  // "la contraseña es incorrecta" le confirma a quien prueba cuál de las dos
  // acertó, y permite averiguar qué direcciones están registradas.
  const generico = "Correo o contraseña incorrectos.";
  if (!parsed.success) return { error: generico };

  const { correo, password } = parsed.data;
  const hash = await ipHash();

  if (await demasiadosIntentos(correo, hash)) {
    return {
      error: `Demasiados intentos. Esperá ${VENTANA_MIN} minutos y probá de nuevo.`,
    };
  }

  const [usuario] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.correo, correo))
    .limit(1);

  if (!usuario) {
    // Se gasta el mismo tiempo que con un usuario real para que la demora
    // no delate si el correo existe.
    await gastarTiempoComoSiExistiera(password);
    await db.insert(intentosAcceso).values({ correo, ipHash: hash });
    return { error: generico };
  }

  const ok = await verificarPassword(password, usuario.hash);

  if (!ok || usuario.estado !== "activo") {
    await db.insert(intentosAcceso).values({ correo, ipHash: hash });
    return { error: generico };
  }

  // Entró bien: se limpian sus intentos fallidos.
  await db.delete(intentosAcceso).where(eq(intentosAcceso.correo, correo));
  await db
    .update(usuarios)
    .set({ ultimoAccesoEn: new Date() })
    .where(eq(usuarios.id, usuario.id));

  await crearSesion(usuario.id);

  // El panel es lo único construido por ahora; el resto va al inicio.
  redirect(usuario.rol === "admin" ? "/admin" : "/");
}

export async function salir() {
  await cerrarSesion();
  redirect("/");
}
