import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

/**
 * Conexión a Postgres (Neon) sobre HTTP, que es lo que conviene en funciones
 * serverless: no hay pool que mantener vivo entre invocaciones.
 *
 * La base es opcional a propósito. Mientras no haya DATABASE_URL el sitio
 * sigue funcionando y el formulario cae a su alternativa por WhatsApp y
 * correo, en vez de romperse en producción.
 */

const url = (process.env.DATABASE_URL ?? "").trim();

export const dbDisponible = url.length > 0;

export const db = dbDisponible
  ? drizzle(neon(url), { schema })
  : null;

/** Lanza si se usa la base sin haberla configurado. */
export function requireDb() {
  if (!db) {
    throw new Error(
      "DATABASE_URL no está configurada: la base de datos no está disponible.",
    );
  }
  return db;
}

export { schema };
