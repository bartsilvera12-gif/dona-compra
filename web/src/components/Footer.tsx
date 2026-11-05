import Link from "next/link";
import { site, waLink } from "@/lib/site";
import CookiePrefsButton from "./CookiePrefsButton";

const columnas = [
  {
    titulo: "El sitio",
    enlaces: [
      ["/", "Inicio"],
      ["/el-concepto", "El Concepto"],
      ["/comerciante", "Comerciantes"],
      ["/mayoristas", "Mayoristas"],
    ],
  },
  {
    titulo: "Más",
    enlaces: [
      ["/club", "El Club Doña Compra"],
      ["/anuncios", "Anuncios"],
      ["/contacto", "Contacto"],
      ["/preguntas-frecuentes", "Preguntas frecuentes"],
    ],
  },
  {
    titulo: "Detalle",
    enlaces: [
      ["/niveles-y-tarifas", "Niveles y tarifas"],
      ["/servicios", "Servicios"],
      ["/nosotros", "Nosotros"],
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="bg-navy-dark">
      <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-[clamp(24px,4vw,44px)] px-[clamp(18px,4vw,40px)] pb-6 pt-[clamp(36px,5vw,64px)]">
        <div>
          <span className="font-heading text-[19px] font-bold tracking-[0.02em] text-card">
            DOÑA COMPRA
          </span>
          <p className="mt-4 max-w-[36ch] text-[13.5px] leading-relaxed text-card/60">
            Compra de mercadería para comerciantes, sujeta a evaluación previa
            y visita. Factura legal con el RUC de Doña Compra.
          </p>
        </div>

        {columnas.map((col) => (
          <div key={col.titulo}>
            <div className="text-[10.5px] uppercase tracking-[0.2em] text-terracotta-soft">
              {col.titulo}
            </div>
            <nav
              aria-label={col.titulo}
              className="mt-3.5 flex flex-col items-start gap-2.5"
            >
              {col.enlaces.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-card/78 hover:text-terracotta-soft"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        ))}

        <div>
          <div className="text-[10.5px] uppercase tracking-[0.2em] text-terracotta-soft">
            Contacto directo
          </div>
          <div className="mt-3.5 flex flex-col items-start gap-2.5 text-sm">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-card/78 hover:text-terracotta-soft"
            >
              WhatsApp {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="break-all text-card/78 hover:text-terracotta-soft"
            >
              {site.email}
            </a>
            <span className="text-card/55">{site.zona}</span>
            <span className="text-card/55">{site.horario}</span>
            {site.facebook && (
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-card/78 hover:text-terracotta-soft"
              >
                Facebook
              </a>
            )}
            {site.instagram && (
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-card/78 hover:text-terracotta-soft"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3.5 border-t border-card/10 px-[clamp(18px,4vw,40px)] pb-7 pt-4.5">
        <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-card/65">
          <span>© 2026 Doña Compra</span>
          <span>
            Desarrollado por{" "}
            <a
              href="https://neura.com.py"
              target="_blank"
              rel="noopener noreferrer"
              className="text-card/80 underline decoration-terracotta/60 underline-offset-2 hover:text-terracotta-soft"
            >
              Neura
            </a>
          </span>
        </span>
        <span className="flex flex-wrap items-center gap-4">
          <Link href="/juridica" className="text-[12.5px] text-card/60 hover:text-terracotta-soft">
            Aviso legal y privacidad
          </Link>
          <CookiePrefsButton />
        </span>
      </div>
    </footer>
  );
}
