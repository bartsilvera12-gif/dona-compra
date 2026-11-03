/**
 * Comprueba el estado de la instalación de Supabase.
 *
 *   npm run check:supabase
 *
 * Dice si el servidor responde, si el anon key sirve, si el schema está
 * expuesto en PostgREST y si existe el bucket. No imprime secretos.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const schema = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA ?? "donacompraweb";
const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "donacompraweb";

const ok = (s) => console.log(`\x1b[32m✓\x1b[0m ${s}`);
const no = (s) => console.log(`\x1b[31m✗\x1b[0m ${s}`);
const warn = (s) => console.log(`\x1b[33m•\x1b[0m ${s}`);

console.log(`\nServidor: ${url}`);
console.log(`Schema:   ${schema}\n`);

// 1. ¿Responde el servidor?
try {
  const r = await fetch(`${url}/auth/v1/health`, { headers: { apikey: key } });
  if (r.ok) ok(`auth responde (${r.status})`);
  else no(`auth respondió ${r.status}`);
} catch (e) {
  no(`no se pudo conectar: ${e.message}`);
  process.exit(1);
}

// 2. ¿El anon key es válido para PostgREST?
try {
  const r = await fetch(`${url}/rest/v1/`, {
    headers: { apikey: key, authorization: `Bearer ${key}` },
  });
  if (r.status === 401) no("el anon key fue rechazado");
  else ok(`PostgREST acepta el anon key (${r.status})`);
} catch (e) {
  no(`PostgREST no responde: ${e.message}`);
}

// 3. ¿Está expuesto el schema? Esto es lo que dijo que hace él.
try {
  const r = await fetch(`${url}/rest/v1/publicaciones?select=id&limit=1`, {
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      "accept-profile": schema,
    },
  });
  const cuerpo = await r.text();
  if (r.ok) {
    ok(`el schema "${schema}" está expuesto y la tabla publicaciones responde`);
  } else if (/schema must be one of/i.test(cuerpo) || r.status === 406) {
    warn(`el schema "${schema}" todavía NO está expuesto en PostgREST`);
    console.log(`    ${cuerpo.slice(0, 160)}`);
  } else if (/does not exist|relation/i.test(cuerpo)) {
    warn("el schema está expuesto pero faltan las tablas: falta correr el SQL");
    console.log(`    ${cuerpo.slice(0, 160)}`);
  } else {
    warn(`respuesta ${r.status}`);
    console.log(`    ${cuerpo.slice(0, 200)}`);
  }
} catch (e) {
  no(`fallo al consultar: ${e.message}`);
}

// 4. ¿Existe el bucket?
try {
  const r = await fetch(`${url}/storage/v1/object/public/${bucket}/.probe`, {
    headers: { apikey: key },
  });
  if (r.status === 400 || r.status === 404) {
    const t = await r.text();
    if (/bucket not found/i.test(t)) warn(`el bucket ${bucket} todavía no existe: falta correr 02-storage.sql`);
    else ok(`el bucket ${bucket} existe`);
  } else ok(`storage responde (${r.status})`);
} catch (e) {
  warn(`storage no respondió: ${e.message}`);
}
console.log();
