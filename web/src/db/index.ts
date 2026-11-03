import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import {
  drizzle as drizzlePg,
  type NodePgDatabase,
} from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";
import * as schema from "./schema";

/**
 * Conexión a Postgres, con el driver elegido según a dónde apunte la URL.
 *
 * En producción la base es Neon y se habla por HTTP, que es lo que conviene
 * en funciones serverless: no hay pool que mantener vivo entre invocaciones.
 *
 * Pero el driver HTTP de Neon solo sabe hablar con Neon. Con un Postgres
 * común —el de la máquina de quien desarrolla— hay que usar el protocolo
 * nativo. Sin esto, el proyecto no se puede levantar sin crear antes una
 * cuenta en Neon, que es una barrera absurda para probar un cambio.
 *
 * La base es opcional a propósito: mientras no haya DATABASE_URL el sitio
 * sigue funcionando y el formulario cae a su alternativa por WhatsApp.
 */

const url = (process.env.DATABASE_URL ?? "").trim();

export const dbDisponible = url.length > 0;

/** Neon expone su endpoint HTTP en subdominios de neon.tech. */
function esNeon(cadena: string): boolean {
  try {
    const host = new URL(cadena).hostname;
    return host.endsWith(".neon.tech") || host.endsWith(".neon.build");
  } catch {
    return false;
  }
}

export const motor: "neon" | "postgres" | null = dbDisponible
  ? esNeon(url)
    ? "neon"
    : "postgres"
  : null;

/**
 * Las dos instancias de drizzle exponen la misma API para lo que usa el
 * proyecto, pero sus tipos no son el mismo. Declarar la union rompe las
 * sobrecargas (`.returning()` deja de aceptar argumentos), asi que se fija
 * un tipo y se adapta el otro.
 */
type Base = NodePgDatabase<typeof schema>;

function crear(): Base | null {
  if (!dbDisponible) return null;

  if (motor === "neon") {
    return drizzleNeon(neon(url), { schema }) as unknown as Base;
  }

  // En desarrollo, un pool chico alcanza y sobra. `next dev` recarga módulos
  // a menudo, así que el pool se guarda en globalThis para no abrir una
  // conexión nueva en cada recarga y agotar las del servidor.
  const g = globalThis as unknown as { __dcPool?: Pool };
  g.__dcPool ??= new Pool({ connectionString: url, max: 5 });
  return drizzlePg(g.__dcPool, { schema });
}

export const db = crear();

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
