import type { Metadata } from "next";
import Link from "next/link";
import { site, waLink } from "@/lib/site";
import { btnPrimario, btnSecundario, Hero, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Respuestas a las dudas más comunes sobre cómo comprar mercadería con Doña Compra y pagar después.",
};

const FAQ: ReadonlyArray<readonly [string, string]> = [
  ["¿Qué es Doña Compra?", "Una empresa que compra la mercadería que vos elegís en tu proveedor y te la revende con factura, para que pagues después."],
  ["¿Doña Compra presta dinero?", "No. No entregamos efectivo. Realizamos una operación comercial de compra y reventa de mercadería."],
  ["¿Puedo elegir mi propio proveedor?", "Sí. Elegís el mayorista o proveedor que ya conocés y los productos que necesitás."],
  ["¿Quién compra la mercadería?", "Doña Compra le paga al proveedor al contado y adquiere la mercadería a su nombre, para después revendértela."],
  ["¿Cómo retiro mi pedido?", "Con un código único de retiro, de un solo uso, con vigencia y responsable registrados."],
  ["¿Cuándo tengo que pagar?", "A más tardar 30 días después de la fecha de factura. El vencimiento exacto figura en ese documento."],
  ["¿Qué incluye el precio?", "El precio de compra de la mercadería, el margen comercial del 12 % y los servicios fijos de tu nivel."],
  ["¿El margen comercial cambia según mi nivel?", "No. El margen es del 12 % en los siete niveles. Lo que cambia es el Pack Doña Compra."],
  ["¿Cómo funcionan los niveles?", "Cada nivel tiene un tope de compras acumuladas. Al ingresar a un nivel, el contador vuelve a cero."],
  ["¿Subo de nivel automáticamente?", "No. Superar el tope habilita una evaluación. El ascenso es de a un nivel y lo decide Doña Compra."],
  ["¿Existen montos mínimos de pedido?", "Sí: Gs. 100.000 en nivel Hierro y Gs. 150.000 desde nivel Cobre, expresados en precio de compra."],
  ["¿Cobran multas por atraso?", "No aplicamos multas ni intereses por atraso. Sí conversamos para acomodar la situación."],
  ["¿Qué sucede si hace falta una gestión de cobranza?", "Si se requiere una gestión de cobranza o un pagaré, pueden refacturarse los gastos realmente realizados y comprobados, sin margen adicional."],
  ["¿Qué es el Pack Doña Compra?", "Un servicio por pedido que reúne publicidad, seguimiento y negociaciones, y el Club Doña Compra. Su importe depende del nivel."],
  ["¿Qué es el Legajo de buena gestión?", "Un documento, a pedido, que reúne hechos verificables de tu historial: compras, puntualidad y antigüedad. Referencia: Gs. 300.000."],
  ["¿Cómo solicito una visita?", "Escribinos por WhatsApp o completá el formulario de contacto. Coordinamos la visita según disponibilidad."],
];

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
      <Hero
        eyebrow="Preguntas frecuentes"
        titulo="Lo que más nos preguntan los comerciantes."
        bajada="Si tu duda no está acá, escribinos y te respondemos."
      />

      <Section tono="tarjeta">
        {/* <details> da el plegado sin JavaScript: funciona aunque falle
            la hidratación, y el buscador lee el contenido igual. */}
        <div className="grid max-w-[80ch] gap-2">
          {FAQ.map(([pregunta, respuesta]) => (
            <details
              key={pregunta}
              className="group rounded-[var(--radius-card)] border border-navy/12 bg-card px-5 py-4 open:border-terracotta/40"
            >
              <summary className="cursor-pointer list-none font-heading text-[17px] font-semibold text-navy marker:content-none">
                <span className="flex items-start justify-between gap-4">
                  {pregunta}
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex-none text-terracotta-ink transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-ink">{respuesta}</p>
            </details>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="mb-3">¿Tenés otra pregunta?</h2>
          <p className="mb-6 max-w-[52ch] text-ink">
            Escribinos y te respondemos. {site.plazo}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contacto" className={btnPrimario}>
              Ir a contacto
            </Link>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={btnSecundario}
            >
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </Section>
    </main>
  );
}
