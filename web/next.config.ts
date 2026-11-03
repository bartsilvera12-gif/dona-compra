import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Las imágenes subidas se sirven desde el almacenamiento de Vercel,
        // en su propio dominio. Que no compartan origen con el sitio es
        // deseable: un archivo servido desde otro dominio no puede tocar las
        // cookies ni el almacenamiento de la aplicación.
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },

  async redirects() {
    return [
      /**
       * Rutas del sitio estático cuyo contenido ya vive en otra página.
       *
       * Volver a crearlas sería contenido duplicado, que reparte la
       * autoridad entre dos URLs que dicen lo mismo. Redirigidas de forma
       * permanente, los enlaces y marcadores viejos siguen funcionando y el
       * buscador consolida todo en la página que quedó.
       */
      {
        source: "/como-funciona",
        destination: "/el-concepto",
        permanent: true,
      },
      {
        source: "/para-tu-negocio",
        destination: "/comerciante",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
