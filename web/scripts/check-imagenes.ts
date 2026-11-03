/**
 * Prueba la validación y el reprocesado de imágenes.
 *
 *   npm run check:imagenes
 *
 * Importa el módulo real, no una copia: Node 24 ejecuta TypeScript directo.
 */

import sharp from "sharp";
import { procesarImagen, nombreSeguro, MAX_BYTES } from "../src/lib/imagenes.ts";

const ok = (s: string) => `\x1b[32m✓\x1b[0m ${s}`;
const no = (s: string) => `\x1b[31m✗\x1b[0m ${s}`;

let fallos = 0;
function comprobar(cond: boolean, texto: string, detalle = "") {
  console.log(cond ? ok(texto) : no(texto));
  if (detalle) console.log(`    ${detalle}`);
  if (!cond) fallos++;
}

const lienzo = (w: number, h: number) =>
  sharp({
    create: {
      width: w,
      height: h,
      channels: 3,
      background: { r: 200, g: 120, b: 60 },
    },
  });

console.log("\n\x1b[1mSe aceptan los formatos de imagen\x1b[0m\n");

for (const fmt of ["jpeg", "png", "webp", "gif"] as const) {
  const buf = await lienzo(400, 300).toFormat(fmt).toBuffer();
  const r = await procesarImagen(buf);
  comprobar(r.ok, `acepta ${fmt.toUpperCase()}`);
}

console.log("\n\x1b[1mSe rechaza lo que no es una imagen\x1b[0m\n");

// SVG: es XML y puede traer <script>. Se rechaza aunque sharp sepa leerlo.
const svg = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><script>alert(1)</script></svg>',
);
const rSvg = await procesarImagen(svg);
comprobar(!rSvg.ok, "rechaza SVG", rSvg.ok ? "" : rSvg.error.slice(0, 72));

// PDF disfrazado: el caso frecuente de arrastrar el archivo equivocado.
const pdf = Buffer.from("%PDF-1.7\n%\xE2\xE3\xCF\xD3\n1 0 obj\n<< >>\nendobj\n");
const rPdf = await procesarImagen(pdf);
comprobar(!rPdf.ok, "rechaza PDF");

// Texto plano con nombre de imagen: la extensión no decide nada.
const txt = Buffer.from("esto no es una imagen, por mas que se llame foto.jpg");
const rTxt = await procesarImagen(txt);
comprobar(!rTxt.ok, "rechaza texto plano con nombre de imagen");

// HTML: si se sirviera desde el mismo origen sería un problema serio.
const html = Buffer.from("<!doctype html><script>alert(1)</script>");
comprobar((await procesarImagen(html)).ok === false, "rechaza HTML");

// Vacío y demasiado grande.
comprobar((await procesarImagen(Buffer.alloc(0))).ok === false, "rechaza archivo vacío");
const enorme = Buffer.alloc(MAX_BYTES + 1, 0xff);
enorme[0] = 0xff; enorme[1] = 0xd8; enorme[2] = 0xff; // encabezado JPEG válido
comprobar(
  (await procesarImagen(enorme)).ok === false,
  `rechaza por encima de ${Math.round(MAX_BYTES / 1024 / 1024)} MB`,
);

// Encabezado JPEG válido con basura detrás: sharp tiene que fallar, no
// interpretar a medias.
const falso = Buffer.concat([
  Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
  Buffer.alloc(200, 0x41),
]);
comprobar(
  (await procesarImagen(falso)).ok === false,
  "rechaza un archivo con encabezado JPEG pero contenido corrupto",
);

console.log("\n\x1b[1mLo que se guarda es seguro\x1b[0m\n");

// Metadatos: una foto de teléfono suele traer la ubicación GPS. Publicar la
// dirección del local de alguien sin querer es un problema real.
const conGps = await lienzo(600, 400)
  .jpeg()
  .withExif({
    IFD0: { Copyright: "Prueba", Artist: "Camara" },
    GPSIFD: { GPSLatitudeRef: "S", GPSLongitudeRef: "W" },
  })
  .toBuffer();

const metaAntes = await sharp(conGps).metadata();
comprobar(!!metaAntes.exif, "la imagen de prueba entra CON metadatos EXIF");

const rGps = await procesarImagen(conGps);
if (rGps.ok) {
  const metaDespues = await sharp(rGps.datos).metadata();
  comprobar(!metaDespues.exif, "los metadatos EXIF se eliminan al reprocesar");
  comprobar(
    !JSON.stringify(metaDespues).toLowerCase().includes("gps"),
    "no queda rastro de GPS en la salida",
  );
} else {
  comprobar(false, "los metadatos EXIF se eliminan al reprocesar", rGps.error);
}

// Políglota: imagen válida con carga útil pegada al final. Al recodificar,
// lo que se guarda es la salida de nuestro codificador.
const poliglota = Buffer.concat([
  await lienzo(300, 200).jpeg().toBuffer(),
  Buffer.from("<?php system($_GET['c']); ?>"),
]);
const rPoli = await procesarImagen(poliglota);
if (rPoli.ok) {
  comprobar(
    !rPoli.datos.includes(Buffer.from("php")),
    "el reprocesado descarta la carga pegada a un archivo políglota",
  );
} else {
  comprobar(false, "el políglota se procesa como imagen", rPoli.error);
}

// Siempre sale WebP, sea cual sea la entrada.
const dePng = await procesarImagen(await lienzo(500, 500).png().toBuffer());
if (dePng.ok) {
  const m = await sharp(dePng.datos).metadata();
  comprobar(m.format === "webp", "un PNG sale convertido a WebP");
}

// El lado mayor se limita.
const gigante = await procesarImagen(await lienzo(4000, 2000).jpeg().toBuffer());
if (gigante.ok) {
  comprobar(
    gigante.ancho === 1600 && gigante.alto === 800,
    `se achica a 1600 px de lado mayor (quedó ${gigante.ancho}×${gigante.alto})`,
  );
}

// Una imagen chica no se agranda.
const chica = await procesarImagen(await lienzo(200, 150).jpeg().toBuffer());
if (chica.ok) {
  comprobar(
    chica.ancho === 200 && chica.alto === 150,
    "una imagen chica no se agranda",
  );
}

console.log("\n\x1b[1mEl nombre del archivo no se usa tal cual\x1b[0m\n");

const casos: [string, string][] = [
  ["../../../etc/passwd", "no permite subir de directorio"],
  ["foto con espacios.JPG", "normaliza espacios y mayúsculas"],
  ["ñandú-áéí.png", "quita las tildes"],
  ["", "sin nombre usa uno por defecto"],
  ["a".repeat(300) + ".jpg", "recorta nombres larguísimos"],
];
for (const [entrada, texto] of casos) {
  const n = nombreSeguro(entrada, "abc123");
  const sano =
    /^[a-z0-9-]+\.webp$/.test(n) &&
    !n.includes("..") &&
    !n.includes("/") &&
    n.length <= 60;
  comprobar(sano, texto, `"${entrada.slice(0, 28)}" → "${n}"`);
}

console.log();
if (fallos) {
  console.log(no(`${fallos} comprobación(es) fallaron.`));
  process.exit(1);
}
console.log(ok("Todas las comprobaciones pasaron."));
