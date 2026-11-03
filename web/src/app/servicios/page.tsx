import type { Metadata } from "next";
import Link from "next/link";
import Revelar from "@/components/Revelar";
import { PortadaCompacta, Rotulo } from "@/components/bloques";
import { CTA, Wrap } from "@/components/ui";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Seguridad de las compras, análisis, Pack Doña Compra y legajo de buena gestión: los servicios que acompañan cada pedido.",
};

const SERVICIOS = [
  {
    precio: "Gs. 4.000",
    cuando: "por pedido",
    titulo: "Seguridad de las compras",
    texto:
      "Preparamos el código de retiro de tu pedido y documentamos fotográficamente la mercadería. Así sabés qué se compró, quién lo retiró y cuándo.",
  },
  {
    precio: "Gs. 3.000",
    cuando: "por pedido",
    titulo: "Análisis de las compras",
    texto:
      "Archivamos y analizamos tus compras, con una revisión periódica y la elaboración de un informe anual de tu actividad con Doña Compra.",
  },
] as const;

const PACK = [
  ["Publicidad", "Acciones publicitarias contempladas por el programa comercial."],
  [
    "Seguimiento y negociaciones",
    "Gestiones logísticas, comerciales y administrativas entre el comerciante y los mayoristas.",
  ],
  [
    "Club Doña Compra",
    "Componente del programa destinado a crear beneficios para los clientes de los comerciantes, según su funcionamiento real.",
  ],
] as const;

export default function ServiciosPage() {
  return (
    <main>
      <PortadaCompacta
        rotulo="Servicios"
        titulo="No se trata solamente de comprar mercadería."
        bajada={
          <p>
            Detrás de cada operación hay servicios que acompañan tu actividad
            comercial: el retiro seguro, el registro de lo comprado y el
            seguimiento con los mayoristas.
          </p>
        }
        fotos={[
          { src: "/assets/paso-3.jpg", alt: "Retiro de la mercadería con código" },
          { src: "/assets/paso-2.jpg", alt: "Gestión con el mayorista" },
          { src: "/assets/rubro-perfumes.jpg", alt: "Mercadería documentada" },
        ]}
      />

      <section className="bg-card">
        <Wrap>
          <Revelar>
            <Rotulo>Por pedido</Rotulo>
            <h2 className="mt-4 mb-8 max-w-[22ch]">
              Servicios fijos, iguales en todos los niveles.
            </h2>
          </Revelar>

          <div className="grid gap-4 lg:grid-cols-2">
            {SERVICIOS.map((s, i) => (
              <Revelar key={s.titulo} retardo={(i + 1) as 1 | 2}>
                <div className="h-full rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(18px,2.5vw,28px)]">
                  <span className="inline-flex items-baseline gap-1.5 rounded-[var(--radius-button)] bg-terracotta/10 px-3 py-1.5">
                    <span className="font-mono text-[17px] font-semibold text-terracotta-ink">
                      {s.precio}
                    </span>
                    <span className="text-[12px] text-muted">{s.cuando}</span>
                  </span>
                  <h3 className="mt-4 mb-2">{s.titulo}</h3>
                  <p className="text-ink">{s.texto}</p>
                </div>
              </Revelar>
            ))}
          </div>
        </Wrap>
      </section>

      <section>
        <Wrap>
          <Revelar>
            <Rotulo>Según tu nivel</Rotulo>
            <h2 className="mt-4 mb-3 max-w-[22ch]">Pack Doña Compra</h2>
            <p className="mb-2 max-w-[58ch] text-ink">
              El Pack reúne tres áreas de trabajo. Su importe por pedido depende
              de tu nivel, no del monto de la mercadería.
            </p>
            <p className="mb-8">
              <span className="font-mono text-[17px] font-semibold text-terracotta-ink">
                De Gs. 3.000 a Gs. 75.000
              </span>{" "}
              <span className="text-[13.5px] text-muted">según el nivel</span>
              {" · "}
              <Link href="/niveles-y-tarifas" className="text-[14px] font-medium text-terracotta-ink">
                ver la tabla completa →
              </Link>
            </p>
          </Revelar>

          <div className="grid gap-4 sm:grid-cols-3">
            {PACK.map(([t, d], i) => (
              <Revelar key={t} retardo={(i + 1) as 1 | 2 | 3}>
                <div className="flex h-full gap-4 rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(16px,2.2vw,22px)]">
                  <span
                    aria-hidden="true"
                    className="w-0.5 flex-none self-stretch rounded bg-terracotta"
                  />
                  <div>
                    <h3 className="mb-1.5 text-[18px]">{t}</h3>
                    <p className="text-[15px] text-ink">{d}</p>
                  </div>
                </div>
              </Revelar>
            ))}
          </div>

          <Revelar>
            <p className="mt-6 max-w-[74ch] text-xs leading-relaxed text-muted">
              Los beneficios concretos del Club se comunican una vez definidos.
              No publicamos promesas que todavía no están detalladas en las
              condiciones.
            </p>
          </Revelar>
        </Wrap>
      </section>

      <section className="bg-card">
        <Wrap>
          <div className="grid gap-[clamp(24px,4vw,48px)] lg:grid-cols-2">
            <Revelar>
              <Rotulo>A pedido</Rotulo>
              <h2 className="mt-4 mb-3">Legajo de buena gestión</h2>
              <span className="mb-4 inline-block font-mono text-[18px] font-semibold text-terracotta-ink">
                Gs. 300.000
              </span>
              <p className="text-ink">
                Un documento que reúne hechos verificables de tu historial
                comercial con Doña Compra: compras realizadas, puntualidad de
                pago y antigüedad de la relación.
              </p>
            </Revelar>

            <Revelar retardo={1}>
              {/* Lo que el legajo NO es va igual de visible que lo que sí es:
                  es donde se generan las expectativas equivocadas. */}
              <div className="rounded-[var(--radius-card)] border border-error/35 bg-card p-[clamp(18px,2.5vw,28px)]">
                <h3 className="mb-4">Lo que el legajo no es</h3>
                <ul className="grid gap-3 text-ink">
                  <li>No se entrega a terceros sin tu consentimiento.</li>
                  <li>
                    No garantiza crédito ni aprobación de ninguna operación.
                  </li>
                  <li>
                    No asegura condiciones especiales con mayoristas ni ventajas
                    comerciales.
                  </li>
                </ul>
              </div>
            </Revelar>
          </div>
        </Wrap>
      </section>

      <CTA
        titulo="¿Querés ver cómo queda tu pedido?"
        texto="En la calculadora de niveles y tarifas podés probar con el monto que comprarías."
      />
    </main>
  );
}
