/**
 * Crea o actualiza una cuenta de administración.
 *
 *   npm run admin:crear -- correo@ejemplo.com "Nombre Apellido"
 *
 * No hay registro público a propósito: las cuentas del panel se crean desde
 * acá. La contraseña se genera al azar y se imprime UNA sola vez; no queda
 * guardada en ningún lado en claro.
 */

import { neon } from "@neondatabase/serverless";
import { randomBytes, scrypt as scryptCb } from "node:crypto";

const url = (process.env.DATABASE_URL ?? "").trim();
if (!url) {
  console.error("✗ DATABASE_URL no está configurada. Completá web/.env.local.");
  process.exit(1);
}

const [correoCrudo, nombreCrudo] = process.argv.slice(2);
if (!correoCrudo) {
  console.error('Uso: npm run admin:crear -- correo@ejemplo.com "Nombre Apellido"');
  process.exit(1);
}

const correo = correoCrudo.trim().toLowerCase();
if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(correo)) {
  console.error("✗ El correo no parece válido.");
  process.exit(1);
}
const nombre = (nombreCrudo ?? correo.split("@")[0]).trim();

// Mismo formato y parámetros que src/lib/password.ts.
const N = 16384;
const R = 8;
const P = 1;

const scrypt = (clave, sal, largo, opts) =>
  new Promise((ok, no) =>
    scryptCb(clave, sal, largo, opts, (e, d) => (e ? no(e) : ok(d))),
  );

// 18 bytes al azar en base64url: unos 24 caracteres, sin ambigüedades
// visuales y con entropía de sobra.
const password = randomBytes(18).toString("base64url");

const sal = randomBytes(16);
const derivado = await scrypt(password.normalize("NFKC"), sal, 64, {
  N,
  r: R,
  p: P,
  maxmem: 64 * 1024 * 1024,
});
const hash = [
  "scrypt",
  N,
  R,
  P,
  sal.toString("base64"),
  derivado.toString("base64"),
].join("$");

const sql = neon(url);

const [existente] = await sql`
  select id, rol from usuarios where correo = ${correo} limit 1`;

if (existente) {
  await sql`
    update usuarios
    set hash = ${hash}, rol = 'admin', estado = 'activo', nombre = ${nombre}
    where correo = ${correo}`;
  // Cambiar la contraseña invalida las sesiones abiertas de esa cuenta.
  await sql`delete from sesiones where usuario_id = ${existente.id}`;
  console.log(`✓ Cuenta actualizada: ${correo}`);
  console.log("  Se cerraron sus sesiones abiertas.");
} else {
  await sql`
    insert into usuarios (correo, nombre, hash, rol, estado)
    values (${correo}, ${nombre}, ${hash}, 'admin', 'activo')`;
  console.log(`✓ Cuenta creada: ${correo}`);
}

console.log("");
console.log("  Contraseña (se muestra una sola vez):");
console.log("");
console.log(`      ${password}`);
console.log("");
console.log("  Guardala en tu gestor de contraseñas ahora.");
console.log("  No queda almacenada en claro en ningún lado.");
