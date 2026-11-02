/**
 * Auditoría de contraste WCAG sobre las combinaciones de color del sitio.
 *
 *   npm run check:contraste
 *
 * El pliego pide accesibilidad AA: 4.5:1 para texto normal y 3:1 para texto
 * grande (18.66px en negrita, o 24px) y para elementos de interfaz.
 */

const hex = (c) => {
  const h = c.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

const canal = (v) => {
  const x = v / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
};

const lum = (rgb) => {
  const [r, g, b] = rgb.map(canal);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Compone un color con opacidad sobre su fondo. */
const sobre = (fg, bg, a) =>
  hex(fg).map((f, i) => Math.round(f * a + hex(bg)[i] * (1 - a)));

const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

const C = {
  card: "#FCFCFC",
  navy: "#1A365D",
  navyDark: "#12284A",
  ink: "#4A4A4A",
  muted: "#6B6B6B",
  terracotta: "#C25E38",
  terracottaInk: "#AE5432",
  terracottaSoft: "#E8A98E",
  error: "#EF4444",
  errorInk: "#C0392B",
  // Punto más claro del degradado de fondo, el caso más exigente.
  fondo: "#FDF0EF",
};

const casos = [
  // [descripción, color de texto, fondo, ¿texto grande o elemento de UI?]
  ["Texto corriente sobre tarjeta", C.ink, C.card, false],
  ["Texto corriente sobre degradado", C.ink, C.fondo, false],
  ["Notas (muted) sobre tarjeta", C.muted, C.card, false],
  ["Notas (muted) sobre degradado", C.muted, C.fondo, false],
  ["Títulos navy sobre tarjeta", C.navy, C.card, false],
  ["Enlaces terracotta-ink sobre tarjeta", C.terracottaInk, C.card, false],
  ["Enlaces terracotta-ink sobre degradado", C.terracottaInk, C.fondo, false],
  ["Texto de error sobre tarjeta", C.errorInk, C.card, false],
  ["Texto de error sobre degradado", C.errorInk, C.fondo, false],
  ["Borde de error (UI)", C.error, C.card, true],
  ["Botón: texto claro sobre navy", C.card, C.navy, false],
  ["Botón: texto claro sobre terracotta-ink", C.card, C.terracottaInk, false],
  ["Footer: títulos terracotta-soft", C.terracottaSoft, C.navyDark, false],
  ["CTA: texto claro sobre navy", C.card, C.navy, false],
  // Decorativo: solo necesita 3:1 como elemento de interfaz.
  ["Borde/acento terracotta sobre tarjeta", C.terracotta, C.card, true],
];

// Textos con opacidad sobre superficies oscuras.
const conOpacidad = [
  ["Footer: texto 60% sobre navy-dark", C.card, C.navyDark, 0.6, false],
  ["Footer: enlaces 78% sobre navy-dark", C.card, C.navyDark, 0.78, false],
  ["Footer: copyright 65% sobre navy-dark", C.card, C.navyDark, 0.65, false],
  ["Cinta: texto 60% sobre navy-dark", C.card, C.navyDark, 0.6, false],
  ["Banner cookies: texto 75%", C.card, C.navyDark, 0.75, false],
  ["CTA: bajada 75% sobre navy", C.card, C.navy, 0.75, false],
];

let fallos = 0;
const ok = (s) => `\x1b[32m✓\x1b[0m ${s}`;
const no = (s) => `\x1b[31m✗\x1b[0m ${s}`;

console.log("\n\x1b[1mContraste WCAG AA\x1b[0m\n");

const informar = (desc, r, grande) => {
  const umbral = grande ? 3 : 4.5;
  const linea = `${desc.padEnd(42)} ${r.toFixed(2).padStart(6)}  (mín. ${umbral})`;
  if (r >= umbral) console.log(ok(linea));
  else {
    console.log(no(linea));
    fallos++;
  }
};

for (const [desc, fg, bg, grande] of casos) {
  informar(desc, ratio(hex(fg), hex(bg)), grande);
}
for (const [desc, fg, bg, a, grande] of conOpacidad) {
  informar(desc, ratio(sobre(fg, bg, a), hex(bg)), grande);
}

console.log();
if (fallos) {
  console.log(no(`${fallos} combinación(es) por debajo de AA.`));
  process.exit(1);
}
console.log(ok("Todas las combinaciones cumplen WCAG AA."));
