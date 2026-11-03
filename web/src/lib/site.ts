/**
 * Datos del negocio y navegación, en un solo lugar.
 *
 * Lo que puede cambiar sin tocar código sale de variables de entorno
 * públicas. Los valores por defecto son los que hoy muestra el sitio;
 * los que están vacíos ocultan su elemento en la interfaz en vez de
 * mostrar un enlace roto.
 */

const env = (key: string, fallback = "") =>
  (process.env[key] ?? "").trim() || fallback;

export const site = {
  name: "Doña Compra",
  tagline: "Comprá mercadería para tu negocio y pagá después",
  url: env("NEXT_PUBLIC_SITE_URL", "https://dona-compra.vercel.app"),

  phone: env("NEXT_PUBLIC_PHONE", "0994 876 333"),
  email: env("NEXT_PUBLIC_EMAIL", "donacompra@gmail.com"),
  horario:
    "Lunes a viernes de 08:00 a 18:00 · Sábados de 08:00 a 12:00",
  plazo: "Respondemos dentro de las 24 horas hábiles.",
  zona: "Gran Asunción, Paraguay",

  // Vacíos hasta que nos pasen las direcciones: los botones no se muestran.
  facebook: env("NEXT_PUBLIC_FACEBOOK"),
  instagram: env("NEXT_PUBLIC_INSTAGRAM"),

  // Datos registrales, para la página jurídica.
  razonSocial: env("NEXT_PUBLIC_RAZON_SOCIAL", "Doña Compra"),
  ruc: env("NEXT_PUBLIC_RUC"),
  domicilio: env("NEXT_PUBLIC_DOMICILIO", "Gran Asunción, Paraguay"),

  // Sin ID no se carga analítica, ni siquiera con consentimiento.
  gaId: env("NEXT_PUBLIC_GA_ID"),
} as const;

/** Número en formato internacional para los enlaces de WhatsApp. */
export function waNumber(): string {
  const digits = site.phone.replace(/\D/g, "");
  return "595" + digits.replace(/^0/, "");
}

export function waLink(mensaje?: string): string {
  const texto =
    mensaje ??
    "Hola, Doña Compra. Tengo un negocio y me gustaría conocer cómo puedo comprar mercadería con ustedes.";
  return `https://wa.me/${waNumber()}?text=${encodeURIComponent(texto)}`;
}

/** Las 8 páginas del sitio, en el orden en que aparecen en el menú. */
export const nav = [
  { href: "/", label: "Inicio" },
  { href: "/el-concepto", label: "El Concepto" },
  { href: "/comerciante", label: "Comerciantes" },
  { href: "/mayoristas", label: "Mayoristas" },
  { href: "/club", label: "El Club" },
  { href: "/anuncios", label: "Anuncios" },
  { href: "/juridica", label: "Jurídica" },
  { href: "/contacto", label: "Contacto" },
] as const;

/**
 * Páginas de detalle: no entran en el menú principal, que con ocho ya está
 * lleno, pero sí en el pie, en el menú móvil y en el sitemap.
 */
export const navDetalle = [
  { href: "/niveles-y-tarifas", label: "Niveles y tarifas" },
  { href: "/servicios", label: "Servicios" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
] as const;

export const ASUNTOS = ["Comerciante", "Mayorista", "Prensa", "Otro"] as const;
export type Asunto = (typeof ASUNTOS)[number];
