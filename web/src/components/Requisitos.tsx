import Link from "next/link";
import Icono from "@/components/Iconos";
import Revelar from "@/components/Revelar";
import {
  REQUISITOS,
  REQUISITOS_BAJADA,
  REQUISITOS_PIE,
  REQUISITOS_TITULO,
} from "@/lib/guia";
import { btnPrimario, Wrap } from "@/components/ui";

/**
 * «Empezar es fácil»: las tres cosas que hacen falta.
 *
 * La guía las quiere en color sólido, con el ícono en un círculo que
 * contraste y un tilde en la esquina, «como una lista de control, para que el
 * comerciante sienta que ya cumple». Es una buena idea y está hecha tal cual.
 *
 * El tilde es decorativo y va con `aria-hidden`: no es una casilla marcada
 * —nadie marcó nada todavía— y anunciarlo como tal sería mentirle a quien
 * escucha la página. Lo que dice el texto es lo que vale.
 */

function Tilde() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M4 12.5l5 5L20 6.5"
        className="stroke-current"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Requisitos() {
  return (
    <section className="bg-card">
      <Wrap>
        <Revelar>
          <div className="mx-auto max-w-[52ch] text-center">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted">
              <span aria-hidden="true" className="h-px w-8 bg-terracotta" />
              Requisitos
              <span aria-hidden="true" className="h-px w-8 bg-terracotta" />
            </span>
            <h2 className="mt-4">{REQUISITOS_TITULO}</h2>
            <p className="mx-auto mt-4 max-w-[40ch] text-ink">
              {REQUISITOS_BAJADA}
            </p>
          </div>
        </Revelar>

        <ul className="mt-10 grid list-none gap-4 p-0 md:grid-cols-3">
          {REQUISITOS.map((r, i) => (
            <Revelar
              as="li"
              key={r.titulo}
              retardo={((i % 3) + 1) as 1 | 2 | 3}
              className="flex"
            >
              <div className="relative flex w-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-navy p-[clamp(20px,2.6vw,30px)] text-card">
                {/* El tilde de la esquina. */}
                <span
                  aria-hidden="true"
                  className="absolute top-0 right-0 grid h-10 w-10 place-items-center rounded-bl-[var(--radius-card)] bg-ocre text-navy"
                >
                  <Tilde />
                </span>

                <span className="grid h-14 w-14 place-items-center rounded-full bg-ocre text-navy">
                  <Icono nombre={r.icono} tam={26} />
                </span>
                <h3 className="mt-5 text-[clamp(17px,2vw,20px)] text-card">
                  {r.titulo}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-card/75">
                  {r.texto}
                </p>
              </div>
            </Revelar>
          ))}
        </ul>

        <Revelar>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-center">
            <p className="m-0 font-heading text-[clamp(17px,2vw,21px)] font-semibold text-navy">
              {REQUISITOS_PIE}
            </p>
            <Link href="#hablemos" className={btnPrimario}>
              Agendá tu reunión
            </Link>
          </div>
        </Revelar>
      </Wrap>
    </section>
  );
}
