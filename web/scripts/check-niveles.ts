import { NIVELES, totalServicios, calcular, analisisAcumulado, recargoEfectivo } from "../src/lib/niveles.ts";

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

console.log(fallos === 0 ? `OK — ${NIVELES.length} niveles verificados contra las CGV` : `${fallos} fallas`);
process.exit(fallos ? 1 : 0);
