import type { MetadataRoute } from "next";
import { nav, site } from "@/lib/site";
import { slugsPublicados } from "@/db/anuncios";

/** Ahora que cada página es una URL real, el sitemap las lista todas,
    incluida una entrada por publicación del feed. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ahora = new Date();
  const rutas = [...nav.map((n) => n.href), "/preguntas-frecuentes"];

  const fijas: MetadataRoute.Sitemap = rutas.map((ruta) => ({
    url: `${site.url}${ruta === "/" ? "" : ruta}`,
    lastModified: ahora,
    changeFrequency: ruta === "/anuncios" ? "weekly" : "monthly",
    priority: ruta === "/" ? 1 : 0.8,
  }));

  const publicaciones = await slugsPublicados();
  const anuncios: MetadataRoute.Sitemap = publicaciones.map((p) => ({
    url: `${site.url}/anuncios/${p.slug}`,
    lastModified: new Date(p.fecha + "T12:00:00"),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...fijas, ...anuncios];
}
