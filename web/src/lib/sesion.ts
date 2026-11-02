import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt, lt } from "drizzle-orm";
import { db } from "@/db";
import { sesiones, usuarios, type Rol, type Usuario } from "@/db/schema";
import { ipHash } from "./antispam";

const COOKIE = "dc-sesion";
const DIAS = 7;

/**
 * La cookie lleva un token aleatorio; en la base se guarda su SHA-256.
 * Si alguien leyera la tabla, no obtendría cookies utilizables.
 */
const hashToken = (t: string) => createHash("sha256").update(t).digest("hex");

export type SesionActiva = { usuario: Usuario };

export async function crearSesion(usuarioId: string): Promise<void> {
  if (!db) throw new Error("La base de datos no está disponible.");

  const token = randomBytes(32).toString("base64url");
  const expiraEn = new Date(Date.now() + DIAS * 24 * 60 * 60 * 1000);
  const h = await headers();

  await db.insert(sesiones).values({
    tokenHash: hashToken(token),
    usuarioId,
    expiraEn,
    ipHash: await ipHash(),
    userAgent: h.get("user-agent")?.slice(0, 300) ?? null,
  });

  const almacen = await cookies();
  almacen.set(COOKIE, token, {
    httpOnly: true, // inaccesible desde JavaScript: limita el robo por XSS
    sameSite: "lax", // no viaja en peticiones de otros sitios
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiraEn,
  });
}

/** Devuelve el usuario de la sesión vigente, o null. */
export async function sesionActual(): Promise<Usuario | null> {
  if (!db) return null;

  const almacen = await cookies();
  const token = almacen.get(COOKIE)?.value;
  if (!token) return null;

  const [fila] = await db
    .select({ u: usuarios })
    .from(sesiones)
    .innerJoin(usuarios, eq(sesiones.usuarioId, usuarios.id))
    .where(
      and(
        eq(sesiones.tokenHash, hashToken(token)),
        gt(sesiones.expiraEn, new Date()),
        // Una cuenta suspendida pierde el acceso en la siguiente petición,
        // sin esperar a que la sesión venza.
        eq(usuarios.estado, "activo"),
      ),
    )
    .limit(1);

  return fila?.u ?? null;
}

export async function cerrarSesion(): Promise<void> {
  const almacen = await cookies();
  const token = almacen.get(COOKIE)?.value;

  if (token && db) {
    await db.delete(sesiones).where(eq(sesiones.tokenHash, hashToken(token)));
  }
  almacen.delete(COOKIE);
}

/** Cierra todas las sesiones de un usuario (cambio de contraseña, sospecha). */
export async function cerrarTodasLasSesiones(usuarioId: string) {
  if (!db) return;
  await db.delete(sesiones).where(eq(sesiones.usuarioId, usuarioId));
}

/** Limpieza de sesiones vencidas. */
export async function purgarSesiones() {
  if (!db) return;
  await db.delete(sesiones).where(lt(sesiones.expiraEn, new Date()));
}

/**
 * Exige sesión y, si se piden roles, que el usuario tenga uno de ellos.
 *
 * La comparación es por pertenencia a una lista explícita, no por nivel:
 * así, agregar un rol nuevo no le concede permisos por accidente.
 */
export async function exigirSesion(roles?: Rol[]): Promise<Usuario> {
  const usuario = await sesionActual();

  if (!usuario) redirect("/acceso?motivo=sesion");
  if (roles && !roles.includes(usuario.rol)) redirect("/acceso?motivo=permiso");

  return usuario;
}

export const esAdmin = (u: Usuario | null) => u?.rol === "admin";
