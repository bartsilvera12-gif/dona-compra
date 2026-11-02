import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Las páginas de confirmación y baja llevan token: no se indexan.
      disallow: ["/boletin/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
