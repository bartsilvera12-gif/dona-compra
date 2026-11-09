/**
 * Niveles, recargos y servicios.
 *
 * FUENTE: «Doña Compra — Condiciones Generales de Servicio y de Venta»,
 * noviembre 2026. Artículo 3 (Análisis de ingreso), artículo 4 (cupos y
 * pedido mínimo) y artículo 6 (recargo por nivel, cinco servicios y estatus
 * Pagador Rápido). El artículo 1 dice que las CGV son el documento que manda:
 * ante cualquier diferencia con otro material, gana esta tabla.
 *
 * Ojo con la palabra: es RECARGO COMERCIAL, no «margen», y se aplica sobre el
 * costo mayorista de la cotización, nunca sobre el precio final de venta.
 * Cambia por nivel — del 18 % en Hierro al 12 % en Diamante — y ese es
 * justamente el punto del sistema: cumplir sale más barato.
 *
 * Si el negocio cambia una tarifa, se cambia acá y queda reflejado a la vez en
 * la calculadora, en la tabla y en todo lo que las lea. No duplicar estos
 * números en el texto de las páginas.
 */

/** Las cinco prestaciones fijas que se facturan en cada pedido (art. 6). */
export type Servicios = {
  /** Seguimiento de Compras con Código. */
  seguimiento: number;
  /** Custodia y Trazabilidad Documental. */
  custodia: number;
  /** Gestión de Proveedores Amigos. */
  proveedores: number;
  /** Publicidad y Promoción de la Red. */
  publicidad: number;
  /** Gestión del Club Doña Compra. */
  club: number;
};

export const NOMBRE_SERVICIO: Record<keyof Servicios, string> = {
  seguimiento: "Seguimiento de Compras con Código",
  custodia: "Custodia y Trazabilidad Documental",
  proveedores: "Gestión de Proveedores Amigos",
  publicidad: "Publicidad y Promoción de la Red",
  club: "Gestión del Club Doña Compra",
};

/**
 * Qué hace cada servicio, en una línea.
 *
 * El contrato fija el nombre y el precio, no una definición, así que esto
 * dice lo que el material comercial ya decía y nada más.
 */
export const DESCRIPCION_SERVICIO: Record<keyof Servicios, string> = {
  seguimiento:
    "Preparamos el código de recepción único de tu pedido y documentamos el retiro: qué se compró, quién lo retiró y cuándo.",
  custodia:
    "Archivamos la factura y los documentos de cada operación, de modo que tu historial de compras quede ordenado y consultable.",
  proveedores:
    "Gestiones logísticas, comerciales y administrativas entre vos y los mayoristas con los que trabajamos.",
  publicidad:
    "Acciones de publicidad y promoción de la red de comercios, contempladas por el programa comercial.",
  club:
    "Gestión del Club Doña Compra, el espacio donde las marcas que nos acompañan generan beneficios para los clientes de los comercios.",
};

export type Nivel = {
  nombre: string;
  /** Recargo comercial sobre el costo mayorista, en tanto por uno. */
  recargo: number;
  /** Cupo: costo mayorista máximo comprometido a la vez, en guaraníes. */
  tope: number;
  /** Pedido mínimo, en costo mayorista. */
  minimo: number;
  servicios: Servicios;
  /**
   * Precio del Análisis de ingreso a este nivel.
   *
   * `null` en Rubis y Diamante: a esos dos no se entra directo, solo se llega
   * por ascenso, así que no tienen Análisis de entrada que publicar.
   */
  analisis: number | null;
};

export const NIVELES: Nivel[] = [
  {
    nombre: "Hierro",
    recargo: 0.18,
    tope: 250_000,
    minimo: 100_000,
    servicios: { seguimiento: 4000, custodia: 2500, proveedores: 500, publicidad: 0, club: 0 },
    analisis: 50_000,
  },
  {
    nombre: "Cobre",
    recargo: 0.17,
    tope: 500_000,
    minimo: 150_000,
    servicios: { seguimiento: 4000, custodia: 2500, proveedores: 1000, publicidad: 500, club: 0 },
    analisis: 100_000,
  },
  {
    nombre: "Bronce",
    recargo: 0.16,
    tope: 1_000_000,
    minimo: 150_000,
    servicios: { seguimiento: 4000, custodia: 2500, proveedores: 1500, publicidad: 1000, club: 0 },
    analisis: 150_000,
  },
  {
    nombre: "Plata",
    recargo: 0.15,
    tope: 3_000_000,
    minimo: 150_000,
    servicios: { seguimiento: 4000, custodia: 2500, proveedores: 3000, publicidad: 1500, club: 500 },
    analisis: 150_000,
  },
  {
    nombre: "Oro",
    recargo: 0.14,
    tope: 5_000_000,
    minimo: 150_000,
    servicios: { seguimiento: 4000, custodia: 2500, proveedores: 5000, publicidad: 2000, club: 1000 },
    analisis: 200_000,
  },
  {
    nombre: "Rubis",
    recargo: 0.13,
    tope: 8_000_000,
    minimo: 150_000,
    servicios: { seguimiento: 4000, custodia: 2500, proveedores: 8000, publicidad: 3000, club: 1500 },
    analisis: null,
  },
  {
    nombre: "Diamante",
    recargo: 0.12,
    tope: 10_000_000,
    minimo: 150_000,
    servicios: { seguimiento: 4000, custodia: 2500, proveedores: 10000, publicidad: 4000, club: 2000 },
    analisis: null,
  },
];

/**
 * Pagador Rápido: un punto porcentual menos de recargo (art. 6).
 *
 * Se obtiene con al menos 6 pedidos totalmente pagados y un plazo promedio
 * estrictamente menor a 25 días desde el retiro. Rebaja solo el recargo sobre
 * la mercadería: los cinco servicios se siguen facturando igual. No es
 * retroactivo y se revoca apenas hay un atraso.
 */
export const PAGADOR_RAPIDO = 0.01;

/** Plazo máximo de pago, en días calendario desde el retiro efectivo. */
export const PLAZO_DIAS = 30;

/** Pedidos pagados que hacen falta para evaluar el estatus Pagador Rápido. */
export const PAGADOR_RAPIDO_PEDIDOS = 6;

/** Promedio de pago que hay que bajar, en días, para obtener el estatus. */
export const PAGADOR_RAPIDO_DIAS = 25;

export function totalServicios(s: Servicios): number {
  return s.seguimiento + s.custodia + s.proveedores + s.publicidad + s.club;
}

/** Recargo efectivo del nivel, ya descontado el punto de Pagador Rápido. */
export function recargoEfectivo(nivel: Nivel, pagadorRapido = false): number {
  return pagadorRapido ? nivel.recargo - PAGADOR_RAPIDO : nivel.recargo;
}

export type Desglose = {
  mercaderia: number;
  /** Tanto por uno efectivamente aplicado. */
  tasa: number;
  recargo: number;
  servicios: Servicios;
  totalServicios: number;
  total: number;
  /** El pedido no alcanza el mínimo del nivel. */
  bajoMinimo: boolean;
  /** El pedido solo supera el cupo del nivel. */
  sobreCupo: boolean;
};

export function calcular(
  mercaderia: number,
  nivel: Nivel,
  pagadorRapido = false,
): Desglose {
  const tasa = recargoEfectivo(nivel, pagadorRapido);
  const recargo = Math.round(mercaderia * tasa);
  const serv = totalServicios(nivel.servicios);
  return {
    mercaderia,
    tasa,
    recargo,
    servicios: nivel.servicios,
    totalServicios: serv,
    total: mercaderia + recargo + serv,
    bajoMinimo: mercaderia > 0 && mercaderia < nivel.minimo,
    sobreCupo: mercaderia > nivel.tope,
  };
}

/**
 * Análisis acumulados para entrar directo a un nivel (art. 3).
 *
 * No se paga solo el Análisis del nivel que pedís: se pagan también los de
 * todos los niveles anteriores. Entrar directo a Oro cuesta los cinco.
 */
export function analisisAcumulado(nivel: Nivel): number | null {
  const i = NIVELES.indexOf(nivel);
  if (i < 0 || nivel.analisis === null) return null;
  return NIVELES.slice(0, i + 1).reduce((t, n) => t + (n.analisis ?? 0), 0);
}

/** Niveles a los que se puede entrar directo, es decir los que tienen Análisis. */
export const NIVELES_DE_ENTRADA = NIVELES.filter((n) => n.analisis !== null);
