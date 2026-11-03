/**
 * Conexión para los scripts, con el driver que corresponda a la URL.
 *
 * Igual que src/db/index.ts: el driver HTTP de Neon solo habla con Neon, así
 * que con un Postgres común hay que usar el protocolo nativo. Devuelve una
 * función `sql` con la misma forma en los dos casos, para que los scripts no
 * tengan que saber cuál está en uso.
 */

const url = (process.env.DATABASE_URL ?? "").trim();

if (!url) {
  console.error("✗ DATABASE_URL no está configurada. Completá web/.env.local.");
  process.exit(1);
}

const esNeon = (() => {
  try {
    const h = new URL(url).hostname;
    return h.endsWith(".neon.tech") || h.endsWith(".neon.build");
  } catch {
    return false;
  }
})();

export const motor = esNeon ? "neon" : "postgres";

let sql;
let cerrar = async () => {};

if (esNeon) {
  const { neon } = await import("@neondatabase/serverless");
  sql = neon(url);
} else {
  const { default: pg } = await import("pg");
  const pool = new pg.Pool({ connectionString: url, max: 2 });

  // Se imita la interfaz de plantilla etiquetada de Neon: los valores van
  // como parámetros, nunca interpolados en el texto de la consulta.
  sql = async (fragmentos, ...valores) => {
    const texto = fragmentos.reduce(
      (acc, f, i) => acc + f + (i < valores.length ? `$${i + 1}` : ""),
      "",
    );
    const { rows } = await pool.query(texto, valores);
    return rows;
  };
  cerrar = () => pool.end();
}

export { sql, cerrar };
