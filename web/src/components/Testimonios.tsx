import Image from "next/image";
import Revelar from "@/components/Revelar";
import { Rotulo } from "@/components/bloques";
import { Wrap } from "@/components/ui";

/**
 * Testimonios de comerciantes.
 *
 * La lista está vacía a propósito y la sección no se dibuja mientras lo esté.
 * La hoja de dirección de comunicación lo pone entre los puntos no
 * negociables: «ningún testimonio inventado». Hace falta, por cada uno,
 * nombre y comercio, una frase dicha por esa persona, su foto y la
 * autorización escrita para publicarla —que en la guía del CRM ya existe como
 * las casillas CT01 a CT06—.
 *
 * Cuando lleguen, se cargan acá y la sección aparece sola. Está pedido en
 * docs/pedido-material-sitio.md.
 */

export type Testimonio = {
  nombre: string;
  comercio: string;
  frase: string;
  foto?: { src: string; alt: string };
};

export const TESTIMONIOS: Testimonio[] = [];

export default function Testimonios({
  testimonios = TESTIMONIOS,
}: {
  testimonios?: Testimonio[];
}) {
  if (testimonios.length === 0) return null;

  return (
    <section className="bg-navy text-card">
      <Wrap>
        <Revelar>
          <div className="mx-auto max-w-[56ch] text-center">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-terracotta-soft">
              <span aria-hidden="true" className="h-px w-8 bg-terracotta-soft" />
              Lo dicen ellos
              <span aria-hidden="true" className="h-px w-8 bg-terracotta-soft" />
            </span>
            <h2 className="mx-auto mt-4 max-w-[18ch] text-card">
              Comerciantes que ya compran así.
            </h2>
          </div>
        </Revelar>

        <ul className="mt-10 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3">
          {testimonios.map((t, i) => (
            <li key={t.nombre}>
              <Revelar retardo={((i % 3) + 1) as 1 | 2 | 3}>
                <figure className="m-0 flex h-full flex-col rounded-[var(--radius-card)] bg-card p-[clamp(18px,2.4vw,26px)]">
                  <blockquote className="m-0 flex-1 text-[clamp(16px,1.9vw,19px)] text-ink">
                    «{t.frase}»
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    {t.foto && (
                      <span className="relative block h-11 w-11 flex-none overflow-hidden rounded-full bg-grad-start">
                        <Image
                          src={t.foto.src}
                          alt={t.foto.alt}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </span>
                    )}
                    <span className="text-[14px] text-muted">
                      <strong className="block font-semibold text-navy">
                        {t.nombre}
                      </strong>
                      {t.comercio}
                    </span>
                  </figcaption>
                </figure>
              </Revelar>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}
