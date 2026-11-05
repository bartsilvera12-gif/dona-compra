import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BurbujaWhatsApp from "@/components/BurbujaWhatsApp";
import CookieBanner from "@/components/CookieBanner";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description:
    "Elegí la mercadería y el proveedor que ya conocés. Doña Compra paga al contado y vos pagás en hasta 30 días, según las condiciones acordadas. Gran Asunción, Paraguay.",
  openGraph: {
    type: "website",
    locale: "es_PY",
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: "#1B3B2B" };

/** Datos estructurados para los buscadores. */
function JsonLd() {
  const datos = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: site.name,
    description:
      "Compra de mercadería para comerciantes con pago diferido a 30 días.",
    url: site.url,
    telephone: "+" + site.phone.replace(/\D/g, "").replace(/^0/, "595"),
    email: site.email,
    areaServed: { "@type": "Place", name: site.zona },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Asunción",
      addressCountry: "PY",
    },
  };
  return (
    <script
      type="application/ld+json"
      // El objeto lo armamos nosotros, no viene de entrada de usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        {/* Marca el documento antes del primer pintado. El CSS solo oculta
            para animar si esta clase está, así que sin JavaScript nada queda
            escondido. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body
        className={`${montserrat.variable} ${inter.variable} flex min-h-screen flex-col antialiased`}
      >
        <JsonLd />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-[var(--radius-button)] focus:bg-navy focus:px-4 focus:py-2 focus:text-card"
        >
          Saltar al contenido
        </a>
        <Header />
        <div id="contenido" className="flex-1">
          {children}
        </div>
        <Footer />
        <BurbujaWhatsApp />
        <CookieBanner />
      </body>
    </html>
  );
}
