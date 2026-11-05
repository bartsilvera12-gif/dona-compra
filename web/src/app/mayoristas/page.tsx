import type { Metadata } from "next";
import Link from "next/link";
import Revelar from "@/components/Revelar";
import {
  Cifra,
  FilaAlterna,
  PasoFoto,
  PortadaFoto,
  Rotulo,
} from "@/components/bloques";
import { btnPrimario, btnSecundario, CTA, Wrap } from "@/components/ui";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mayoristas",
  description:
    "Venda más sin asumir riesgo de cobro: Doña Compra le paga al contado la mercadería de sus clientes comerciantes.",
};

const VENTAJAS = [
  ["Cobra al contado", "Nosotros pagamos en el momento de la compra. Para usted es una venta de contado, sin cuenta corriente."],
  ["Sin riesgo de incobrables", "La evaluación del comerciante y el riesgo del pago a 30 días quedan de nuestro lado, no del suyo."],
  ["Tickets más grandes", "El comerciante que no tiene que pagar al contado compra más cantidad y surtido en el mismo pedido."],
  ["Clientes que vuelven", "El comerciante sigue comprando en su depósito: nosotros no vendemos mercadería ni competimos con usted."],
  ["Sin cambiar su operación", "Sigue facturando y despachando como siempre. No le pedimos sistema nuevo ni integración."],
  ["Difusión en el Club", "Puede publicar ofertas y novedades para la comunidad de comerciantes que compra con nosotros."],
] as const;

const PASOS = [
  {
    titulo: "Nos presentamos",
    texto: "Coordinamos una reunión, le explicamos el servicio y acordamos cómo operar con sus clientes.",
    foto: { src: "/assets/paso-2.jpg", alt: "Reunión con el mayorista" },
  },
  {
    titulo: "El comerciante arma el pedido",
    texto: "Su cliente arma el pedido con usted, como siempre, y nos lo pasa para la compra.",
    foto: { src: "/assets/paso-1.jpg", alt: "Armado del pedido" },
  },
  {
    titulo: "Pagamos y se retira",
    texto: "Abonamos al contado y el comerciante retira con el código único que le entregamos.",
    foto: { src: "/assets/paso-3.jpg", alt: "Retiro de la mercadería" },
  },
] as const;

/**
 * Única página del sitio que trata de usted.
 *
 * No es una inconsistencia: la hoja de dirección de comunicación (sección 6)
 * pide «página dedicada a los mayoristas, de trato formal (usted)». Al
 * comerciante se le habla de vos; al mayorista, de usted. Lo que la hoja sí
 * prohíbe es mezclar los dos registros dentro de una misma pieza.
 */
export default function MayoristasPage() {
  return (
    <main>
      <PortadaFoto
        rotulo="Para mayoristas"
        titulo="Venda más, cobre al contado, sin riesgo de cobranza."
        bajada="Si es mayorista o distribuidor, Doña Compra le paga en el momento la mercadería que sus clientes comerciantes necesitan. El riesgo del pago diferido lo asumimos nosotros."
        foto={{
          src: "/assets/30-dias-pago-1400.jpg",
          alt: "Depósito mayorista preparando un pedido",
        }}
        acciones={
          <>
            <Link href="/contacto" className={btnPrimario}>
              Quiero ser proveedor
            </Link>
            <a
              href={waLink(
                "Hola, Doña Compra. Soy mayorista y me interesa trabajar con ustedes.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={btnSecundario}
            >
              Escribir por WhatsApp
            </a>
          </>
        }
      />

      <section>
        <Wrap>
          <div className="grid gap-[clamp(24px,3vw,40px)] sm:grid-cols-3">
            <Cifra
              valor="0"
              unidad="días"
              texto="De espera para cobrar: el pago al proveedor es al contado."
            />
            <Cifra
              valor="0"
              texto="Riesgo de incobrables de su lado. La cobranza es asunto nuestro."
              retardo={1}
            />
            <Cifra
              valor="12"
              unidad="rubros"
              texto="Comerciantes de ropa, calzado, cosmética, despensas y más."
              retardo={2}
            />
          </div>
        </Wrap>
      </section>

      <section className="bg-card">
        <Wrap>
          <Revelar>
            <Rotulo>Por qué le conviene</Rotulo>
            <h2 className="mt-4 max-w-[22ch]">
              Su cliente compra más y usted cobra igual de rápido.
            </h2>
          </Revelar>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VENTAJAS.map(([t, d], i) => (
              <Revelar key={t} retardo={((i % 3) + 1) as 1 | 2 | 3}>
                <div className="h-full rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(16px,2.2vw,24px)]">
                  <h3 className="mb-2">{t}</h3>
                  <p className="text-ink">{d}</p>
                </div>
              </Revelar>
            ))}
          </div>
        </Wrap>
      </section>

      <section>
        <Wrap>
          <Revelar>
            <Rotulo>Cómo trabajamos</Rotulo>
            <h2 className="mt-4 max-w-[20ch]">Tres pasos y sigue operando igual.</h2>
          </Revelar>

          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {PASOS.map((p, i) => (
              <PasoFoto
                key={p.titulo}
                n={i + 1}
                titulo={p.titulo}
                texto={p.texto}
                foto={p.foto}
                retardo={(i + 1) as 1 | 2 | 3}
              />
            ))}
          </div>
        </Wrap>
      </section>

      <section className="bg-card">
        <Wrap>
          <FilaAlterna
            rotulo="No competimos con usted"
            titulo="Doña Compra no vende mercadería."
            invertida
            foto={{
              src: "/assets/rubro-libreria.jpg",
              alt: "Depósito de librería con stock surtido",
            }}
            enlace={{ href: "/el-concepto", texto: "Ver el concepto completo" }}
          >
            <p>
              No tenemos depósito propio ni catálogo. Compramos en el suyo lo
              que su cliente elige, y se lo revendemos con pago diferido.
            </p>
            <p className="mt-3">
              Por eso el comerciante sigue siendo su cliente: la relación
              comercial no se muda a ningún lado.
            </p>
          </FilaAlterna>

          <Revelar>
            <p className="mt-8 text-xs text-muted">
              Atendemos en {site.zona}. {site.horario}.
            </p>
          </Revelar>
        </Wrap>
      </section>

      <CTA
        titulo="Sumamos su depósito?"
        texto="Escríbanos y coordinamos una reunión para ver cómo encaja con su forma de vender."
      />
    </main>
  );
}
