import Image from "next/image";
import Link from "next/link";
import Icono from "@/components/Iconos";
import Revelar from "@/components/Revelar";
import { Rotulo } from "@/components/bloques";
import { ACOMPANA, ACOMPANA_BAJADA, ACOMPANA_TITULO } from "@/lib/guia";
import { waLink } from "@/lib/site";
import { btnPrimario, Wrap } from "@/components/ui";

/**
 * «Cerca tuyo, en cada paso»: la foto grande a la izquierda y los cuatro
 * ítems a la derecha, como pide la guía.
 *
 * La foto sale del flujo normal de la grilla y se va al borde izquierdo de la
 * pantalla. Una foto de una persona recortada a la mitad de una columna
 * parece una ilustración de catálogo; a sangre parece una escena. El texto, en
 * cambio, se queda alineado con el resto de la página.
 *
 * Los cuatro ítems no son una grilla de tarjetas iguales: van en una lista con
 * una línea que los separa, que es como se lee una enumeración. Las tarjetas
 * sugieren que se pueden elegir, y acá no hay nada que elegir.
 */

export default function Acompanamiento() {
  return (
    <section className="overflow-hidden bg-card">
      <div className="mx-auto grid max-w-[1280px] items-center gap-[clamp(28px,4vw,72px)] px-[clamp(18px,4vw,40px)] py-[clamp(44px,7vw,96px)] lg:grid-cols-[1fr_minmax(0,46ch)] lg:px-0 lg:pl-[max(clamp(18px,4vw,40px),calc((100vw-1280px)/2))]">
        <Revelar className="lg:-ml-[max(clamp(18px,4vw,40px),calc((100vw-1280px)/2))]">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--radius-card)] bg-grad-start lg:aspect-[4/3] lg:rounded-l-none">
            <Image
              src="/assets/portada-acompana.jpg"
              alt="Doña Compra conversando con una comerciante en el mostrador de su tienda"
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-[50%_35%]"
            />
          </div>
        </Revelar>

        <div className="lg:pr-[clamp(18px,4vw,40px)]">
          <Revelar>
            <Rotulo>Acompañamiento</Rotulo>
            <h2 className="mt-4 max-w-[16ch]">{ACOMPANA_TITULO}</h2>
            <p className="mt-4 max-w-[44ch] text-ink">{ACOMPANA_BAJADA}</p>
          </Revelar>

          <ul className="mt-8 grid list-none gap-0 p-0">
            {ACOMPANA.map((a, i) => (
              <Revelar
                as="li"
                key={a.titulo}
                retardo={((i % 4) + 1) as 1 | 2 | 3 | 4}
                className="border-t border-navy/10 py-4 first:border-t-0 first:pt-0"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-salvia/30 text-navy">
                    <Icono nombre={a.icono} tam={21} />
                  </span>
                  <span>
                    <strong className="block text-[16px] font-semibold text-navy">
                      {a.titulo}
                    </strong>
                    <span className="mt-1 block text-[14.5px] leading-relaxed text-muted">
                      {a.texto}
                    </span>
                  </span>
                </div>
              </Revelar>
            ))}
          </ul>

          <Revelar>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={btnPrimario}
              >
                Escribile a Doña
              </a>
              <Link
                href="#hablemos"
                className="inline-block rounded-full border border-navy/30 px-8 py-4 text-[15px] font-semibold tracking-[0.02em] text-navy hover:border-navy"
              >
                Agendá tu reunión
              </Link>
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
