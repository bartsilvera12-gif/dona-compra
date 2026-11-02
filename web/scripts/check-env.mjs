/**
 * Verifica que la configuración esté completa y que las credenciales sirvan.
 *
 *   npm run check
 *
 * No imprime ningún secreto: solo si está, si es válido y qué falta.
 */

const ok = (s) => `\x1b[32m✓\x1b[0m ${s}`;
const no = (s) => `\x1b[31m✗\x1b[0m ${s}`;
const warn = (s) => `\x1b[33m•\x1b[0m ${s}`;
const titulo = (s) => `\n\x1b[1m${s}\x1b[0m`;

const val = (k) => (process.env[k] ?? "").trim();
const hay = (k) => val(k).length > 0;

let fallos = 0;
let avisos = 0;

// --------------------------------------------------------------- Base de datos
console.log(titulo("Base de datos"));
if (!hay("DATABASE_URL")) {
  console.log(warn("DATABASE_URL vacía — no se guardan consultas y el boletín queda desactivado"));
  avisos++;
} else {
  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(val("DATABASE_URL"));
    const [fila] = await sql`select current_database() as db, version() as v`;
    console.log(ok(`conecta a "${fila.db}"`));

    // La región se ve en el host del connection string.
    const host = new URL(val("DATABASE_URL")).host;
    const region = host.match(/-([a-z]+-[a-z]+-\d)\./)?.[1];
    if (region) {
      const enUE = region.startsWith("eu-");
      console.log(
        enUE
          ? ok(`región ${region} (UE, como pide el RGPD)`)
          : warn(`región ${region} — está fuera de la UE; revisalo si el RGPD es requisito firme`),
      );
      if (!enUE) avisos++;
    }

    const tablas = await sql`
      select table_name from information_schema.tables
      where table_schema = 'public' order by table_name`;
    const nombres = tablas.map((t) => t.table_name);
    for (const t of ["mensajes", "suscriptores"]) {
      if (nombres.includes(t)) {
        console.log(ok(`tabla "${t}" creada`));
      } else {
        console.log(no(`falta la tabla "${t}" — corré: npm run db:migrate`));
        fallos++;
      }
    }
  } catch (err) {
    console.log(no(`no conecta: ${err.message}`));
    fallos++;
  }
}

// --------------------------------------------------------------------- Correo
console.log(titulo("Correo"));
if (!hay("RESEND_API_KEY")) {
  console.log(warn("RESEND_API_KEY vacía — el formulario ofrece WhatsApp en vez de enviar"));
  avisos++;
} else {
  try {
    const r = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${val("RESEND_API_KEY")}` },
    });
    if (r.status === 401) {
      console.log(no("la API key no es válida"));
      fallos++;
    } else if (!r.ok) {
      console.log(no(`Resend respondió ${r.status}`));
      fallos++;
    } else {
      console.log(ok("API key válida"));
      const { data } = await r.json();
      const dominios = data ?? [];
      if (!dominios.length) {
        console.log(warn("todavía no hay dominios verificados en Resend"));
        avisos++;
      }
      for (const d of dominios) {
        const v = d.status === "verified";
        console.log(v ? ok(`dominio ${d.name} verificado`) : warn(`dominio ${d.name}: ${d.status}`));
        if (!v) avisos++;
      }

      // El remitente tiene que pertenecer a un dominio verificado.
      const from = val("MAIL_FROM");
      if (!from) {
        console.log(no("MAIL_FROM vacía — sin remitente no se envía nada"));
        fallos++;
      } else {
        const dominioFrom = from.match(/@([^>\s]+)/)?.[1];
        const coincide = dominios.some(
          (d) => d.status === "verified" && d.name === dominioFrom,
        );
        console.log(
          coincide
            ? ok(`MAIL_FROM usa ${dominioFrom}, que está verificado`)
            : warn(`MAIL_FROM usa ${dominioFrom ?? "(sin dominio)"} — Resend rechaza remitentes no verificados`),
        );
        if (!coincide) avisos++;
      }
    }
  } catch (err) {
    console.log(no(`no se pudo consultar Resend: ${err.message}`));
    fallos++;
  }
}
console.log(hay("MAIL_TO") ? ok("MAIL_TO configurada") : warn("MAIL_TO vacía — se usa NEXT_PUBLIC_EMAIL"));

// ------------------------------------------------------------------ Anti-spam
console.log(titulo("Anti-spam"));
if (!hay("IP_HASH_SALT")) {
  console.log(no("IP_HASH_SALT vacía — se usaría la sal por defecto, que es pública"));
  fallos++;
} else if (val("IP_HASH_SALT").length < 32) {
  console.log(warn("IP_HASH_SALT es corta; conviene de 32 caracteres para arriba"));
  avisos++;
} else {
  console.log(ok("IP_HASH_SALT configurada"));
}

// ------------------------------------------------------------------- Públicas
console.log(titulo("Datos públicos"));
for (const [k, nota] of [
  ["NEXT_PUBLIC_SITE_URL", "se usa en canonical, sitemap y enlaces de correo"],
  ["NEXT_PUBLIC_PHONE", "WhatsApp"],
  ["NEXT_PUBLIC_EMAIL", "correo de contacto"],
]) {
  if (hay(k)) console.log(ok(k));
  else {
    console.log(no(`${k} vacía — ${nota}`));
    fallos++;
  }
}
for (const [k, nota] of [
  ["NEXT_PUBLIC_FACEBOOK", "el botón de Facebook no se muestra"],
  ["NEXT_PUBLIC_INSTAGRAM", "el botón de Instagram no se muestra"],
  ["NEXT_PUBLIC_RUC", "la página jurídica dice «RUC pendiente de carga»"],
  ["NEXT_PUBLIC_GA_ID", "no se carga analítica, ni con consentimiento"],
]) {
  if (hay(k)) console.log(ok(k));
  else {
    console.log(warn(`${k} vacía — ${nota}`));
    avisos++;
  }
}

// -------------------------------------------------------------------- Resumen
console.log(titulo("Resumen"));
if (fallos) {
  console.log(no(`${fallos} problema(s) que hay que resolver, ${avisos} aviso(s).`));
  process.exit(1);
}
console.log(ok(`Sin problemas. ${avisos} aviso(s) — el sitio funciona igual.`));
