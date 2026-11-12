import Icono from "@/components/Iconos";
import Revelar from "@/components/Revelar";
import { RUBROS, RUBROS_BAJADA, RUBROS_PIE, RUBROS_TITULO } from "@/lib/guia";
import { waLink } from "@/lib/site";
import { Wrap } from "@/components/ui";

/**
 * Los doce rubros, en cuadrados de cuatro por tres.
 *
 * La guía pide que al pasar el mouse o al tocar la tarjeta cambie el borde y
 * aparezca la frase. Hecho solo con CSS, sin estado ni JavaScript: la frase
 * está siempre en el documento y es siempre legible por un lector de
 * pantalla; lo que cambia es la altura y la opacidad.
 *
 * Dos cosas que un `:hover` solo no resuelve:
 *
 * 1. En un teléfono no hay mouse. Por eso la frase también aparece con
 *    `:focus-within`, y la tarjeta es un `<a>` al WhatsApp: tocarla hace
 *    algo, en vez de dejar al dedo esperando un hover que nunca llega.
 * 2. Con `prefers-reduced-motion` no hay transición y la frase aparece de
 *    golpe, sin el despliegue.
 *
 * El `<a>` lleva un texto accesible completo —«Despensas: que nunca te falte
 * lo de todos los días. Escribile a Doña»—, porque «Despensas» a secas no le
 * dice a nadie a dónde lleva el enlace.
 */

export default function Rubros() {
  return (
    <section className="bg-grad-start">
      <Wrap>
        <Revelar>
          <div className="mx-auto max-w-[52ch] text-center">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted">
              <span aria-hidden="true" className="h-px w-8 bg-terracotta" />
              Para quién es
              <span aria-hidden="true" className="h-px w-8 bg-terracotta" />
            </span>
            <h2 className="mt-4">{RUBROS_TITULO}</h2>
            <p className="mx-auto mt-4 max-w-[44ch] text-ink">
              {RUBROS_BAJADA}
            </p>
          </div>
        </Revelar>

        <ul className="mt-10 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
          {RUBROS.map((r, i) => (
            <Revelar
              as="li"
              key={r.nombre}
              retardo={((i % 4) + 1) as 1 | 2 | 3 | 4}
              className="flex"
            >
              <a
                href={waLink(
                  `Hola Doña, tengo un negocio de ${r.nombre.toLowerCase()}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full flex-col items-center rounded-[var(--radius-card)] border border-navy/10 bg-card p-[clamp(14px,2vw,22px)] text-center transition-colors hover:border-terracotta focus-visible:border-terracotta"
              >
                <span className="text-navy transition-colors group-hover:text-terracotta-ink group-focus-visible:text-terracotta-ink">
                  <Icono nombre={r.icono} tam={30} />
                </span>
                <span className="mt-3 text-[15px] font-semibold text-navy">
                  {r.nombre}
                </span>
                {/* La frase: oculta por alto, no por `display`, para que la
                    lea un lector de pantalla y para que se pueda animar. */}
                <span className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] motion-reduce:transition-none">
                  <span className="overflow-hidden">
                    <span className="mt-2 block text-[13.5px] leading-snug text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                      {r.frase}
                    </span>
                  </span>
                </span>
              </a>
            </Revelar>
          ))}
        </ul>

        <Revelar>
          <p className="mt-9 text-center text-[15px] text-ink">
            <a
              href={waLink("Hola Doña, mi rubro no está en la lista.")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-terracotta-ink underline underline-offset-4 hover:text-navy"
            >
              {RUBROS_PIE} →
            </a>
          </p>
        </Revelar>
      </Wrap>
    </section>
  );
}
