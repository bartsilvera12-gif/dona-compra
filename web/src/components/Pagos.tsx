import Icono from "@/components/Iconos";
import Revelar from "@/components/Revelar";
import { PAGOS, PAGOS_BAJADA, PAGOS_PIE, PAGOS_TITULO } from "@/lib/guia";
import { Wrap } from "@/components/ui";

/**
 * «Pagás como te quede cómodo»: los cuatro medios, en rectángulos iguales.
 *
 * La guía pide los logos oficiales de Tigo Money y de Mango. No están, y es
 * a propósito: no tenemos su autorización escrita, que es la misma regla que
 * la hoja de dirección de comunicación fija para los logos de aliados.
 * Publicar la marca de otro sin permiso es un problema de ellos con nosotros,
 * no un detalle de diseño. Van con el nombre compuesto y un ícono propio
 * hasta que lleguen; cuando lleguen se reemplazan los dos y nada más cambia.
 */

export default function Pagos() {
  return (
    <section className="bg-card">
      <Wrap>
        <Revelar>
          <div className="mx-auto max-w-[52ch] text-center">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted">
              <span aria-hidden="true" className="h-px w-8 bg-terracotta" />
              Cómo pagás
              <span aria-hidden="true" className="h-px w-8 bg-terracotta" />
            </span>
            <h2 className="mt-4">{PAGOS_TITULO}</h2>
            <p className="mx-auto mt-4 max-w-[44ch] text-ink">{PAGOS_BAJADA}</p>
          </div>
        </Revelar>

        <ul className="mt-10 grid list-none grid-cols-2 gap-3 p-0 lg:grid-cols-4">
          {PAGOS.map((p, i) => (
            <Revelar
              as="li"
              key={p.nombre}
              retardo={((i % 4) + 1) as 1 | 2 | 3 | 4}
              className="flex"
            >
              <div className="flex w-full flex-col items-center gap-3 rounded-[var(--radius-card)] border border-navy/12 bg-grad-start px-4 py-[clamp(18px,2.4vw,26px)] text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-card text-navy">
                  <Icono nombre={p.icono} tam={23} />
                </span>
                <span className="font-heading text-[15.5px] font-semibold text-navy">
                  {p.nombre}
                </span>
                <span className="text-[13.5px] leading-snug text-muted">
                  {p.detalle}
                </span>
              </div>
            </Revelar>
          ))}
        </ul>

        <Revelar>
          <p className="mt-8 text-center text-[15px] text-muted">{PAGOS_PIE}</p>
        </Revelar>
      </Wrap>
    </section>
  );
}
