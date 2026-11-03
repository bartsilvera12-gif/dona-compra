/**
 * Carga las publicaciones de ejemplo en la base.
 *
 *   npm run db:seed
 *
 * Es idempotente: reconoce las publicaciones por su slug, así que correrlo
 * dos veces no duplica nada. No toca las publicaciones que no vengan del
 * archivo de ejemplo.
 */

import { sql, cerrar } from "./conexion.mjs";

import { readFileSync } from "node:fs";


// Se leen los datos del mismo archivo que usa la aplicación, extrayendo los
// objetos con una evaluación acotada para no depender de un compilador de TS.
const fuente = readFileSync(new URL("../src/db/anuncios-demo.ts", import.meta.url), "utf8");
const cuerpo = fuente.slice(fuente.indexOf("export const DEMO"));
const arreglo = cuerpo.slice(cuerpo.indexOf("["), cuerpo.lastIndexOf("]") + 1);

const base = {
  estado: "publicada",
  videoUrl: null,
  imagenAlt: null,
  notaModeracion: null,
  creadoEn: new Date(),
  publicadoEn: new Date(),
};
const DEMO = new Function("base", `return ${arreglo}`)(base);


let creadas = 0;
let actualizadas = 0;

for (const p of DEMO) {
  const [existente] = await sql`
    select id from publicaciones where slug = ${p.slug} limit 1`;

  if (existente) {
    await sql`
      update publicaciones set
        titulo = ${p.titulo}, texto = ${p.texto}, tipo = ${p.tipo},
        categoria = ${p.categoria}, ciudad = ${p.ciudad}, precio = ${p.precio},
        autor = ${p.autor}, imagen = ${p.imagen}, fecha = ${p.fecha}
      where slug = ${p.slug}`;
    actualizadas++;
  } else {
    await sql`
      insert into publicaciones
        (slug, titulo, texto, tipo, categoria, ciudad, precio, autor, imagen,
         fecha, estado, publicado_en)
      values
        (${p.slug}, ${p.titulo}, ${p.texto}, ${p.tipo}, ${p.categoria},
         ${p.ciudad}, ${p.precio}, ${p.autor}, ${p.imagen}, ${p.fecha},
         'publicada', now())`;
    creadas++;
  }
}

console.log(`✓ ${creadas} publicación(es) creada(s), ${actualizadas} actualizada(s).`);
console.log("  Todas quedan en estado «publicada».");

// Con el driver nativo hay que cerrar el pool o el proceso no termina.
await cerrar();
