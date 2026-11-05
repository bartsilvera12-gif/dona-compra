import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactoForm from "@/components/ContactoForm";
import Revelar from "@/components/Revelar";
import { PortadaCompacta, Rotulo } from "@/components/bloques";
import { Wrap } from "@/components/ui";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escribinos por formulario, correo o WhatsApp. Respondemos dentro de las 24 horas hábiles.",
};

/* Íconos oficiales, dibujados en línea: cargar los botones de cada red
   pondría código de terceros en la página, y la política de cookies dice
   que no lo hacemos. */
function IconoFacebook() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M9.1 23.7v-8H6.6V12h2.5v-1.6c0-4.1 1.8-6 5.9-6 .8 0 2.1.2 2.6.3v3.3l-1.4-.1c-2 0-2.8.8-2.8 2.8V12h3.9l-.7 3.7h-3.2v8.2c5.9-.7 10.6-5.8 10.6-11.9C24 5.4 18.6 0 12 0S0 5.4 0 12c0 5.6 3.9 10.4 9.1 11.7Z" />
    </svg>
  );
}

function IconoInstagram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.3" />
      <circle cx="17.6" cy="6.4" r="1.1" className="fill-current stroke-none" />
    </svg>
  );
}

function IconoWeb() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M2.5 12h19M12 2.5c2.6 2.7 3.9 5.9 3.9 9.5s-1.3 6.8-3.9 9.5c-2.6-2.7-3.9-5.9-3.9-9.5S9.4 5.2 12 2.5Z" />
    </svg>
  );
}

const RED =
  "flex items-center gap-3 rounded-[var(--radius-button)] border border-navy/15 bg-card px-4 py-3 text-[14.5px] font-medium text-navy transition-colors hover:border-terracotta hover:text-terracotta-ink";

/** Fila de un canal: rótulo chico arriba y el dato abajo. */
function Canal({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-navy/12 py-5 first:border-t-0 first:pt-0">
      <span className="block text-[11px] uppercase tracking-[0.18em] text-muted">
        {rotulo}
      </span>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function ContactoPage() {
  return (
    <main>
      <PortadaCompacta
        rotulo="Contacto"
        titulo="Hablemos de tu negocio."
        bajada={
          <p>
            Escribinos por el formulario, por correo o directamente por
            WhatsApp. {site.plazo}
          </p>
        }
        lateral={
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-[var(--radius-card)] bg-navy text-card hover:text-card"
          >
            <div className="relative aspect-[16/7] bg-navy-dark">
              <Image
                src="/assets/paso-1.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover opacity-55 transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"
              />
            </div>
            <div className="relative -mt-10 p-[clamp(20px,3vw,30px)] pt-0">
              <span className="block text-[11px] uppercase tracking-[0.2em] text-terracotta-soft">
                WhatsApp · la vía más rápida
              </span>
              <span className="mt-2 block font-heading text-[clamp(28px,3.6vw,40px)] font-bold leading-none">
                {site.phone}
              </span>
              <span className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-terracotta-ink px-5 py-3 text-sm font-medium">
                Abrir el chat
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </a>
        }
      />

      <section className="bg-card">
        <Wrap>
          <div className="grid items-start gap-[clamp(28px,5vw,72px)] lg:grid-cols-[1.45fr_1fr]">
            <Revelar>
              <Rotulo>Formulario</Rotulo>
              <h2 className="mt-4">Escribinos</h2>
              <p className="mt-3 mb-8 max-w-[48ch] text-ink">
                Completá el formulario y te respondemos al correo que nos
                dejes.
              </p>
              <div className="rounded-[var(--radius-card)] border border-navy/12 bg-grad-mid p-[clamp(18px,3vw,32px)]">
                <ContactoForm />
              </div>
            </Revelar>

            <Revelar retardo={1} className="lg:sticky lg:top-28">
              <Rotulo>Otros canales</Rotulo>
              <div className="mt-6">
                <Canal rotulo="Correo">
                  <a
                    href={`mailto:${site.email}`}
                    className="break-all font-heading text-[19px] font-semibold text-navy underline decoration-terracotta/50 underline-offset-4 hover:text-terracotta-ink"
                  >
                    {site.email}
                  </a>
                </Canal>

                <Canal rotulo="Horarios">
                  <p className="text-ink">{site.horario}</p>
                  <p className="mt-2 flex items-center gap-2 text-[14.5px] font-medium text-terracotta-ink">
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ok" />
                    {site.plazo}
                  </p>
                </Canal>

                <Canal rotulo="Seguinos">
                  <div className="grid gap-2">
                    <a href={site.url} target="_blank" rel="noopener noreferrer" className={RED}>
                      <IconoWeb />
                      Sitio web
                    </a>
                    {site.facebook && (
                      <a href={site.facebook} target="_blank" rel="noopener noreferrer" className={RED}>
                        <IconoFacebook />
                        Facebook
                      </a>
                    )}
                    {site.instagram && (
                      <a href={site.instagram} target="_blank" rel="noopener noreferrer" className={RED}>
                        <IconoInstagram />
                        Instagram
                      </a>
                    )}
                  </div>
                  {!site.facebook && !site.instagram && (
                    <p className="mt-2 text-xs text-muted">
                      Los enlaces a Facebook e Instagram se activan al cargar
                      las direcciones en la configuración del sitio.
                    </p>
                  )}
                </Canal>

                <Canal rotulo="Dudas frecuentes?">
                  <Link
                    href="/preguntas-frecuentes"
                    className="group flex items-center justify-between gap-4 rounded-[var(--radius-card)] bg-terracotta/8 px-5 py-4 text-navy hover:text-terracotta-ink"
                  >
                    <span>
                      <span className="block font-heading font-semibold">
                        Puede que ya tenga respuesta
                      </span>
                      <span className="block text-[14px] text-ink">
                        Ver preguntas frecuentes
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </Canal>
              </div>
            </Revelar>
          </div>
        </Wrap>
      </section>
    </main>
  );
}
