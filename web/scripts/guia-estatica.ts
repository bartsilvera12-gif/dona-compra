/**
 * Genera, para el sitio estático, las cinco secciones de la guía de diseño
 * del cliente: los cinco pasos, el acompañamiento, los rubros, los
 * requisitos y la franja «Doña te cuida».
 *
 * El sitio estático no comparte código con la app, así que sin esto habría
 * dos copias de cada texto y de cada ícono, que con el tiempo dirían cosas
 * distintas. Acá sale todo de las mismas fuentes:
 *
 *   - los textos, de `src/lib/guia.ts`;
 *   - los dibujos, de `src/components/Iconos.tsx`, leído y traducido de JSX
 *     a HTML. Se lee el archivo en vez de copiar los trazos justamente para
 *     que no haya dos juegos de íconos.
 *
 *   node --experimental-strip-types scripts/guia-estatica.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import {
  ACOMPANA,
  ACOMPANA_BAJADA,
  ACOMPANA_TITULO,
  CUIDA,
  CUIDA_TITULO,
  PASOS,
  PASOS_BAJADA,
  PASOS_TITULO,
  REQUISITOS,
  REQUISITOS_BAJADA,
  REQUISITOS_PIE,
  REQUISITOS_TITULO,
  RUBROS,
  RUBROS_BAJADA,
  RUBROS_PIE,
  RUBROS_TITULO,
} from "../src/lib/guia.ts";

const CR = "\r\n";
const INDICE = "../../index.html";
const GEMELO = "../../Doña Compra.dc.html";

/* --- texto -------------------------------------------------------------- */

const ENTIDADES: [RegExp, string][] = [
  [/&/g, "&amp;"],
  [/ñ/g, "&ntilde;"],
  [/Ñ/g, "&Ntilde;"],
  [/á/g, "&aacute;"],
  [/é/g, "&eacute;"],
  [/í/g, "&iacute;"],
  [/ó/g, "&oacute;"],
  [/ú/g, "&uacute;"],
  [/Á/g, "&Aacute;"],
  [/É/g, "&Eacute;"],
  [/Í/g, "&Iacute;"],
  [/Ó/g, "&Oacute;"],
  [/¿/g, "&iquest;"],
  [/«/g, "&laquo;"],
  [/»/g, "&raquo;"],
  [/—/g, "&mdash;"],
];

const esc = (s: string) =>
  ENTIDADES.reduce((t, [de, a]) => t.replace(de, a), s);

/* --- íconos ------------------------------------------------------------- */

/**
 * Lee los trazos de Iconos.tsx y los pasa de JSX a HTML. Es un traductor
 * mínimo a propósito: solo entiende lo que ese archivo usa —path, circle y
 * un text—, y revienta si aparece algo que no sabe traducir, que es mejor
 * que emitir SVG roto en silencio.
 */
function leerIconos(): Record<string, string> {
  const fuente = readFileSync(
    new URL("../src/components/Iconos.tsx", import.meta.url),
    "utf8",
  );
  const cuerpo = fuente.slice(
    fuente.indexOf("const TRAZOS"),
    fuente.indexOf("export default function Icono"),
  );
  const iconos: Record<string, string> = {};
  const re = /^ {2}([a-z]+): \(\r?\n([\s\S]*?)^ {2}\),$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(cuerpo)) !== null) {
    iconos[m[1]] = aHtml(m[2]);
  }
  return iconos;
}

function aHtml(jsx: string): string {
  let t = jsx
    .replace(/<>|<\/>/g, "")
    .replace(/\{"\s*"\}/g, " ")
    .replace(/textAnchor=/g, "text-anchor=")
    .replace(/fontSize=/g, "font-size=")
    .replace(/fontWeight=/g, "font-weight=")
    .replace(/strokeWidth=/g, "stroke-width=")
    .replace(/strokeLinecap=/g, "stroke-linecap=")
    .replace(/strokeLinejoin=/g, "stroke-linejoin=")
    // Las etiquetas vacías de JSX cierran con /> y en HTML no.
    .replace(/<(path|circle)([^>]*?)\s*\/>/g, "<$1$2></$1>")
    .replace(/\s+/g, " ")
    .trim();
  const sobra = t.match(/\/>/);
  if (sobra) throw new Error("no sé traducir esto a HTML: " + t);
  return t;
}

const ICONOS = leerIconos();

function svg(nombre: string, tam: number, color?: string): string {
  const trazos = ICONOS[nombre];
  if (!trazos) throw new Error("falta el ícono " + nombre + " en Iconos.tsx");
  const estilo = color ? ` style="color:${color}"` : "";
  return (
    `<svg viewBox="0 0 24 24" width="${tam}" height="${tam}" aria-hidden="true" ` +
    `fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" ` +
    `stroke-linejoin="round"${estilo}>${trazos}</svg>`
  );
}

/* --- colores (los mismos que los tokens del sitio en Next) --------------- */

const VERDE = "#163923";
const VERDE_CLARO = "#1F5132";
const OCRE = "#DE9B2B";
const OCRE_INK = "#875F1A";
const MARFIL = "#F5F2EB";
const SALVIA25 = "#D4DCD0";
const GRAD = "#E2EBE5";
const INK = "#2F4237";
const MUTED = "#4F5C54";

const H2 =
  "font-family:Montserrat,sans-serif;font-weight:600;font-size:clamp(28px,4.4vw,52px);" +
  `line-height:1.08;color:${VERDE};text-wrap:pretty`;
const H3 =
  "font-family:Montserrat,sans-serif;font-weight:600;line-height:1.25;" +
  `color:${VERDE}`;
const WRAP =
  "max-width:1280px;margin:0 auto;padding:clamp(44px,7vw,96px) clamp(18px,4vw,40px)";

function rotuloCentrado(texto: string): string {
  return (
    `<span class="dcx-rotulo dcx-rotulo-centro">${esc(texto)}</span>`
  );
}

function encabezado(rotulo: string, titulo: string, bajada: string): string {
  return (
    `<div style="max-width:52ch;margin:0 auto;text-align:center">` +
    rotuloCentrado(rotulo) +
    `<h2 style="${H2};margin:16px auto 0">${esc(titulo)}</h2>` +
    `<p style="font-size:16px;line-height:1.6;color:${INK};margin:16px auto 0;max-width:44ch">${esc(bajada)}</p>` +
    `</div>`
  );
}

/* --- las cinco secciones ------------------------------------------------ */

function asiDeSimple(): string {
  const tarjetas = PASOS.map(
    (p, i) =>
      `<li style="display:flex"><div class="dcx-paso">` +
      `<span class="dcx-paso-num">${i + 1}</span>` +
      `<span style="margin-top:-12px;color:${OCRE_INK}">${svg(p.icono, 30)}</span>` +
      `<h3 style="${H3};font-size:clamp(16px,1.8vw,18px);margin:16px 0 0">${esc(p.titulo)}</h3>` +
      `<p style="font-size:14.5px;line-height:1.6;color:${MUTED};margin:8px 0 0">${esc(p.texto)}</p>` +
      `</div></li>`,
  ).join("");
  return (
    `    <section style="background:${SALVIA25};position:relative;overflow:hidden">${CR}` +
    `      <div style="${WRAP}">${CR}` +
    `        ${encabezado("Cómo funciona", PASOS_TITULO, PASOS_BAJADA)}${CR}` +
    `        <div class="dcx-pasos-caja">${CR}` +
    `          <span aria-hidden="true" class="dcx-pasos-hilo"></span>${CR}` +
    `          <ol class="dcx-pasos">${tarjetas}</ol>${CR}` +
    `        </div>${CR}` +
    `        <p style="margin:40px 0 0;text-align:center"><a href="#/contacto" data-cta="true" style="display:inline-block;background:${OCRE};color:${VERDE}">Agend&aacute; tu reuni&oacute;n</a></p>${CR}` +
    `      </div>${CR}` +
    `    </section>${CR}`
  );
}

function acompanamiento(): string {
  const items = ACOMPANA.map(
    (a) =>
      `<li class="dcx-acompana-item">` +
      `<span class="dcx-acompana-ico">${svg(a.icono, 21)}</span>` +
      `<span><strong style="display:block;font-size:16px;font-weight:600;color:${VERDE}">${esc(a.titulo)}</strong>` +
      `<span style="display:block;margin-top:4px;font-size:14.5px;line-height:1.6;color:${MUTED}">${esc(a.texto)}</span></span>` +
      `</li>`,
  ).join("");
  return (
    `    <section style="background:${MARFIL};overflow:hidden">${CR}` +
    `      <div class="dcx-acompana">${CR}` +
    `        <div class="dcx-acompana-foto"><img src="assets/portada-acompana.jpg" alt="Do&ntilde;a Compra conversando con una comerciante en el mostrador de su tienda" loading="lazy" decoding="async" /></div>${CR}` +
    `        <div class="dcx-acompana-texto">${CR}` +
    `          <span class="dcx-rotulo">Acompa&ntilde;amiento</span>${CR}` +
    `          <h2 style="${H2};margin:16px 0 0;max-width:16ch">${esc(ACOMPANA_TITULO)}</h2>${CR}` +
    `          <p style="font-size:16px;line-height:1.6;color:${INK};margin:16px 0 0;max-width:44ch">${esc(ACOMPANA_BAJADA)}</p>${CR}` +
    `          <ul class="dcx-acompana-lista">${items}</ul>${CR}` +
    `          <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:36px">` +
    `<a href="{{ waLink }}" target="_blank" rel="noopener noreferrer" data-cta="true" style="display:inline-block;background:${VERDE};color:${MARFIL}">Escribile a Do&ntilde;a</a>` +
    `<a href="#/contacto" data-cta="true" style="display:inline-block;border:1px solid rgba(22,57,35,0.3);color:${VERDE}">Agend&aacute; tu reuni&oacute;n</a>` +
    `</div>${CR}` +
    `        </div>${CR}` +
    `      </div>${CR}` +
    `    </section>${CR}`
  );
}

function rubros(): string {
  const tarjetas = RUBROS.map(
    (r) =>
      `<li style="display:flex"><a class="dcx-rubro" href="{{ waLink }}" target="_blank" rel="noopener noreferrer">` +
      `<span class="dcx-rubro-ico">${svg(r.icono, 30)}</span>` +
      `<span class="dcx-rubro-nombre">${esc(r.nombre)}</span>` +
      `<span class="dcx-rubro-caja"><span class="dcx-rubro-corte"><span class="dcx-rubro-frase">${esc(r.frase)}</span></span></span>` +
      `</a></li>`,
  ).join("");
  return (
    `    <section style="background:${GRAD}">${CR}` +
    `      <div style="${WRAP}">${CR}` +
    `        ${encabezado("Para quién es", RUBROS_TITULO, RUBROS_BAJADA)}${CR}` +
    `        <ul class="dcx-rubros">${tarjetas}</ul>${CR}` +
    `        <p style="margin:36px 0 0;text-align:center;font-size:15px;color:${INK}">` +
    `<a href="{{ waLink }}" target="_blank" rel="noopener noreferrer" style="color:${OCRE_INK};font-weight:500;text-decoration:underline;text-underline-offset:4px">${esc(RUBROS_PIE)} &rarr;</a></p>${CR}` +
    `      </div>${CR}` +
    `    </section>${CR}`
  );
}

const TILDE =
  '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" ' +
  'stroke="currentColor" stroke-width="2.6" stroke-linecap="round" ' +
  'stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"></path></svg>';

function requisitos(): string {
  const tarjetas = REQUISITOS.map(
    (r) =>
      `<li style="display:flex"><div class="dcx-req">` +
      `<span aria-hidden="true" class="dcx-req-tilde">${TILDE}</span>` +
      `<span class="dcx-req-ico">${svg(r.icono, 26)}</span>` +
      `<h3 style="font-family:Montserrat,sans-serif;font-weight:600;line-height:1.25;color:${MARFIL};font-size:clamp(17px,2vw,20px);margin:20px 0 0">${esc(r.titulo)}</h3>` +
      `<p style="font-size:15px;line-height:1.6;color:rgba(245,242,235,0.75);margin:8px 0 0">${esc(r.texto)}</p>` +
      `</div></li>`,
  ).join("");
  return (
    `    <section style="background:${MARFIL}">${CR}` +
    `      <div style="${WRAP}">${CR}` +
    `        ${encabezado("Requisitos", REQUISITOS_TITULO, REQUISITOS_BAJADA)}${CR}` +
    `        <ul class="dcx-reqs">${tarjetas}</ul>${CR}` +
    `        <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:16px 24px;margin:40px 0 0;text-align:center">` +
    `<p style="margin:0;font-family:Montserrat,sans-serif;font-weight:600;font-size:clamp(17px,2vw,21px);color:${VERDE}">${esc(REQUISITOS_PIE)}</p>` +
    `<a href="#/contacto" data-cta="true" style="display:inline-block;background:${VERDE};color:${MARFIL}">Agend&aacute; tu reuni&oacute;n</a></div>${CR}` +
    `      </div>${CR}` +
    `    </section>${CR}`
  );
}

function donaTeCuida(telefono: string): string {
  const items = CUIDA.map(
    (c) =>
      `<li class="dcx-cuida-item"><span class="dcx-cuida-ico">${svg(c.icono, 23)}</span>` +
      `<span class="dcx-cuida-txt">${esc(c.texto)}</span></li>`,
  ).join("");
  return (
    `    <section style="background:${SALVIA25};border-top:1px solid rgba(22,57,35,0.1);border-bottom:1px solid rgba(22,57,35,0.1)">${CR}` +
    `      <div style="max-width:1280px;margin:0 auto;padding:clamp(32px,4.5vw,56px) clamp(18px,4vw,40px)">${CR}` +
    `        <div style="display:flex;flex-wrap:wrap;align-items:baseline;justify-content:center;gap:4px 16px;text-align:center">` +
    `<h2 style="${H2};font-size:clamp(20px,2.6vw,28px);margin:0">${esc(CUIDA_TITULO)}</h2>` +
    `<p style="margin:0;font-size:15px;color:${MUTED}">Nuestro &uacute;nico n&uacute;mero es el ${telefono}.</p></div>${CR}` +
    `        <ul class="dcx-cuida">${items}</ul>${CR}` +
    `      </div>${CR}` +
    `    </section>${CR}`
  );
}

/* --- CSS de las piezas nuevas ------------------------------------------- */

const CSS = [
  "  /* Los cinco pasos. */",
  "  .dcx-pasos-caja { position: relative; margin-top: 48px; }",
  "  .dcx-pasos { display: flex; gap: 16px; margin: 0; padding: 32px 0 8px; list-style: none;" +
    " overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; }",
  "  .dcx-pasos::-webkit-scrollbar { display: none; }",
  "  .dcx-pasos > li { flex: none; width: 78vw; max-width: 300px; scroll-snap-align: start; }",
  "  .dcx-paso { display: flex; flex-direction: column; align-items: center; width: 100%;" +
    ` text-align: center; border: 1px solid rgba(22,57,35,0.1); background: ${MARFIL};` +
    " border-radius: 12px; padding: 0 20px 24px; }",
  "  .dcx-paso-num { display: grid; place-items: center; width: 56px; height: 56px;" +
    ` transform: translateY(-28px); border-radius: 50%; background: ${VERDE};` +
    ` font-family: Montserrat, sans-serif; font-size: 20px; font-weight: 700; color: ${MARFIL}; }`,
  "  .dcx-pasos-hilo { display: none; }",
  "  @media (min-width: 640px) { .dcx-pasos > li { width: 46vw; } }",
  "  @media (min-width: 1024px) {",
  "    .dcx-pasos { display: grid; grid-template-columns: repeat(5, 1fr); overflow: visible; padding-top: 0; }",
  "    .dcx-pasos > li { width: auto; max-width: none; }",
  "    .dcx-pasos-hilo { display: block; position: absolute; top: 28px; left: 10%; right: 10%;" +
    " border-top: 2px dashed rgba(22,57,35,0.15); pointer-events: none; }",
  "  }",
  "",
  "  /* Acompañamiento. */",
  "  .dcx-acompana { display: grid; align-items: center; gap: clamp(28px,4vw,72px);" +
    " max-width: 1280px; margin: 0 auto; padding: clamp(44px,7vw,96px) clamp(18px,4vw,40px); }",
  `  .dcx-acompana-foto { position: relative; aspect-ratio: 5 / 4; overflow: hidden; border-radius: 12px; background: ${GRAD}; }`,
  "  .dcx-acompana-foto img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 35%; display: block; }",
  "  .dcx-acompana-lista { display: grid; margin: 32px 0 0; padding: 0; list-style: none; }",
  "  .dcx-acompana-item { display: flex; align-items: flex-start; gap: 16px;" +
    " border-top: 1px solid rgba(22,57,35,0.1); padding: 16px 0; }",
  "  .dcx-acompana-item:first-child { border-top: 0; padding-top: 0; }",
  "  .dcx-acompana-ico { display: grid; place-items: center; flex: none; width: 44px; height: 44px;" +
    ` border-radius: 50%; background: rgba(112,154,125,0.3); color: ${VERDE}; }`,
  "  @media (min-width: 1024px) {",
  "    .dcx-acompana { grid-template-columns: 1fr minmax(0,46ch);" +
    " padding-left: max(clamp(18px,4vw,40px), calc((100vw - 1280px) / 2)); padding-right: 0; }",
  "    .dcx-acompana-foto { aspect-ratio: 4 / 3; margin-left: calc(-1 * max(clamp(18px,4vw,40px), calc((100vw - 1280px) / 2)));" +
    " border-top-left-radius: 0; border-bottom-left-radius: 0; }",
  "    .dcx-acompana-texto { padding-right: clamp(18px,4vw,40px); }",
  "  }",
  "",
  "  /* Rubros. */",
  "  .dcx-rubros { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;" +
    " margin: 40px 0 0; padding: 0; list-style: none; }",
  "  @media (min-width: 640px) { .dcx-rubros { grid-template-columns: repeat(3, 1fr); } }",
  "  @media (min-width: 1024px) { .dcx-rubros { grid-template-columns: repeat(4, 1fr); } }",
  "  .dcx-rubro { display: flex; flex-direction: column; align-items: center; width: 100%;" +
    ` text-align: center; border: 1px solid rgba(22,57,35,0.1); background: ${MARFIL};` +
    " border-radius: 12px; padding: clamp(14px,2vw,22px); text-decoration: none;" +
    " transition: border-color 0.2s; }",
  `  .dcx-rubro:hover, .dcx-rubro:focus-visible { border-color: ${OCRE}; }`,
  `  .dcx-rubro-ico { color: ${VERDE}; transition: color 0.2s; }`,
  `  .dcx-rubro:hover .dcx-rubro-ico, .dcx-rubro:focus-visible .dcx-rubro-ico { color: ${OCRE_INK}; }`,
  `  .dcx-rubro-nombre { margin-top: 12px; font-size: 15px; font-weight: 600; color: ${VERDE}; }`,
  "  .dcx-rubro-caja { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s; }",
  "  .dcx-rubro:hover .dcx-rubro-caja, .dcx-rubro:focus-within .dcx-rubro-caja { grid-template-rows: 1fr; }",
  "  .dcx-rubro-corte { overflow: hidden; }",
  "  .dcx-rubro-frase { display: block; margin-top: 8px; font-size: 13.5px; line-height: 1.35;" +
    ` color: ${MUTED}; opacity: 0; transition: opacity 0.2s; }`,
  "  .dcx-rubro:hover .dcx-rubro-frase, .dcx-rubro:focus-within .dcx-rubro-frase { opacity: 1; }",
  "  @media (prefers-reduced-motion: reduce) { .dcx-rubro-caja, .dcx-rubro-frase { transition: none; } }",
  "",
  "  /* Requisitos. */",
  "  .dcx-reqs { display: grid; gap: 16px; margin: 40px 0 0; padding: 0; list-style: none; }",
  "  @media (min-width: 768px) { .dcx-reqs { grid-template-columns: repeat(3, 1fr); } }",
  "  .dcx-req { position: relative; display: flex; flex-direction: column; width: 100%;" +
    ` overflow: hidden; border-radius: 12px; background: ${VERDE}; color: ${MARFIL};` +
    " padding: clamp(20px,2.6vw,30px); }",
  "  .dcx-req-tilde { position: absolute; top: 0; right: 0; display: grid; place-items: center;" +
    ` width: 40px; height: 40px; border-bottom-left-radius: 12px; background: ${OCRE}; color: ${VERDE}; }`,
  "  .dcx-req-ico { display: grid; place-items: center; width: 56px; height: 56px;" +
    ` border-radius: 50%; background: ${OCRE}; color: ${VERDE}; }`,
  "",
  "  /* Doña te cuida. */",
  "  .dcx-cuida { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px 20px;" +
    " margin: 32px 0 0; padding: 0; list-style: none; }",
  "  @media (min-width: 1024px) { .dcx-cuida { grid-template-columns: repeat(4, 1fr); } }",
  "  .dcx-cuida-item { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }",
  "  .dcx-cuida-ico { display: grid; place-items: center; width: 48px; height: 48px;" +
    ` border-radius: 50%; background: ${MARFIL}; color: ${VERDE}; }`,
  `  .dcx-cuida-txt { font-size: 14.5px; line-height: 1.35; font-weight: 500; color: ${VERDE}; }`,
].join(CR);

/* --- montaje ------------------------------------------------------------ */

const ruta = new URL(INDICE, import.meta.url);
let html = readFileSync(ruta, "utf8");

const telefono =
  html.match(/Nuestro &uacute;nico n&uacute;mero es el ([\d ]+)\./)?.[1] ??
  "0994 876 333";

const ABRE = "    <!-- GUIA:INICIO -->" + CR;
const CIERRA = "    <!-- GUIA:FIN -->" + CR;

const bloque =
  ABRE +
  "    <!-- Generado por scripts/guia-estatica.ts desde src/lib/guia.ts y" + CR +
  "         src/components/Iconos.tsx. No editar a mano: se pisa. -->" + CR +
  asiDeSimple() +
  acompanamiento() +
  rubros() +
  requisitos() +
  donaTeCuida(telefono) +
  CIERRA;

if (html.includes(ABRE)) {
  const i = html.indexOf(ABRE);
  const j = html.indexOf(CIERRA, i) + CIERRA.length;
  html = html.slice(0, i) + bloque + html.slice(j);
} else {
  // Primera vez: va después de la sección «No somos un banco», que es la
  // última que dejó el paso anterior pegada a la portada.
  const ancla = "    <!-- Banda oscura para el video.";
  const k = html.indexOf(ancla);
  if (k === -1) throw new Error("no encuentro dónde pegar el bloque");
  html = html.slice(0, k) + bloque + html.slice(k);
}

const MARCA_CSS = "  /* Los cinco pasos. */";
if (html.includes(MARCA_CSS)) {
  const i = html.indexOf(MARCA_CSS);
  const j = html.indexOf(CR + "</style>", i);
  html = html.slice(0, i) + CSS + html.slice(j);
} else {
  const ancla = CR + "</style>";
  const k = html.indexOf(ancla);
  if (k === -1) throw new Error("no encuentro el </style>");
  html = html.slice(0, k) + CR + CSS + html.slice(k);
}

writeFileSync(ruta, html, "utf8");
writeFileSync(new URL(GEMELO, import.meta.url), html, "utf8");

console.log(
  `OK — ${PASOS.length} pasos, ${ACOMPANA.length} ítems de acompañamiento, ` +
    `${RUBROS.length} rubros, ${REQUISITOS.length} requisitos y ${CUIDA.length} señales, ` +
    `con ${Object.keys(ICONOS).length} íconos leídos de Iconos.tsx`,
);
