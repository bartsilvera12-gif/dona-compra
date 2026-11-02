import type { Metadata } from "next";
import Link from "next/link";
import ContactoForm from "@/components/ContactoForm";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escribinos por formulario, correo o WhatsApp. Respondemos dentro de las 24 horas hábiles.",
};

const CARD =
  "rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(16px,2.2vw,24px)]";

export default function ContactoPage() {
  return (
    <main>
      <section className="border-b border-navy/12">
        <div className="mx-auto max-w-[1280px] px-[clamp(18px,4vw,40px)] py-[clamp(40px,6vw,86px)]">
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
            Contacto
          </span>
          <h1 className="mt-4">Hablemos de tu negocio.</h1>
          <p className="mt-4 max-w-[56ch] text-[clamp(16px,1.8vw,19px)] text-ink">
            Escribinos por el formulario, por correo o directamente por
            WhatsApp. {site.plazo}
          </p>
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-start gap-[clamp(24px,4vw,56px)] px-[clamp(18px,4vw,40px)] py-[clamp(40px,6vw,86px)]">
          <div className="flex flex-col gap-3.5">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-[var(--radius-card)] bg-navy p-[clamp(20px,3vw,30px)] hover:bg-navy-deep"
            >
              <span className="block text-[10.5px] uppercase tracking-[0.2em] text-terracotta-soft">
                WhatsApp
              </span>
              <span className="mt-2 block font-heading text-[clamp(24px,3.4vw,34px)] font-bold text-card">
                {site.phone}
              </span>
              <span className="mt-2 block text-[14.5px] text-card/72">
                La forma más rápida de empezar la conversación.
              </span>
            </a>

            <div className={CARD}>
              <h3 className="mb-2">Correo</h3>
              <a
                href={`mailto:${site.email}`}
                className="break-all text-[17px] text-terracotta"
              >
                {site.email}
              </a>
            </div>

            <div className={CARD}>
              <h3 className="mb-2">Horarios y respuesta</h3>
              <p className="text-ink">{site.horario}</p>
              <p className="mt-2 font-medium text-terracotta">{site.plazo}</p>
            </div>

            <div className={CARD}>
              <h3 className="mb-3">Seguinos</h3>
              {site.facebook || site.instagram ? (
                <div className="grid gap-2">
                  {site.facebook && (
                    <a
                      href={site.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-[var(--radius-button)] border border-navy/18 px-4 py-3 text-sm text-navy hover:border-terracotta"
                    >
                      Facebook
                    </a>
                  )}
                  {site.instagram && (
                    <a
                      href={site.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-[var(--radius-button)] border border-navy/18 px-4 py-3 text-sm text-navy hover:border-terracotta"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted">
                  Los enlaces a Facebook e Instagram se activan al cargar las
                  direcciones en la configuración del sitio.
                </p>
              )}
            </div>

            <div className={CARD}>
              <h3 className="mb-2">¿Dudas frecuentes?</h3>
              <p className="mb-3 text-ink">
                Puede que tu pregunta ya tenga respuesta.
              </p>
              <Link
                href="/preguntas-frecuentes"
                className="font-medium text-terracotta"
              >
                Ver preguntas frecuentes →
              </Link>
            </div>
          </div>

          <div>
            <h2 className="mb-4">Escribinos</h2>
            <p className="mb-6 max-w-[48ch] text-ink">
              Completá el formulario y te respondemos al correo que nos dejes.
            </p>
            <ContactoForm />
          </div>
        </div>
      </section>
    </main>
  );
}
