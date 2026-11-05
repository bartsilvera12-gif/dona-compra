import type { Publicacion } from "./schema";

/**
 * Contenido de ejemplo para el feed.
 *
 * Sirve para dos cosas: que la página se pueda ver y probar antes de conectar
 * la base, y como semilla inicial (scripts/seed.mjs lo inserta). La interfaz
 * avisa en pantalla cuando lo que se muestra sale de acá, para que no se
 * confunda con publicaciones reales.
 */

type Demo = Publicacion & { meGusta: number };

const base = {
  estado: "publicada" as const,
  creadoEn: new Date(),
  publicadoEn: new Date(),
  notaModeracion: null,
  videoUrl: null,
  imagenAlt: null,
};

export const DEMO: Demo[] = [
  {
    ...base,
    id: "00000000-0000-0000-0000-000000000001",
    slug: "retiro-con-codigo-seguro",
    titulo: "Cómo funciona el retiro con código seguro",
    texto:
      "Te mostramos en un minuto cómo retirás la mercadería con el código único que te damos. Es de un solo uso y queda registrado a nombre de quien retira.",
    tipo: "video",
    categoria: "Ofertas",
    ciudad: "Asunción",
    precio: 150000,
    autor: "Doña Compra",
    imagen: "/assets/paso-3.jpg",
    fecha: "2026-10-28",
    meGusta: 12,
  },
  {
    ...base,
    id: "00000000-0000-0000-0000-000000000002",
    slug: "nueva-zona-lambare",
    titulo: "Nueva zona de cobertura: Lambaré",
    texto:
      "Ya estamos visitando negocios en Lambaré. Pedí tu visita desde la página de contacto y coordinamos según disponibilidad.",
    tipo: "foto",
    categoria: "Novedades",
    ciudad: "Lambaré",
    precio: 0,
    autor: "Doña Compra",
    imagen: "/assets/rubro-despensas.jpg",
    fecha: "2026-10-26",
    meGusta: 8,
  },
  {
    ...base,
    id: "00000000-0000-0000-0000-000000000003",
    slug: "temporada-escolar-curva-completa",
    titulo: "Temporada escolar: curva completa",
    texto:
      "Librerías: armá tu pedido de temporada y pagá después de vender. La compra fuerte del año, distribuida en el tiempo.",
    tipo: "foto",
    categoria: "Ofertas",
    ciudad: "San Lorenzo",
    precio: 320000,
    autor: "Mayorista socio",
    imagen: "/assets/rubro-libreria.jpg",
    fecha: "2026-10-24",
    meGusta: 21,
  },
  {
    ...base,
    id: "00000000-0000-0000-0000-000000000004",
    slug: "tres-meses-comprando-con-dona",
    titulo: "Tres meses comprando con Doña Compra",
    texto:
      "Una comerciante cuenta cómo cambió la reposición de su local desde que no tiene que pagar la mercadería al contado.",
    tipo: "video",
    categoria: "Comunidad",
    ciudad: "Fernando de la Mora",
    precio: 0,
    autor: "Comerciante del Club",
    imagen: "/assets/rubro-ropa.jpg",
    fecha: "2026-10-21",
    meGusta: 34,
  },
  {
    ...base,
    id: "00000000-0000-0000-0000-000000000005",
    slug: "bijouterie-por-blister",
    titulo: "Bijouterie por blíster",
    texto:
      "Rotación rápida de mostrador, pedido mínimo bajo. Ideal para probar surtido nuevo sin comprometer la caja.",
    tipo: "foto",
    categoria: "Ofertas",
    ciudad: "Asunción",
    precio: 85000,
    autor: "Mayorista socio",
    imagen: "/assets/rubro-bijouterie.jpg",
    fecha: "2026-10-18",
    meGusta: 5,
  },
  {
    ...base,
    id: "00000000-0000-0000-0000-000000000006",
    slug: "tope-nivel-bronce",
    titulo: "Subimos el tope del nivel Bronce",
    texto:
      "Los comerciantes en Bronce ya pueden comprar hasta Gs. 1.000.000, con un recargo comercial del 16 %.",
    tipo: "foto",
    categoria: "Novedades",
    ciudad: "Capiatá",
    precio: 0,
    autor: "Doña Compra",
    imagen: "/assets/rubro-cosmeticos.jpg",
    fecha: "2026-10-15",
    meGusta: 17,
  },
  {
    ...base,
    id: "00000000-0000-0000-0000-000000000007",
    slug: "reposicion-de-perfumeria",
    titulo: "Reposición de perfumería",
    texto:
      "Compras de mayor valor unitario sin descapitalizar el negocio. El rubro donde pagar al contado más duele.",
    tipo: "foto",
    categoria: "Comunidad",
    ciudad: "Luque",
    precio: 210000,
    autor: "Comerciante del Club",
    imagen: "/assets/rubro-perfumes.jpg",
    fecha: "2026-10-11",
    meGusta: 9,
  },
  {
    ...base,
    id: "00000000-0000-0000-0000-000000000008",
    slug: "que-tener-listo-para-la-visita",
    titulo: "Qué tener listo antes de pedir tu visita",
    texto:
      "Lo que conviene tener a mano para que la visita sea corta y concreta: cédula, datos del negocio y una idea de qué querés comprar.",
    tipo: "video",
    categoria: "Novedades",
    ciudad: "Asunción",
    precio: 0,
    autor: "Doña Compra",
    imagen: "/assets/paso-1.jpg",
    fecha: "2026-10-07",
    meGusta: 14,
  },
  {
    ...base,
    id: "00000000-0000-0000-0000-000000000009",
    slug: "calzado-por-curva-de-talles",
    titulo: "Calzado por curva de talles",
    texto:
      "Traé la curva completa en vez de recortarla. Los talles que más salen son los que primero se agotan.",
    tipo: "foto",
    categoria: "Ofertas",
    ciudad: "San Lorenzo",
    precio: 275000,
    autor: "Mayorista socio",
    imagen: "/assets/rubro-calzado.jpg",
    fecha: "2026-10-03",
    meGusta: 11,
  },
  {
    ...base,
    id: "00000000-0000-0000-0000-00000000000a",
    slug: "regaleria-para-fechas-fuertes",
    titulo: "Regalería para fechas fuertes",
    texto:
      "Compras concentradas en Día de la Madre y fin de año, con pago posterior a la venta.",
    tipo: "foto",
    categoria: "Ofertas",
    ciudad: "Asunción",
    precio: 190000,
    autor: "Mayorista socio",
    imagen: "/assets/rubro-regaleria.jpg",
    fecha: "2026-09-29",
    meGusta: 6,
  },
];
