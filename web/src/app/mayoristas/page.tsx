import type { Metadata } from "next";
import Link from "next/link";
import { site, waLink } from "@/lib/site";
import {
  btnPrimario,
  btnSecundario,
  CardItem,
  CTA,
  Grid,
  Hero,
  Section,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Mayoristas",
  description:
    "Vendé más sin asumir riesgo de cobro: Doña Compra te paga al contado la mercadería de tus clientes comerciantes.",
};

const VENTAJAS = [
  ["Cobrás al contado", "Nosotros pagamos en el momento de la compra. Para vos es una venta de contado, sin cuenta corriente."],
  ["Sin riesgo de incobrables", "La evaluación del comerciante y el riesgo del pago a 30 días quedan de nuestro lado, no del tuyo."],
  ["Tickets más grandes", "El comerciante que no tiene que pagar al contado compra más cantidad y surtido en el mismo pedido."],
  ["Clientes que vuelven", "El comerciante sigue comprando en tu depósito: nosotros no vendemos mercadería ni competimos con vos."],
  ["Sin cambiar tu operación", "Seguís facturando y despachando como siempre. No te pedimos sistema nuevo ni integración."],
  ["Difusión en el Club", "Podés publicar ofertas y novedades para la comunidad de comerciantes que compra con nosotros."],
] as const;

const PASOS = [
  ["1 · Nos presentamos", "Coordinamos una reunión, te explicamos el servicio y acordamos cómo operar con tus clientes."],
  ["2 · El comerciante arma el pedido", "Tu cliente elige el pedido con vos, como siempre, y nos lo pasa para la compra."],
  ["3 · Pagamos y se retira", "Abonamos al contado y el comerciante retira con el código único que le entregamos."],
] as const;

export default function MayoristasPage() {
  return (
    <main>
      <Hero
        eyebrow="Para mayoristas"
        titulo="Vendé más, cobrá al contado, sin riesgo de cobranza."
        bajada="Si sos mayorista o distribuidor, Doña Compra te paga en el momento la mercadería que tus clientes comerciantes necesitan. El riesgo del pago diferido lo asumimos nosotros."
      />

      <Section tono="tarjeta">
        <h2>Por qué te conviene</h2>
        <Grid>
          {VENTAJAS.map(([t, d]) => (
            <CardItem key={t} titulo={t}>
              {d}
            </CardItem>
          ))}
        </Grid>
      </Section>

      <Section>
        <h2>Cómo trabajamos juntos</h2>
        <Grid>
          {PASOS.map(([t, d]) => (
            <CardItem key={t} titulo={t}>
              {d}
            </CardItem>
          ))}
        </Grid>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contacto" className={btnPrimario}>
            Quiero ser proveedor
          </Link>
          <a
            href={waLink(
              `Hola, Doña Compra. Soy mayorista y me interesa trabajar con ustedes.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={btnSecundario}
          >
            Escribir por WhatsApp
          </a>
        </div>
        <p className="mt-5 text-xs text-muted">
          Atendemos en {site.zona}. {site.horario}.
        </p>
      </Section>

      <CTA
        titulo="¿Sumamos a tu depósito?"
        texto="Escribinos y coordinamos una reunión para ver cómo encaja con tu forma de vender."
      />
    </main>
  );
}
