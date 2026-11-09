import { readFileSync } from "node:fs";
import { NIVELES, NOMBRE_SERVICIO, totalServicios, calcular, analisisAcumulado, recargoEfectivo, type Servicios } from "../src/lib/niveles.ts";

// Valores tomados a mano de las CGV, noviembre 2026.
const CGV = {
  recargo:  [18, 17, 16, 15, 14, 13, 12],
  totalSrv: [7000, 8000, 9000, 11500, 14500, 19000, 22500],
  cupo:     [250000, 500000, 1000000, 3000000, 5000000, 8000000, 10000000],
  minimo:   [100000, 150000, 150000, 150000, 150000, 150000, 150000],
  analisis: [50000, 100000, 150000, 150000, 200000, null, null],
  acumul:   [50000, 150000, 300000, 450000, 650000, null, null],
};

let fallos = 0;
const ok = (c: boolean, m: string) => { if (!c) { console.log("FALLA: " + m); fallos++; } };

NIVELES.forEach((n, i) => {
  ok(Math.round(n.recargo * 100) === CGV.recargo[i], `${n.nombre} recargo ${n.recargo * 100} != ${CGV.recargo[i]}`);
  ok(totalServicios(n.servicios) === CGV.totalSrv[i], `${n.nombre} servicios ${totalServicios(n.servicios)} != ${CGV.totalSrv[i]}`);
  ok(n.tope === CGV.cupo[i], `${n.nombre} cupo`);
  ok(n.minimo === CGV.minimo[i], `${n.nombre} minimo`);
  ok(n.analisis === CGV.analisis[i], `${n.nombre} analisis ${n.analisis} != ${CGV.analisis[i]}`);
  ok(analisisAcumulado(n) === CGV.acumul[i], `${n.nombre} acumulado ${analisisAcumulado(n)} != ${CGV.acumul[i]}`);
  ok(n.servicios.seguimiento === 4000 && n.servicios.custodia === 2500, `${n.nombre} fijos`);
});

// Ejemplo literal del art. 6: "un comerciante de nivel Bronce pasa de un
// recargo del 16 % al 15 %".
const bronce = NIVELES[2];
ok(Math.round(recargoEfectivo(bronce, false) * 100) === 16, "Bronce estandar 16 %");
ok(Math.round(recargoEfectivo(bronce, true) * 100) === 15, "Bronce Pagador Rapido 15 %");

// Un pedido de 1.000.000 en Bronce.
const d = calcular(1_000_000, bronce);
ok(d.recargo === 160_000, `Bronce recargo de 1.000.000 = ${d.recargo}`);
ok(d.total === 1_000_000 + 160_000 + 9_000, `Bronce total = ${d.total}`);
const dr = calcular(1_000_000, bronce, true);
ok(dr.recargo === 150_000, `Bronce Pagador Rapido recargo = ${dr.recargo}`);
ok(dr.totalServicios === 9_000, "los servicios NO bajan con Pagador Rapido");
ok(d.total - dr.total === 10_000, "la rebaja es exactamente un punto sobre la mercaderia");

// Limites del pedido.
ok(calcular(50_000, bronce).bajoMinimo, "50.000 esta bajo el minimo de Bronce");
ok(!calcular(150_000, bronce).bajoMinimo, "150.000 alcanza el minimo");
ok(calcular(2_000_000, bronce).sobreCupo, "2.000.000 pasa el cupo de Bronce");


/* ---------------------------------------------------------------------------
 * Segunda fuente: el correo de Antonio con la tabla de niveles y un pedido
 * Bronce resuelto. Vale la pena comprobarlo aparte de las CGV, porque dos
 * fuentes independientes que coinciden descartan que yo haya copiado mal.
 * ------------------------------------------------------------------------- */

const CORREO: [string, number, number, number, number][] = [
  // nivel, cupo, pedido minimo, recargo %, servicios por pedido
  ["Hierro", 250_000, 100_000, 18, 7_000],
  ["Cobre", 500_000, 150_000, 17, 8_000],
  ["Bronce", 1_000_000, 150_000, 16, 9_000],
  ["Plata", 3_000_000, 150_000, 15, 11_500],
  ["Oro", 5_000_000, 150_000, 14, 14_500],
  ["Rubis", 8_000_000, 150_000, 13, 19_000],
  ["Diamante", 10_000_000, 150_000, 12, 22_500],
];

ok(CORREO.length === NIVELES.length, "el correo trae otra cantidad de niveles");
CORREO.forEach(([nombre, cupo, minimo, rec, srv], i) => {
  const n = NIVELES[i];
  ok(n.nombre === nombre, `orden: ${n.nombre} != ${nombre}`);
  ok(n.tope === cupo, `${nombre} cupo del correo`);
  ok(n.minimo === minimo, `${nombre} minimo del correo`);
  ok(Math.round(n.recargo * 100) === rec, `${nombre} recargo del correo`);
  ok(totalServicios(n.servicios) === srv, `${nombre} servicios del correo`);
});

// El ejemplo resuelto del correo: Bronce, costo mayorista 500.000.
const ej = calcular(500_000, NIVELES[2]);
ok(ej.recargo === 80_000, `ejemplo del correo: recargo ${ej.recargo} != 80.000`);
ok(ej.totalServicios === 9_000, `ejemplo del correo: servicios ${ej.totalServicios} != 9.000`);
ok(ej.total === 589_000, `ejemplo del correo: total ${ej.total} != 589.000`);

/* Tercera fuente: el sitio estatico, donde los precios de los cinco servicios
 * del inicio van escritos a mano. En la app se calculan desde NIVELES y se
 * actualizan solos; ahi no. Sin esta comprobacion, un cambio de tarifa dejaria
 * los dos inicios diciendo cosas distintas y nadie se enteraria. */
const estatico = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const gs = (n: number) => n.toLocaleString("es-PY");
for (const k of Object.keys(NOMBRE_SERVICIO) as (keyof Servicios)[]) {
  const v = NIVELES.map((n) => n.servicios[k]);
  const min = Math.min(...v), max = Math.max(...v);
  const txt = min === max ? `Gs. ${gs(min)} por pedido` : `Gs. ${gs(min)} a ${gs(max)} por pedido`;
  ok(estatico.includes(txt), `el sitio estatico no dice "${txt}" para ${NOMBRE_SERVICIO[k]}`);
}
const totMin = gs(totalServicios(NIVELES[0].servicios));
const totMax = gs(totalServicios(NIVELES[NIVELES.length - 1].servicios));
ok(
  estatico.includes(`Gs. ${totMin} a Gs. ${totMax} por pedido`),
  `el sitio estatico no dice el total de servicios ${totMin} a ${totMax}`,
);

console.log(
  fallos === 0
    ? "OK — las CGV, el correo y los dos inicios dicen lo mismo"
    : `${fallos} fallas`,
);
process.exit(fallos ? 1 : 0);
