import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardItem,
  CTA,
  Grid,
  Hero,
  Section,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "El Concepto",
  description:
    "Doña Compra paga tu mercadería al contado al proveedor que vos elegís, y vos pagás en hasta 30 días según las condiciones acordadas.",
};

const PROBLEMA = [
  [
    "Sin la mercadería que necesitás",
    "Comprás de a poco porque la caja no da para más, y te quedás sin los talles o los productos que te piden.",
  ],
  [
    "Las temporadas se pierden",
    "Escolar, Día de la Madre, fin de año: son las compras que más rinden y las que más capital exigen de golpe.",
  ],
  [
    "El crédito formal no llega",
    "Muchos comercios chicos no califican para un crédito bancario, o el trámite tarda más de lo que dura la oportunidad.",
  ],
] as const;

const SOLUCION = [
  ["1 · Elegís vos", "El producto y el proveedor los elegís vos. Trabajamos con el mayorista que ya conocés, no te imponemos uno."],
  ["2 · Doña paga al contado", "Pagamos la mercadería al proveedor en el momento. Para él es una venta al contado como cualquier otra."],
  ["3 · Retirás con código", "Te damos un código único de retiro, de un solo uso. La compra queda registrada con factura legal."],
  ["4 · Pagás después", "Tenés hasta 30 días desde la factura para pagarnos, según las condiciones que acordamos en la visita."],
] as const;

export default function ElConceptoPage() {
  return (
    <main>
      <Hero
        eyebrow="El Concepto"
        titulo="Doña paga hoy. Vos pagás después."
        bajada="Doña Compra es un servicio de compra de mercadería para comerciantes. Vos elegís qué comprar y a qué proveedor. Nosotros lo pagamos al contado y vos nos pagás en hasta 30 días, según las condiciones acordadas."
      />

      <Section tono="tarjeta">
        <h2>El problema que resuelve</h2>
        <p className="mt-4 max-w-[62ch] text-ink">
          El comerciante de barrio vende bien, pero compra mal. Para reponer
          stock tiene que pagar al contado, y eso le vacía la caja justo cuando
          más la necesita. El resultado es conocido: se compra menos de lo que
          se podría vender, se pierden las temporadas fuertes y el negocio no
          crece.
        </p>
        <Grid>
          {PROBLEMA.map(([t, d]) => (
            <CardItem key={t} titulo={t}>
              {d}
            </CardItem>
          ))}
        </Grid>
      </Section>

      <Section>
        <h2>Cómo lo resolvemos</h2>
        <Grid>
          {SOLUCION.map(([t, d]) => (
            <CardItem key={t} titulo={t}>
              {d}
            </CardItem>
          ))}
        </Grid>
        <p className="mt-7">
          <Link href="/comerciante" className="font-medium text-terracotta-ink">
            Ver qué necesitás para empezar →
          </Link>
        </p>
      </Section>

      <Section tono="tarjeta">
        <h2>Qué es y qué no es</h2>
        <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
          <Card className="border-ok/35">
            <h3 className="mb-3">Qué es</h3>
            <ul className="m-0 list-disc pl-5 leading-relaxed text-ink">
              <li>Un servicio de compra de mercadería con pago diferido.</li>
              <li>Una compra con factura legal a nombre de Doña Compra.</li>
              <li>
                Un acuerdo evaluado caso por caso, con visita previa al negocio.
              </li>
            </ul>
          </Card>
          <Card className="border-error/35">
            <h3 className="mb-3">Qué no es</h3>
            <ul className="m-0 list-disc pl-5 leading-relaxed text-ink">
              <li>No es un préstamo de dinero: no te damos efectivo.</li>
              <li>No somos un banco ni una financiera.</li>
              <li>No vendemos mercadería propia: el proveedor lo elegís vos.</li>
            </ul>
          </Card>
        </div>
      </Section>

      <CTA
        titulo="¿Te sirve para tu negocio?"
        texto="Coordinamos una visita al local, evaluamos juntos y te explicamos las condiciones sin compromiso."
      />
    </main>
  );
}
