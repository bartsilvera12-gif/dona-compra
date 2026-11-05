/**
 * Genera el bloque HTML de las Condiciones Generales para el sitio estático.
 *
 * El sitio estático no comparte código con la app, así que sin esto habría
 * dos transcripciones del contrato que se irían separando con el tiempo.
 * Acá se arma desde las mismas fuentes que usa la app —`cgv.ts` para el
 * texto, `niveles.ts` para las grillas— y se pega en index.html.
 *
 *   node --experimental-strip-types scripts/cgv-estatico.ts
 */
import { CGV, CGV_VERSION } from "../src/lib/cgv.ts";
import {
  NIVELES,
  NIVELES_DE_ENTRADA,
  NOMBRE_SERVICIO,
  totalServicios,
  type Servicios,
} from "../src/lib/niveles.ts";

const gs = (n: number) => n.toLocaleString("es-PY");
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const TH =
  "border-bottom:1px solid rgba(27,59,43,0.2);padding:10px 12px 10px 0;font-weight:500;color:#1B3B2B";
const TD = "border-bottom:1px solid rgba(27,59,43,0.1);padding:10px 12px 10px 0";

function tabla(
  cabeceras: string[],
  filas: string[][],
  pie?: string,
): string {
  const th = cabeceras
    .map(
      (c, i) =>
        `<th scope="col" style="${TH};text-align:${i ? "right" : "left"}">${esc(c)}</th>`,
    )
    .join("");
  const tb = filas
    .map(
      (f) =>
        "<tr>" +
        f
          .map((celda, i) =>
            i === 0
              ? `<td style="${TD};text-align:left;font-weight:500;color:#1B3B2B">${esc(celda)}</td>`
              : `<td style="${TD};text-align:right;font-variant-numeric:tabular-nums;color:#2F4237">${esc(celda)}</td>`,
          )
          .join("") +
        "</tr>",
    )
    .join("");
  return (
    `<div style="margin-top:20px;overflow-x:auto"><table style="width:100%;min-width:520px;border-collapse:collapse;font-size:14.5px">` +
    `<thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table>` +
    (pie
      ? `<p style="margin:8px 0 0;font-size:13px;color:#4F5C54">${esc(pie)}</p>`
      : "") +
    `</div>`
  );
}

function grilla(cual: string): string {
  if (cual === "analisis")
    return tabla(
      ["Nivel", "Precio del Análisis"],
      NIVELES_DE_ENTRADA.map((n) => [n.nombre, `${gs(n.analisis as number)} Gs`]),
      "A Rubis y Diamante no se entra de forma directa: se llega por ascenso.",
    );
  if (cual === "cupos")
    return tabla(
      ["Nivel", "Cupo (costo mayorista de mercaderías)", "Pedido mínimo (costo mayorista)"],
      NIVELES.map((n) => [n.nombre, `${gs(n.tope)} Gs`, `${gs(n.minimo)} Gs`]),
    );
  if (cual === "recargos")
    return tabla(
      ["Nivel", "Recargo comercial (escala estándar)"],
      NIVELES.map((n) => [n.nombre, `${Math.round(n.recargo * 100)} %`]),
    );
  const claves = Object.keys(NOMBRE_SERVICIO) as (keyof Servicios)[];
  return tabla(
    ["Nivel", ...claves.map((k) => NOMBRE_SERVICIO[k]), "Total servicios"],
    NIVELES.map((n) => [
      n.nombre,
      ...claves.map((k) => gs(n.servicios[k])),
      gs(totalServicios(n.servicios)),
    ]),
    "Tarifas fijas por pedido, en guaraníes.",
  );
}

const P = "margin:10px 0 0;font-size:15.5px;line-height:1.65;color:#2F4237";
const H3 =
  "font-family:Montserrat,sans-serif;font-weight:600;font-size:clamp(17px,2vw,20px);line-height:1.25;color:#1B3B2B;margin:32px 0 8px";

let html =
  `<p style="margin:16px 0 0;font-size:14.5px;line-height:1.6;color:#4F5C54">Versión ${esc(CGV_VERSION)}. ` +
  `Transcripción del documento que firma el comerciante, publicada para consulta. ` +
  `En caso de diferencia, el ejemplar firmado por ambas partes es el que vale.</p>`;

for (const a of CGV) {
  html += `<h3 style="${H3}">Artículo ${a.n} &mdash; ${esc(a.titulo)}</h3>`;
  for (const t of a.intro ?? []) html += `<p style="${P}">${esc(t)}</p>`;
  if (a.puntos?.length)
    html +=
      `<ol style="margin:12px 0 0;padding-left:22px;font-size:15.5px;line-height:1.65;color:#2F4237">` +
      a.puntos.map((t) => `<li style="margin-top:10px">${esc(t)}</li>`).join("") +
      `</ol>`;
  if (a.tabla) html += grilla(a.tabla);
  for (const t of a.cierre ?? []) html += `<p style="${P}">${esc(t)}</p>`;
  if (a.tablaCierre) html += grilla(a.tablaCierre);
}

process.stdout.write(html);
