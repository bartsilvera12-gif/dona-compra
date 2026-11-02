import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { mensajes } from "@/db/schema";

/**
 * Defensas del formulario, de la más barata a la más cara:
 *
 *   1. Campo trampa  — invisible; si viene lleno, es un bot.
 *   2. Tiempo mínimo — un formulario completado en menos de 3 s no es humano.
 *   3. Límite por IP — como máximo 5 envíos por hora desde el mismo origen.
 *
 * No hay captcha de terceros a propósito: agrega un tercero que recibe datos
 * de quien visita el sitio, justo lo que la política de privacidad evita.
 * Si el spam supera esto, el paso siguiente es Cloudflare Turnstile.
 */

const TIEMPO_MINIMO_MS = 3000;
const MAX_POR_HORA = 5;

/**
 * Hash con sal de la IP. Guardamos esto y no la IP para no conservar un dato
 * personal: sirve igual para contar envíos, pero no identifica a nadie.
 */
export async function ipHash(): Promise<string | null> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip")?.trim() ||
    "";
  if (!ip) return null;

  const sal = process.env.IP_HASH_SALT ?? "dona-compra-sal-por-defecto";
  return createHash("sha256").update(sal + "|" + ip).digest("hex");
}

export async function userAgent(): Promise<string | null> {
  const h = await headers();
  return h.get("user-agent")?.slice(0, 300) ?? null;
}

/** Rechaza formularios completados demasiado rápido para ser humanos. */
export function demasiadoRapido(ts: string | undefined): boolean {
  if (!ts) return false; // sin marca no bloqueamos: puede ser JS deshabilitado
  const inicio = Number(ts);
  if (!Number.isFinite(inicio)) return false;
  const transcurrido = Date.now() - inicio;
  // Un valor negativo o absurdo indica un reloj manipulado.
  if (transcurrido < 0) return true;
  return transcurrido < TIEMPO_MINIMO_MS;
}

/**
 * Cuenta los envíos de la última hora desde el mismo origen.
 * Sin base de datos no hay límite que aplicar, así que deja pasar.
 */
export async function superaLimite(hash: string | null): Promise<boolean> {
  if (!db || !hash) return false;
  const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000);

  const [fila] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(mensajes)
    .where(and(eq(mensajes.ipHash, hash), gte(mensajes.creadoEn, haceUnaHora)));

  return (fila?.n ?? 0) >= MAX_POR_HORA;
}

/** Token opaco para confirmar o dar de baja una suscripción. */
export function nuevoToken(): string {
  return randomBytes(32).toString("base64url");
}
