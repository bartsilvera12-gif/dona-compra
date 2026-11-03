import type { Metadata } from "next";
import Link from "next/link";
import Calculadora from "@/components/Calculadora";
import Revelar from "@/components/Revelar";
import { Cifra, PortadaCompacta, Rotulo } from "@/components/bloques";
import { CTA, Wrap } from "@/components/ui";
import { precioGs } from "@/lib/formato";
import { NIVELES } from "@/lib/niveles";

export const metadata: Metadata = {
  title: "Niveles y tarifas",
  description:
    "De Hierro a Diamante: topes de compra, Pack Doña Compra y margen comercial del 12 %. Calculá el precio final de tu pedido.",
};

export default function NivelesPage() {
  return (
    <main>
      <PortadaCompacta
        rotulo="Niveles y tarifas"
        titulo="Lo que pagás, sin sorpresas."
        bajada={
          <>
            <p>
              El precio final son tres cosas: la mercadería, el margen
              comercial del 12 % y los servicios fijos de tu nivel. Nada más.
            </p>
            <p className="mt-3">
              El nivel define tu tope de compra y el Pack. El margen no cambia
              nunca.
            </p>
          </>
        }
        fotos={[
          { src: "/assets/rubro-despensas.jpg", alt: "Góndola de despensa" },
          { src: "/assets/paso-4.jpg", alt: "Pago posterior a la venta" },
          { src: "/assets/rubro-libreria.jpg", alt: "Stock de librería" },
        ]}
      />

      <section>
        <Wrap>
          <div className="grid gap-[clamp(24px,3vw,40px)] sm:grid-cols-3">
            <Cifra
              valor="12"
              unidad="%"
              texto="Margen comercial, idéntico en los siete niveles."
            />
            <Cifra
              valor="7"
              unidad="niveles"
              texto="De Hierro a Diamante. Se sube de a uno, por evaluación."
              retardo={1}
            />
            <Cifra
              valor="0"
              texto="Multas e intereses por atraso. Si hay un problema, se conversa."
              retardo={2}
            />
          </div>
        </Wrap>
      </section>

      <section className="bg-card">
        <Wrap>
          <Revelar>
            <Rotulo>Calculadora</Rotulo>
            <h2 className="mt-4 mb-3 max-w-[22ch]">
              Probá con el monto que comprarías.
            </h2>
            <p className="mb-9 max-w-[56ch] text-ink">
              Elegí tu nivel y poné cuánto cuesta la mercadería en tu
              proveedor. Te mostramos cómo se arma el total.
            </p>
          </Revelar>

          <Revelar retardo={1}>
            <Calculadora />
          </Revelar>
        </Wrap>
      </section>

      <section>
        <Wrap>
          <Revelar>
            <Rotulo>Los siete niveles</Rotulo>
            <h2 className="mt-4 mb-3 max-w-[22ch]">
              El tope sube con tu historial.
            </h2>
            <p className="mb-8 max-w-[62ch] text-ink">
              Cada nivel tiene un tope de compras acumuladas. Al ingresar a un
              nivel, el contador vuelve a cero. Superar el tope habilita una
              evaluación: el ascenso es de a un nivel y lo decide Doña Compra.
            </p>
          </Revelar>

          <Revelar retardo={1}>
            <div className="overflow-x-auto rounded-[var(--radius-card)] border border-navy/12 bg-card">
              <table className="w-full min-w-[620px] text-left text-[14.5px]">
                <caption className="sr-only">
                  Topes, pedido mínimo y Pack Doña Compra por nivel
                </caption>
                <thead className="border-b border-navy/12 text-[11px] uppercase tracking-[0.1em] text-muted">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 font-medium">Nivel</th>
                    <th scope="col" className="px-5 py-3.5 text-right font-medium">
                      Tope acumulado
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right font-medium">
                      Pedido mínimo
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right font-medium">
                      Pack por pedido
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {NIVELES.map((n) => (
                    <tr key={n.nombre} className="border-b border-navy/8 last:border-0">
                      <th scope="row" className="px-5 py-3.5 font-heading font-semibold text-navy">
                        {n.nombre}
                      </th>
                      <td className="px-5 py-3.5 text-right font-mono text-ink">
                        {precioGs(n.tope)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-ink">
                        {precioGs(n.minimo)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-terracotta-ink">
                        {precioGs(n.pack)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Revelar>

          <Revelar>
            <p className="mt-5 max-w-[74ch] text-xs leading-relaxed text-muted">
              El seguro (Gs. 4.000) y el análisis (Gs. 3.000) son fijos por
              pedido y no cambian con el nivel. El Pack Doña Compra reúne
              publicidad, seguimiento, negociaciones y el Club Doña Compra.
            </p>
          </Revelar>
        </Wrap>
      </section>

      <section className="bg-card">
        <Wrap>
          <Revelar>
            <Rotulo>Si algo se complica</Rotulo>
            <h2 className="mt-4 mb-3 max-w-[22ch]">Sin multas ni intereses.</h2>
            <div className="max-w-[66ch] text-ink">
              <p>
                No aplicamos multas ni intereses por atraso. Si no llegás a la
                fecha, se conversa y se acomoda la situación.
              </p>
              <p className="mt-3">
                Si hiciera falta una gestión de cobranza o un pagaré, pueden
                refacturarse los gastos realmente realizados y comprobados, sin
                margen adicional.
              </p>
            </div>
            <p className="mt-6">
              <Link href="/preguntas-frecuentes" className="font-medium text-terracotta-ink">
                Ver todas las preguntas frecuentes →
              </Link>
            </p>
          </Revelar>
        </Wrap>
      </section>

      <CTA
        titulo="¿Querés saber tu nivel?"
        texto="Se define en la visita, mirando tu negocio. Coordinamos una sin compromiso."
      />
    </main>
  );
}
