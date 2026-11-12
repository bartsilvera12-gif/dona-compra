/**
 * Los textos de la guía de diseño que mandó el cliente, tal como los escribió.
 *
 * Viven acá, y no dentro de cada componente, porque el sitio estático se
 * genera desde este mismo archivo. Dos copias de un texto son dos textos que
 * en algún momento van a decir cosas distintas.
 *
 * Si hay que cambiar una palabra, se cambia acá y se vuelve a correr
 * `npm run estatico:guia`.
 */

import type { NombreIcono } from "@/components/Iconos";

/* --- Cómo funciona --------------------------------------------------- */

export const PASOS_TITULO = "Así de simple";
export const PASOS_BAJADA =
  "En 5 pasos tenés tu mercadería, y la pagás a los 30 días.";

export const PASOS: { icono: NombreIcono; titulo: string; texto: string }[] = [
  {
    icono: "agenda",
    titulo: "Agendá una reunión",
    texto: "Nos conocemos, vemos tu negocio y te explicamos todo.",
  },
  {
    icono: "estante",
    titulo: "Elegí tu mercadería",
    texto: "En tu mayorista de siempre, a tus precios de siempre.",
  },
  {
    icono: "cuaderno",
    titulo: "Doña Compra compra por vos",
    texto: "Hacemos el trámite con tu mayorista y te llega tu factura legal.",
  },
  {
    icono: "codigo",
    titulo: "Retirá con tu código",
    texto: "Te llega por WhatsApp y es solo para vos. Vas con tu cédula.",
  },
  {
    icono: "treinta",
    titulo: "Pagá tu factura en 30 días",
    texto: "Mientras tanto, vendés.",
  },
];

/* --- Acompañamiento --------------------------------------------------- */

export const ACOMPANA_TITULO = "Cerca tuyo, en cada paso.";
export const ACOMPANA_BAJADA =
  "Con Doña Compra no estás solo. Te acompañamos de verdad.";

export const ACOMPANA: { icono: NombreIcono; titulo: string; texto: string }[] =
  [
    {
      icono: "cercania",
      titulo: "Cercanía",
      texto:
        "Te visitamos, te conocemos y nos hablás por WhatsApp como a una vecina.",
    },
    {
      icono: "consejos",
      titulo: "Consejos para vender más",
      texto: "Qué reponer en cada temporada y cómo hacer crecer tu negocio.",
    },
    {
      icono: "juridica",
      titulo: "Asesoría jurídica",
      texto: "Te orientamos para que tu negocio esté en regla.",
    },
    {
      icono: "seriedad",
      titulo: "Seriedad",
      texto: "Factura legal, condiciones claras y todo por escrito.",
    },
  ];

/* --- Para quién es ----------------------------------------------------- */

export const RUBROS_TITULO = "Para los comercios del barrio";
export const RUBROS_BAJADA =
  "Si tenés un negocio en Gran Asunción, Doña Compra es para vos.";

export const RUBROS: { icono: NombreIcono; nombre: string; frase: string }[] = [
  {
    icono: "ropa",
    nombre: "Ropa",
    frase: "Renová tu colección antes de cada temporada.",
  },
  {
    icono: "calzado",
    nombre: "Calzado",
    frase: "Tené todos los talles cuando te los piden.",
  },
  {
    icono: "bijouterie",
    nombre: "Bijouterie",
    frase: "Novedades en tu vidriera todas las semanas.",
  },
  {
    icono: "cosmeticos",
    nombre: "Cosméticos",
    frase: "Las marcas que tus clientas buscan, siempre en stock.",
  },
  {
    icono: "perfumes",
    nombre: "Perfumes",
    frase: "Llegá a las fechas especiales con tus estantes llenos.",
  },
  {
    icono: "peluqueria",
    nombre: "Peluquerías",
    frase: "Productos e insumos sin frenar tus turnos.",
  },
  {
    icono: "regalos",
    nombre: "Tiendas de regalos",
    frase: "Prepará tu local para cada fecha de regalo.",
  },
  {
    icono: "libreria",
    nombre: "Librería y útiles",
    frase: "Llená tus estantes para la vuelta a clases.",
  },
  {
    icono: "revendedora",
    nombre: "Revendedoras",
    frase: "Comprá más para tus clientas y vendé tranquila.",
  },
  {
    icono: "despensa",
    nombre: "Despensas",
    frase: "Que nunca te falte lo de todos los días.",
  },
  {
    icono: "comedor",
    nombre: "Comedores",
    frase: "Insumos para tu cocina sin esperar.",
  },
  {
    icono: "restaurante",
    nombre: "Restaurantes",
    frase: "Abastecé tu cocina con tu proveedor de siempre.",
  },
];

export const RUBROS_PIE =
  "¿Tu rubro no está? Escribile a Doña y lo vemos juntos";

/* --- Qué necesitás para empezar ---------------------------------------- */

export const REQUISITOS_TITULO = "Empezar es fácil";
export const REQUISITOS_BAJADA = "Solo necesitás tres cosas.";

export const REQUISITOS: {
  icono: NombreIcono;
  titulo: string;
  texto: string;
}[] = [
  {
    icono: "local",
    titulo: "Tu comercio funcionando",
    texto: "Un negocio abierto en Gran Asunción, de cualquier rubro.",
  },
  {
    icono: "cedula",
    titulo: "Tu cédula",
    texto: "La del responsable del negocio, vigente.",
  },
  {
    icono: "reunion",
    titulo: "Una reunión con Doña",
    texto: "Te visitamos, conocemos tu negocio y en pocos días te confirmamos.",
  },
];

export const REQUISITOS_PIE = "¿Tenés las tres? Ya podés empezar.";

/* --- Doña te cuida ------------------------------------------------------ */

export const CUIDA_TITULO = "Doña te cuida";

export const CUIDA: { icono: NombreIcono; texto: string }[] = [
  { icono: "numero", texto: "Un único número oficial" },
  { icono: "llave", texto: "Un código solo para vos" },
  { icono: "factura", texto: "Factura verificable en la DNIT" },
  { icono: "candado", texto: "Nunca te pedimos claves" },
];
