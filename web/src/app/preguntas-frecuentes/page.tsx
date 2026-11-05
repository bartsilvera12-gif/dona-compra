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

/* Agrupadas por tema: treinta preguntas seguidas no se recorren, seis bloques
   con nombre sí. */
const GRUPOS: ReadonlyArray<{ id: string; titulo: string; preguntas: ReadonlyArray<Pregunta> }> = [
  {
    id: "como-funciona",
    titulo: "Cómo funciona",
    preguntas: [
      ["Qué es Doña Compra?", "Una empresa que compra la mercadería que vos elegís en tu proveedor y te la revende con factura, para que pagues después."],
      ["Doña Compra presta dinero?", "No. No entregamos efectivo. Realizamos una operación comercial de compra y reventa de mercadería."],
      ["Puedo elegir mi propio proveedor?", "Sí. Elegís el mayorista o proveedor que ya conocés y los productos que necesitás."],
      ["Quién compra la mercadería?", "Doña Compra le paga al proveedor al contado y adquiere la mercadería a su nombre, para después revendértela."],
      ["Cómo retiro mi pedido?", "Con un código único de retiro, de un solo uso, con vigencia y responsable registrados."],
    ],
  },
  {
    id: "pagos-y-precio",
    titulo: "Pagos y precio",
    preguntas: [
      ["Cuándo tengo que pagar?", "A más tardar 30 días calendario desde el retiro efectivo de la mercadería en el mayorista, acreditado con el código de recepción. No cuentan desde la fecha de la factura ni desde la compra al mayorista."],
      ["Qué incluye el precio?", "El costo de la mercadería en el mayorista, el recargo comercial de tu nivel y la tarifa fija de los cinco Servicios Doña Compra."],
      ["Cuáles son los cinco Servicios Doña Compra?", "Seguimiento de Compras con Código, Custodia y Trazabilidad Documental, Gestión de Proveedores Amigos, Publicidad y Promoción de la Red, y Gestión del Club Doña Compra. Tienen tarifa fija por pedido: entre Gs. 7.000 en Hierro y Gs. 22.500 en Diamante."],
      ["Cobran multas por atraso?", "No aplicamos multas ni intereses por atraso. Lo que sí ocurre es que, al día siguiente del vencimiento, quedan suspendidas las compras nuevas hasta regularizar; el desbloqueo lo revisa la dirección caso por caso."],
      ["Qué sucede si hace falta una gestión de cobranza?", "Si se requiere una gestión de cobranza o un pagaré, pueden refacturarse los gastos realmente realizados y comprobados, sin recargo adicional."],
      ["Qué pasa si dejo de hacer pedidos?", "Después de tres meses calendario sin ningún pedido válido termina el estatus de miembro, con aviso 30 y 7 días antes. Volver a entrar sigue otra vez el procedimiento de entrada."],
    ],
  },
  {
    id: "niveles",
    titulo: "Niveles y montos",
    preguntas: [
      ["Cómo funcionan los niveles?", "Cada nivel tiene un cupo: el máximo de mercadería que se puede comprar para vos al mismo tiempo. Podés tener varios pedidos abiertos mientras la suma de lo comprometido y todavía impago no pase ese cupo."],
      ["El recargo comercial cambia según mi nivel?", "Sí. Va del 18 % en Hierro al 12 % en Diamante, y se aplica sobre el costo mayorista, no sobre el precio al que después vendés."],
      ["Subo de nivel automáticamente?", "No. Hay que superar el acumulado de compras previsto para tu nivel, y además tener los pedidos cancelados en plazo, presentar una solicitud, hacer un nuevo Análisis y recibir la decisión de la dirección. El ascenso es de a un nivel, sin saltarse ninguno."],
      ["Y si un pedido me hace pasar el acumulado?", "Ese pedido se factura entero con el nivel que tenías al confirmarlo. El nivel nuevo, si la dirección lo aprueba, rige para los pedidos siguientes."],
      ["Un pago parcial me libera cupo?", "No. El cupo se libera recién cuando el pedido queda cancelado por completo."],
      ["Existen montos mínimos de pedido?", "Sí: Gs. 100.000 en nivel Hierro y Gs. 150.000 desde nivel Cobre, expresados en costo mayorista."],
    ],
  },
  {
    id: "entrada",
    titulo: "Cómo se entra",
    preguntas: [
      ["Cómo empieza el trámite?", "Con la Solicitud de Entrada, que es gratuita y se hace por WhatsApp. Podés pedir Hierro, Cobre, Bronce, Plata u Oro. A Rubis y Diamante no se entra directo: se llega por ascenso."],
      ["Qué son las tres situaciones de WhatsApp?", "Situaciones comerciales de todos los días, elegidas al azar y enviadas de a una antes de cualquier pago. Respondés con tus palabras, por escrito o con un audio, en español, en guaraní o mezclando. No hay respuesta correcta que adivinar, y tus respuestas por sí solas nunca alcanzan para rechazar una candidatura."],
      ["Cuánto cuesta el Análisis?", "Depende del nivel: Gs. 50.000 en Hierro, 100.000 en Cobre, 150.000 en Bronce y en Plata, y 200.000 en Oro. Para entrar directo a un nivel intermedio se pagan también los de los anteriores, así que entrar directo a Oro suma Gs. 650.000. El total se te informa antes de que te comprometas."],
      ["Pagar el Análisis me asegura entrar?", "No. El Análisis cubre el diagnóstico y el informe; la admisión la decide la dirección, y el importe no se devuelve si la decisión es negativa."],
      ["Qué es la Prueba de Palabra Empeñada?", "Una prueba práctica voluntaria que puede consistir en recibir y devolver Gs. 10.000 que son de Doña Compra. No pagás nada. Podés decir que no o retirarte cuando quieras, sin que eso afecte tu solicitud, tu nivel ni tu cupo. Si participás, solo puede jugar a tu favor."],
      ["Necesito RUC para solicitar?", "No para la solicitud preliminar. Antes de la primera reventa sí hay que verificar los requisitos fiscales para facturar por SIFEN/DNIT, y podemos informarte sobre un acompañamiento opcional."],
      ["Vendo desde mi casa o por internet, puedo entrar?", "Sí. Los comercios a domicilio y en línea se verifican por medios adecuados. No quedás excluido por no tener vidriera."],
    ],
  },
  {
    id: "pagador-rapido",
    titulo: "Pagador Rápido y el Club",
    preguntas: [
      ["Qué es el estatus Pagador Rápido?", "Un reconocimiento para quien paga antes de tiempo. Se obtiene con al menos 6 pedidos pagados por completo y un plazo promedio de pago menor a 25 días desde el retiro. Da un punto porcentual menos de recargo sobre la mercadería: en Bronce, por ejemplo, pasás del 16 % al 15 %."],
      ["La rebaja alcanza a los servicios?", "No. Solo al recargo sobre la mercadería. Los cinco Servicios Doña Compra se siguen facturando con su tarifa normal."],
      ["Es retroactiva?", "No. Se aplica a los pedidos posteriores al reconocimiento, nunca a facturas anteriores. El estatus se reevalúa cada tanto y se pierde apenas hay un atraso."],
      ["Qué más trae el estatus?", "Una insignia, un autoadhesivo con QR para exhibir en tu local, tu acceso personal al Club Doña Compra y la posibilidad de invitar a tus propios clientes al Club."],
      ["Mi nombre aparece publicado en algún lado?", "Solo si lo autorizás por separado. La publicación en la web del Club incluye tu nombre comercial, tu localidad y la insignia vigente, nunca montos, deudas ni detalles de tus pagos. Podés pedir el retiro cuando quieras."],
    ],
  },
  {
    id: "historial-y-visitas",
    titulo: "Historial y visitas",
    preguntas: [
      ["Qué es el Legajo de buena gestión?", "Un documento, a pedido, que reúne hechos verificables de tu historial: compras, puntualidad y antigüedad. Referencia: Gs. 300.000."],
      ["Cómo solicito una visita?", "Escribinos por WhatsApp o completá el formulario de contacto. Coordinamos la visita según disponibilidad."],
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
                  No la encontrás?
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
        titulo="Tenés otra pregunta?"
        texto={`Escribinos y te respondemos. ${site.plazo}`}
      />
    </main>
  );
}
