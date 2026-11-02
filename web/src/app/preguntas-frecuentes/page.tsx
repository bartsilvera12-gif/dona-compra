import type { Metadata } from "next";
import Revelar from "@/components/Revelar";
import { PortadaCompacta, Rotulo } from "@/components/bloques";
import { CTA, Wrap } from "@/components/ui";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Respuestas a las dudas más comunes sobre cómo comprar mercadería con Doña Compra y pagar después.",
};

type Pregunta = readonly [string, string];

/* Agrupadas por tema: dieciséis preguntas seguidas no se recorren, cuatro
   bloques con nombre sí. */
const GRUPOS: ReadonlyArray<{ id: string; titulo: string; preguntas: ReadonlyArray<Pregunta> }> = [
  {
    id: "como-funciona",
    titulo: "Cómo funciona",
    preguntas: [
      ["¿Qué es Doña Compra?", "Una empresa que compra la mercadería que vos elegís en tu proveedor y te la revende con factura, para que pagues después."],
      ["¿Doña Compra presta dinero?", "No. No entregamos efectivo. Realizamos una operación comercial de compra y reventa de mercadería."],
      ["¿Puedo elegir mi propio proveedor?", "Sí. Elegís el mayorista o proveedor que ya conocés y los productos que necesitás."],
      ["¿Quién compra la mercadería?", "Doña Compra le paga al proveedor al contado y adquiere la mercadería a su nombre, para después revendértela."],
      ["¿Cómo retiro mi pedido?", "Con un código único de retiro, de un solo uso, con vigencia y responsable registrados."],
    ],
  },
  {
    id: "pagos-y-precio",
    titulo: "Pagos y precio",
    preguntas: [
      ["¿Cuándo tengo que pagar?", "A más tardar 30 días después de la fecha de factura. El vencimiento exacto figura en ese documento."],
      ["¿Qué incluye el precio?", "El precio de compra de la mercadería, el margen comercial del 12 % y los servicios fijos de tu nivel."],
      ["¿Qué es el Pack Doña Compra?", "Un servicio por pedido que reúne publicidad, seguimiento y negociaciones, y el Club Doña Compra. Su importe depende del nivel."],
      ["¿Cobran multas por atraso?", "No aplicamos multas ni intereses por atraso. Sí conversamos para acomodar la situación."],
      ["¿Qué sucede si hace falta una gestión de cobranza?", "Si se requiere una gestión de cobranza o un pagaré, pueden refacturarse los gastos realmente realizados y comprobados, sin margen adicional."],
    ],
  },
  {
    id: "niveles",
    titulo: "Niveles y montos",
    preguntas: [
      ["¿Cómo funcionan los niveles?", "Cada nivel tiene un tope de compras acumuladas. Al ingresar a un nivel, el contador vuelve a cero."],
      ["¿El margen comercial cambia según mi nivel?", "No. El margen es del 12 % en los siete niveles. Lo que cambia es el Pack Doña Compra."],
      ["¿Subo de nivel automáticamente?", "No. Superar el tope habilita una evaluación. El ascenso es de a un nivel y lo decide Doña Compra."],
      ["¿Existen montos mínimos de pedido?", "Sí: Gs. 100.000 en nivel Hierro y Gs. 150.000 desde nivel Cobre, expresados en precio de compra."],
    ],
  },
  {
    id: "historial-y-visitas",
    titulo: "Historial y visitas",
    preguntas: [
      ["¿Qué es el Legajo de buena gestión?", "Un documento, a pedido, que reúne hechos verificables de tu historial: compras, puntualidad y antigüedad. Referencia: Gs. 300.000."],
      ["¿Cómo solicito una visita?", "Escribinos por WhatsApp o completá el formulario de contacto. Coordinamos la visita según disponibilidad."],
    ],
  },
];

const FAQ = GRUPOS.flatMap((g) => g.preguntas);

/** Datos estructurados: habilitan el resultado enriquecido de FAQ en Google. */
function FaqJsonLd() {
  const datos = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(([pregunta, respuesta]) => ({
      "@type": "Question",
      name: pregunta,
      acceptedAnswer: { "@type": "Answer", text: respuesta },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }}
    />
  );
}

export default function FaqPage() {
  return (
    <main>
      <FaqJsonLd />
      <PortadaCompacta
        rotulo="Preguntas frecuentes"
        titulo="Lo que más nos preguntan los comerciantes."
        bajada={<p>Si tu duda no está acá, escribinos y te respondemos.</p>}
        fotos={[
          { src: "/assets/rubro-libreria.jpg", alt: "Librería con útiles escolares" },
          { src: "/assets/hero-4-640.jpg", alt: "Pasillo de un supermercado con góndolas llenas" },
          { src: "/assets/rubro-calzado.jpg", alt: "Calzado en exhibición" },
        ]}
      />

      <section className="bg-card">
        <Wrap>
          <div className="grid items-start gap-[clamp(28px,5vw,72px)] lg:grid-cols-[280px_1fr]">
            <aside className="lg:sticky lg:top-28">
              <nav aria-label="Temas" className="flex flex-wrap gap-2 lg:grid lg:gap-1">
                {GRUPOS.map((g, i) => (
                  <a
                    key={g.id}
                    href={`#${g.id}`}
                    className="flex items-center gap-3 rounded-full border border-navy/15 px-4 py-2 text-[14px] text-ink hover:border-terracotta lg:rounded-[var(--radius-button)] lg:border-transparent lg:px-3 lg:py-2.5 lg:hover:bg-grad-mid"
                  >
                    <span className="font-mono text-[12px] text-terracotta-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {g.titulo}
                    <span className="ml-auto hidden text-xs text-muted lg:inline">
                      {g.preguntas.length}
                    </span>
                  </a>
                ))}
              </nav>

              <div className="mt-8 hidden rounded-[var(--radius-card)] bg-navy p-6 lg:block">
                <p className="font-heading text-[17px] font-semibold text-card">
                  ¿No la encontrás?
                </p>
                <p className="mt-2 text-[14px] text-card/80">{site.plazo}</p>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block font-medium text-terracotta-soft hover:text-card"
                >
                  Escribir por WhatsApp →
                </a>
              </div>
            </aside>

            <div className="grid gap-[clamp(40px,5vw,64px)]">
              {GRUPOS.map((g, i) => (
                <Revelar key={g.id} as="section">
                  <div id={g.id} className="scroll-mt-28">
                    <Rotulo>Tema {String(i + 1).padStart(2, "0")}</Rotulo>
                    <h2 className="mt-3 mb-5">{g.titulo}</h2>
                    {/* <details> da el plegado sin JavaScript: funciona aunque
                        falle la hidratación, y el buscador lee el contenido
                        igual. */}
                    <div className="border-t border-navy/12">
                      {g.preguntas.map(([pregunta, respuesta]) => (
                        <details
                          key={pregunta}
                          className="group border-b border-navy/12"
                        >
                          <summary className="cursor-pointer list-none py-5 font-heading text-[17px] font-semibold text-navy marker:content-none hover:text-terracotta-ink">
                            <span className="flex items-center justify-between gap-4">
                              {pregunta}
                              <span
                                aria-hidden="true"
                                className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-navy/15 text-lg text-terracotta-ink transition-transform group-open:rotate-45 group-open:border-terracotta"
                              >
                                +
                              </span>
                            </span>
                          </summary>
                          <p className="-mt-1 max-w-[64ch] pb-6 pr-12 text-ink">
                            {respuesta}
                          </p>
                        </details>
                      ))}
                    </div>
                  </div>
                </Revelar>
              ))}
            </div>
          </div>
        </Wrap>
      </section>

      <CTA
        titulo="¿Tenés otra pregunta?"
        texto={`Escribinos y te respondemos. ${site.plazo}`}
      />
    </main>
  );
}
