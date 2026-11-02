import type { MetadataRoute } from "next";
import { nav, site } from "@/lib/site";

/** Ahora que cada página es una URL real, el sitemap las lista todas. */
export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();
  const rutas = [...nav.map((n) => n.href), "/preguntas-frecuentes"];

  return rutas.map((ruta) => ({
    url: `${site.url}${ruta === "/" ? "" : ruta}`,
    lastModified: ahora,
    changeFrequency: ruta === "/anuncios" ? "weekly" : "monthly",
    priority: ruta === "/" ? 1 : 0.8,
  }));
}
