import Link from "next/link";
import Revelar from "@/components/Revelar";
import { FAQ, FAQ_TITULO } from "@/lib/guia";
import { waLink } from "@/lib/site";
import { Wrap } from "@/components/ui";

/**
 * Las preguntas frecuentes, en acordeón.
 *
 * Hechas con `<details>` y `<summary>` nativos, no con estado de React.
 * Eso trae tres cosas de arriba, sin escribir una línea:
 *
 *   - teclado y lector de pantalla funcionan como la gente espera, con el
 *     estado abierto/cerrado anunciado por el navegador;
 *   - el buscador del navegador (Ctrl+F) encuentra el texto de una respuesta
 *     cerrada y abre el acordeón solo, cosa que un div con `hidden` no hace;
 *   - sin JavaScript sigue funcionando.
 *
 * Quedan todas cerradas al cargar. Abrir la primera «para que se vea que es
 * un acordeón» empuja las otras siete fuera de la pantalla, que es
 * exactamente lo contrario de lo que se busca.
 *
 * El JSON-LD va con las mismas preguntas: es la sección que Google muestra
 * directamente en los resultados, y repetirlas a mano sería pedir que un día
 * digan cosas distintas.
 */

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.pregunta,
    acceptedAnswer: { "@type": "Answer", text: f.respuesta },
  })),
};

export default function Preguntas() {
  return (
    <section id="preguntas" className="scroll-mt-24 bg-card">
      <Wrap>
        <div className="grid gap-[clamp(24px,4vw,64px)] lg:grid-cols-[minmax(0,32ch)_1fr]">
          <Revelar>
            <div className="lg:sticky lg:top-28">
              <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted">
                <span aria-hidden="true" className="h-px w-8 bg-terracotta" />
                Dudas
              </span>
              <h2 className="mt-4 max-w-[14ch]">{FAQ_TITULO}</h2>
              <p className="mt-4 max-w-[36ch] text-ink">
                Si te queda alguna,{" "}
                <a
                  href={waLink("Hola Doña, tengo una consulta.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-terracotta-ink underline underline-offset-4 hover:text-navy"
                >
                  escribile a Doña
                </a>
                .
              </p>
            </div>
          </Revelar>

          <Revelar retardo={1}>
            <ul className="m-0 grid list-none gap-2 p-0">
              {FAQ.map((f) => (
                <li key={f.pregunta}>
                  <details className="group rounded-[var(--radius-card)] border border-navy/12 bg-grad-start/60 open:bg-grad-start">
                    <summary className="flex cursor-pointer list-none items-start gap-4 p-[clamp(14px,2vw,20px)] font-heading text-[clamp(15.5px,1.8vw,17.5px)] font-semibold text-navy [&::-webkit-details-marker]:hidden">
                      <span className="flex-1">{f.pregunta}</span>
                      {/* El signo: una cruz que gira hasta quedar en menos. */}
                      <span
                        aria-hidden="true"
                        className="mt-1 grid h-6 w-6 flex-none place-items-center rounded-full bg-ocre text-navy transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="13"
                          height="13"
                          fill="none"
                        >
                          <path
                            d="M12 5v14M5 12h14"
                            className="stroke-current"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-[clamp(14px,2vw,20px)] pb-[clamp(14px,2vw,20px)]">
                      <p className="m-0 max-w-[62ch] text-[15.5px] leading-relaxed text-ink">
                        {f.respuesta}
                      </p>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </Revelar>
        </div>

        <Revelar>
          <p className="mt-8 text-[14.5px] text-muted lg:ml-[calc(32ch+clamp(24px,4vw,64px))]">
            Hay más en la{" "}
            <Link
              href="/preguntas-frecuentes"
              className="font-medium text-terracotta-ink underline underline-offset-4 hover:text-navy"
            >
              página de preguntas
            </Link>
            .
          </p>
        </Revelar>
      </Wrap>

      <script
        type="application/ld+json"
        // Son textos nuestros: no entra nada del usuario.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
    </section>
  );
}
