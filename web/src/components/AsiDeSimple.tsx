import Link from "next/link";
import Icono from "@/components/Iconos";
import Revelar from "@/components/Revelar";
import { Rotulo } from "@/components/bloques";
import { PASOS, PASOS_BAJADA, PASOS_TITULO } from "@/lib/guia";
import { btnSecundario, Wrap } from "@/components/ui";

/**
 * Los cinco pasos, en fila.
 *
 * Tres decisiones de forma que vale la pena dejar escritas:
 *
 * 1. El hilo. Los pasos no son cinco tarjetas sueltas: son una secuencia, y
 *    se nota con una línea punteada que los atraviesa por detrás de los
 *    números. Va con `aria-hidden` y solo aparece cuando los cinco están en
 *    una fila; apilados, la línea no significaría nada.
 * 2. El número y el ícono comparten el disco. El número manda —es el orden— y
 *    el ícono queda al costado, en ocre, como refuerzo. Al revés, el ícono se
 *    come al número y se pierde la cuenta.
 * 3. En celular la lista se desliza de costado, como pide la guía, con el
 *    ajuste de scroll puesto en cada tarjeta para que pare donde tiene que
 *    parar y no a mitad de camino.
 */

export default function AsiDeSimple() {
  return (
    <section
      id="como-funciona"
      className="relative scroll-mt-24 overflow-hidden bg-salvia/25"
    >
      <Wrap>
        <Revelar>
          <div className="mx-auto max-w-[52ch] text-center">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted">
              <span aria-hidden="true" className="h-px w-8 bg-terracotta" />
              Cómo funciona
              <span aria-hidden="true" className="h-px w-8 bg-terracotta" />
            </span>
            <h2 className="mt-4">{PASOS_TITULO}</h2>
            <p className="mx-auto mt-4 max-w-[42ch] text-ink">{PASOS_BAJADA}</p>
          </div>
        </Revelar>

        <div className="relative mt-12">
          {/* El hilo que une los pasos, por el centro de los discos: a 28px
              del borde de la caja, que es el hueco que cada <li> reserva
              arriba para su disco.

              Entra con la misma animación que las tarjetas. Si no, mientras
              ellas bajan sus 22px el hilo ya está en su sitio, y durante medio
              segundo la línea cruza los discos por abajo y parece que los
              corta. Con el retardo de la primera alcanza: las que entran
              después todavía están transparentes. */}
          <Revelar
            retardo={1}
            className="pointer-events-none absolute top-7 right-[10%] left-[10%] hidden lg:block"
          >
            <span
              aria-hidden="true"
              className="block border-t-2 border-dashed border-navy/15"
            />
          </Revelar>

          <ol className="relative m-0 flex snap-x snap-mandatory list-none gap-4 overflow-x-auto p-0 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-5 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
            {PASOS.map((p, i) => (
              /* El hueco del disco lo reserva el propio <li> con `pt-7`, y el
                 disco va posicionado contra la tarjeta. Asi el disco sobresale
                 de la tarjeta —que es el efecto buscado— pero nunca sale del
                 <li>, y entonces da igual si alguna caja de arriba recorta:
                 no hay nada que recortar. Antes salia con un `translate`, y
                 cualquier contenedor con overflow lo cortaba por la mitad. */
              <Revelar
                as="li"
                key={p.titulo}
                retardo={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}
                className="flex w-[78vw] max-w-[300px] flex-none snap-start pt-7 sm:w-[46vw] lg:w-auto lg:max-w-none"
              >
                <div className="relative flex w-full flex-col items-center rounded-[var(--radius-card)] border border-navy/10 bg-card px-5 pt-10 pb-6 text-center">
                  <span className="absolute -top-7 left-1/2 grid h-14 w-14 -translate-x-1/2 place-items-center rounded-full bg-navy font-heading text-[20px] font-bold text-card">
                    {i + 1}
                  </span>
                  <span className="text-terracotta-ink">
                    <Icono nombre={p.icono} tam={30} />
                  </span>
                  <h3 className="mt-4 text-[clamp(16px,1.8vw,18px)] text-navy">
                    {p.titulo}
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
                    {p.texto}
                  </p>
                </div>
              </Revelar>
            ))}
          </ol>
        </div>

        <Revelar>
          <p className="mt-10 text-center">
            <Link href="#hablemos" className={btnSecundario}>
              Agendá tu reunión
            </Link>
          </p>
        </Revelar>
      </Wrap>
    </section>
  );
}
