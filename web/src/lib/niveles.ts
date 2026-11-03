/**
 * Niveles y tarifas, tal como los define el material comercial.
 *
 * Los importes son los del sitio original: no inventar ni redondear. Si el
 * negocio cambia una tarifa, se cambia acá y queda reflejado en la
 * calculadora y en la tabla a la vez.
 */

export type Nivel = {
  nombre: string;
  /** Tope de compras acumuladas del nivel, en guaraníes. */
  tope: number;
  /** Pack Doña Compra: servicio por pedido, depende del nivel. */
  pack: number;
  /** Pedido mínimo, expresado en precio de compra. */
  minimo: number;
  nota: string;
};

export const NIVELES: Nivel[] = [
  { nombre: "Hierro", tope: 250000, pack: 3000, minimo: 100000, nota: "Nivel de entrada. Pedido mínimo de Gs. 100.000 en precio de compra." },
  { nombre: "Cobre", tope: 500000, pack: 4500, minimo: 150000, nota: "Desde Cobre el pedido mínimo pasa a Gs. 150.000 en precio de compra." },
  { nombre: "Bronce", tope: 1000000, pack: 8000, minimo: 150000, nota: "El contador acumulado vuelve a cero al ingresar a este nivel." },
  { nombre: "Plata", tope: 3000000, pack: 30000, minimo: 150000, nota: "El Pack Doña Compra aumenta por nivel, no por el monto de la mercadería." },
  { nombre: "Oro", tope: 5000000, pack: 40000, minimo: 150000, nota: "El margen comercial sigue siendo del 12 %, igual que en Hierro." },
  { nombre: "Rubis", tope: 8000000, pack: 70000, minimo: 150000, nota: "La progresión se evalúa pedido por pedido y la resuelve Doña Compra." },
  { nombre: "Diamante", tope: 10000000, pack: 75000, minimo: 150000, nota: "Diamante conserva su nivel mientras la relación comercial continúe normalmente." },
];

/** Margen comercial: 12 % en los siete niveles. */
export const MARGEN = 0.12;
/** Servicios fijos por pedido, iguales en todos los niveles. */
export const SEGURO = 4000;
export const ANALISIS = 3000;

export type Desglose = {
  mercaderia: number;
  margen: number;
  seguro: number;
  analisis: number;
  pack: number;
  servicios: number;
  total: number;
  /** true si el pedido no alcanza el mínimo del nivel elegido. */
  bajoMinimo: boolean;
};

export function calcular(mercaderia: number, nivel: Nivel): Desglose {
  const margen = Math.round(mercaderia * MARGEN);
  const servicios = SEGURO + ANALISIS + nivel.pack;
  return {
    mercaderia,
    margen,
    seguro: SEGURO,
    analisis: ANALISIS,
    pack: nivel.pack,
    servicios,
    total: mercaderia + margen + servicios,
    bajoMinimo: mercaderia > 0 && mercaderia < nivel.minimo,
  };
}
