import type { Metadata } from "next";
import Link from "next/link";
import Revelar from "@/components/Revelar";
import { PortadaCompacta, Rotulo } from "@/components/bloques";
import { CTA, Nota, Wrap } from "@/components/ui";
import { precioGs } from "@/lib/formato";
import {
  NIVELES,
  NOMBRE_SERVICIO,
  totalServicios,
  type Servicios,
} from "@/lib/niveles";

/* Los cinco servicios y sus tarifas salen del artículo 6 de las Condiciones
   Generales, vía src/lib/niveles.ts. Los nombres son los del contrato y no se
   cambian acá. Las descripciones se mantienen cortas a propósito: el contrato
   fija el nombre y el precio, no una definición, así que decimos lo que el
   material comercial ya decía y nada más. */

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Los cinco Servicios Doña Compra que se facturan en cada pedido, con su tarifa fija por nivel, y el legajo de buena gestión.",
};

const DESCRIPCION: Record<keyof Servicios, string> = {
  seguimiento:
    "Preparamos el código de recepción único de tu pedido y documentamos el retiro: qué se compró, quién lo retiró y cuándo.",
  custodia:
    "Archivamos la factura y los documentos de cada operación, de modo que tu historial de compras quede ordenado y consultable.",
  proveedores:
    "Gestiones logísticas, comerciales y administrativas entre vos y los mayoristas con los que trabajamos.",
  publicidad:
    "Acciones de publicidad y promoción de la red de comercios, contempladas por el programa comercial.",
  club:
    "Gestión del Club Doña Compra, el espacio donde las marcas que nos acompañan generan beneficios para los clientes de los comercios.",
};

const primero = NIVELES[0];
const ultimo = NIVELES[NIVELES.length - 1];
const CLAVES = Object.keys(NOMBRE_SERVICIO) as (keyof Servicios)[];

export default function ServiciosPage() {
  return (
    <main>
      <PortadaCompacta
        rotulo="Servicios"
        titulo="No se trata solamente de comprar mercadería."
        bajada={
          <>
            <p>
              Detrás de cada operación hay cinco servicios que acompañan tu
              actividad: el retiro seguro, el registro de lo comprado, las
              gestiones con los mayoristas, la promoción de la red y el Club.
            </p>
            <p className="mt-3">
              Tienen tarifa fija por pedido, que depende de tu nivel y no del
              monto de la mercadería.
            </p>
          </>
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
            <h2 className="mt-4 mb-3 max-w-[24ch]">
              Los cinco Servicios Doña Compra.
            </h2>
            <p className="mb-8 max-w-[60ch] text-ink">
              Entre{" "}
              <span className="font-mono font-semibold text-terracotta-ink">
                {precioGs(totalServicios(primero.servicios))}
              </span>{" "}
              en {primero.nombre} y{" "}
              <span className="font-mono font-semibold text-terracotta-ink">
                {precioGs(totalServicios(ultimo.servicios))}
              </span>{" "}
              en {ultimo.nombre}, sumados.{" "}
              <Link
                href="/niveles-y-tarifas"
                className="font-medium text-terracotta-ink"
              >
                Ver la tabla completa →
              </Link>
            </p>
          </Revelar>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CLAVES.map((c, i) => {
              const fijo = primero.servicios[c] === ultimo.servicios[c];
              return (
                <Revelar key={c} retardo={((i % 3) + 1) as 1 | 2 | 3}>
                  <div className="h-full rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(18px,2.4vw,26px)]">
                    <span className="inline-flex items-baseline gap-1.5 rounded-[var(--radius-button)] bg-terracotta/10 px-3 py-1.5">
                      <span className="font-mono text-[16px] font-semibold text-terracotta-ink">
                        {fijo
                          ? precioGs(primero.servicios[c])
                          : `${precioGs(primero.servicios[c])} – ${precioGs(ultimo.servicios[c])}`}
                      </span>
                      <span className="text-[12px] text-muted">
                        {fijo ? "por pedido" : "según nivel"}
                      </span>
                    </span>
                    <h3 className="mt-4 mb-2 text-[18px]">
                      {NOMBRE_SERVICIO[c]}
                    </h3>
                    <p className="text-[15px] text-ink">{DESCRIPCION[c]}</p>
                  </div>
                </Revelar>
              );
            })}
          </div>

          <Revelar>
            <Nota>
              Dos de los cinco cuestan lo mismo en todos los niveles; los otros
              tres acompañan al nivel. Puede haber además servicios
              complementarios puntuales —logística excepcional, acompañamiento
              técnico, acciones publicitarias a medida o capacitaciones—, que
              siempre llevan cotización previa por escrito y se facturan aparte.
            </Nota>
          </Revelar>
        </Wrap>
      </section>

      <section>
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
        titulo="Querés ver cómo queda tu pedido?"
        texto="En la calculadora de niveles y tarifas podés probar con el monto que comprarías."
      />
    </main>
  );
}
