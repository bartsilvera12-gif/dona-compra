import type { Metadata } from "next";
import Link from "next/link";
import {
  btnPrimario,
  btnSecundario,
  CardItem,
  CTA,
  Grid,
  Hero,
  Nota,
  Paso,
  Section,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Comerciantes",
  description:
    "Comprá stock sin frenar la caja de tu negocio. Visita al local, evaluación y compra con pago a 30 días en Gran Asunción.",
};

const BENEFICIOS = [
  ["Comprás la cantidad correcta", "Podés traer la curva de talles completa o el surtido entero, en vez de recortarlo por falta de efectivo."],
  ["La caja sigue trabajando", "El dinero del día queda en el negocio para gastos, sueldos y servicios, no inmovilizado en el depósito."],
  ["Llegás a las temporadas", "Escolar, Día de la Madre y fin de año se compran con tiempo y se pagan con lo que esas mismas ventas generan."],
  ["Tu proveedor de siempre", "No cambiás de mayorista ni de condiciones comerciales. Seguís comprando donde ya tenés confianza."],
  ["Todo con factura", "Cada compra se documenta con factura legal, lo que te ordena el costo de mercadería del mes."],
] as const;

export default function ComerciantePage() {
  return (
    <main>
      <Hero
        eyebrow="Para comerciantes"
        titulo="Comprá el stock que necesitás, no el que te permite la caja."
        bajada="Si tenés un negocio en Gran Asunción y comprás mercadería para revender, Doña Compra te permite reponer hoy y pagar después de vender."
      />

      <Section tono="tarjeta">
        <h2>Lo que cambia en tu negocio</h2>
        <Grid>
          {BENEFICIOS.map(([t, d]) => (
            <CardItem key={t} titulo={t}>
              {d}
            </CardItem>
          ))}
          <CardItem titulo="Crecés de nivel">
            A medida que cumplís, subís de nivel y tu tope de compra aumenta.
            El margen comercial sigue siendo del 12 % en los siete niveles; lo
            que cambia es el Pack Doña Compra.
          </CardItem>
        </Grid>
      </Section>

      <Section>
        <h2>Qué necesitás para empezar</h2>
        <div className="mt-6 grid max-w-[70ch] gap-3">
          <Paso n={1} titulo="Un negocio en funcionamiento">
            Local, puesto o emprendimiento que ya esté vendiendo en Gran
            Asunción.
          </Paso>
          <Paso n={2} titulo="Documento de identidad">
            Cédula vigente de la persona que va a quedar como responsable de la
            compra.
          </Paso>
          <Paso n={3} titulo="Una visita al local">
            Pasamos por el negocio, conversamos y definimos tu nivel inicial y
            tu tope de compra.
          </Paso>
        </div>

        <Nota>
          Toda solicitud queda sujeta a evaluación previa. El nivel inicial, el
          tope de compra y las condiciones de pago se definen en la visita y
          constan en el acuerdo firmado. El pedido mínimo es de Gs. 100.000 en
          nivel Hierro y Gs. 150.000 desde nivel Cobre, expresados en precio de
          compra.
        </Nota>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/contacto" className={btnPrimario}>
            Pedir una visita
          </Link>
          <Link href="/preguntas-frecuentes" className={btnSecundario}>
            Ver preguntas frecuentes
          </Link>
        </div>
      </Section>

      <CTA
        titulo="Empezá con una visita"
        texto="Sin costo y sin compromiso. Conversamos en tu local y te explicamos las condiciones."
      />
    </main>
  );
}
