import type { Metadata } from "next";
import Link from "next/link";
import Calculadora from "@/components/Calculadora";
import Revelar from "@/components/Revelar";
import { Cifra, PortadaCompacta, Rotulo } from "@/components/bloques";
import { Aviso, CTA, Nota, Wrap } from "@/components/ui";
import { precioGs } from "@/lib/formato";
import {
  analisisAcumulado,
  NIVELES,
  NIVELES_DE_ENTRADA,
  NOMBRE_SERVICIO,
  PAGADOR_RAPIDO_DIAS,
  PAGADOR_RAPIDO_PEDIDOS,
  PLAZO_DIAS,
  totalServicios,
  type Servicios,
} from "@/lib/niveles";

/* Todas las cifras de esta página salen de src/lib/niveles.ts, que a su vez
   copia las Condiciones Generales de Servicio y de Venta de noviembre 2026.
   No escribir un número a mano acá: si cambia la tarifa, tiene que cambiar en
   un solo lugar. */

export const metadata: Metadata = {
  title: "Niveles y tarifas",
  description:
    "De Hierro a Diamante: cupos de compra, recargo comercial del 18 % al 12 % según el nivel y las tarifas de los cinco Servicios Doña Compra. Calculá el precio final de tu pedido.",
};

const CLAVES = Object.keys(NOMBRE_SERVICIO) as (keyof Servicios)[];
const pct = (t: number) => `${(t * 100).toFixed(0)} %`;

const primero = NIVELES[0];
const ultimo = NIVELES[NIVELES.length - 1];

export default function NivelesPage() {
  return (
    <main>
      <PortadaCompacta
        rotulo="Niveles y tarifas"
        titulo="Lo que pagás, sin sorpresas."
        bajada={
          <>
            <p>
              El precio final son tres cosas: el costo de la mercadería en tu
              mayorista, el recargo comercial de tu nivel y la tarifa fija de
              los cinco Servicios Doña Compra. Nada más.
            </p>
            <p className="mt-3">
              El recargo baja a medida que subís de nivel: del{" "}
              {pct(primero.recargo)} en {primero.nombre} al{" "}
              {pct(ultimo.recargo)} en {ultimo.nombre}. Cumplir sale más
              barato, y esa es toda la idea.
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
              valor={`${(ultimo.recargo * 100).toFixed(0)}–${(primero.recargo * 100).toFixed(0)}`}
              unidad="%"
              texto="Recargo comercial sobre el costo mayorista, según tu nivel."
            />
            <Cifra
              valor="7"
              unidad="niveles"
              texto="De Hierro a Diamante. Se sube de a uno, por evaluación."
              retardo={1}
            />
            <Cifra
              valor={String(PLAZO_DIAS)}
              unidad="días"
              texto="Para pagar, desde el retiro efectivo en el mayorista."
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
              mayorista. Te mostramos cómo se arma el total.
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
            <h2 className="mt-4 mb-3 max-w-[24ch]">
              Cuanto más alto el nivel, menor el recargo.
            </h2>
            <p className="mb-8 max-w-[64ch] text-ink">
              El cupo es el máximo de mercadería que se puede comprar para vos
              al mismo tiempo. Podés tener varios pedidos abiertos, incluso con
              distintos mayoristas, mientras la suma de lo comprometido y todavía
              impago no pase ese cupo.
            </p>
          </Revelar>

          <Revelar retardo={1}>
            <div className="overflow-x-auto rounded-[var(--radius-card)] border border-navy/12 bg-card">
              <table className="w-full min-w-[640px] text-left text-[14.5px]">
                <caption className="sr-only">
                  Recargo comercial, cupo de compras, pedido mínimo y total de
                  los cinco Servicios Doña Compra, por nivel
                </caption>
                <thead className="border-b border-navy/12 text-[11px] uppercase tracking-[0.1em] text-muted">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 font-medium">Nivel</th>
                    <th scope="col" className="px-5 py-3.5 text-right font-medium">
                      Recargo
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right font-medium">
                      Cupo de compras
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right font-medium">
                      Pedido mínimo
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right font-medium">
                      Servicios por pedido
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {NIVELES.map((n) => (
                    <tr key={n.nombre} className="border-b border-navy/8 last:border-0">
                      <th scope="row" className="px-5 py-3.5 font-heading font-semibold text-navy">
                        {n.nombre}
                      </th>
                      <td className="px-5 py-3.5 text-right font-mono text-terracotta-ink">
                        {pct(n.recargo)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-ink">
                        {precioGs(n.tope)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-ink">
                        {precioGs(n.minimo)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-ink">
                        {precioGs(totalServicios(n.servicios))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Revelar>

          <Revelar>
            <Nota>
              El recargo se aplica sobre el costo mayorista de la cotización, no
              sobre el precio al que después vendés. Ojo con no confundir dos cosas:
              el cupo es lo que podés tener comprometido a la vez, mientras que
              para pedir el ascenso hay que superar el acumulado de compras
              previsto para tu nivel. Y superarlo tampoco alcanza: el ascenso es
              de a un nivel y necesita además los pedidos cancelados en plazo,
              una solicitud, un nuevo Análisis y la decisión de la dirección.
            </Nota>
          </Revelar>
        </Wrap>
      </section>

      <section className="bg-card">
        <Wrap>
          <Revelar>
            <Rotulo>Los cinco servicios</Rotulo>
            <h2 className="mt-4 mb-3 max-w-[24ch]">
              Qué se factura además de la mercadería.
            </h2>
            <p className="mb-8 max-w-[62ch] text-ink">
              Son cinco prestaciones con tarifa fija por pedido. Dos cuestan
              igual en todos los niveles; las otras tres acompañan al nivel.
            </p>
          </Revelar>

          <Revelar retardo={1}>
            <div className="overflow-x-auto rounded-[var(--radius-card)] border border-navy/12 bg-card">
              <table className="w-full min-w-[760px] text-left text-[14px]">
                <caption className="sr-only">
                  Tarifa fija de cada uno de los cinco Servicios Doña Compra,
                  por pedido y por nivel
                </caption>
                <thead className="border-b border-navy/12 text-[11px] uppercase tracking-[0.1em] text-muted">
                  <tr>
                    <th scope="col" className="px-4 py-3.5 font-medium">Servicio</th>
                    {NIVELES.map((n) => (
                      <th
                        key={n.nombre}
                        scope="col"
                        className="px-4 py-3.5 text-right font-medium"
                      >
                        {n.nombre}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CLAVES.map((c) => (
                    <tr key={c} className="border-b border-navy/8">
                      <th scope="row" className="px-4 py-3 font-normal text-ink">
                        {NOMBRE_SERVICIO[c]}
                      </th>
                      {NIVELES.map((n) => (
                        <td
                          key={n.nombre}
                          className="px-4 py-3 text-right font-mono text-ink"
                        >
                          {n.servicios[c] === 0
                            ? "—"
                            : precioGs(n.servicios[c])}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" className="px-4 py-3.5 font-heading font-semibold text-navy">
                      Total por pedido
                    </th>
                    {NIVELES.map((n) => (
                      <td
                        key={n.nombre}
                        className="px-4 py-3.5 text-right font-mono font-semibold text-terracotta-ink"
                      >
                        {precioGs(totalServicios(n.servicios))}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Revelar>
        </Wrap>
      </section>

      <section id="pagador-rapido" className="scroll-mt-24">
        <Wrap>
          <Revelar>
            <Rotulo>Pagador Rápido</Rotulo>
            <h2 className="mt-4 mb-3 max-w-[22ch]">
              Pagar antes te baja el recargo.
            </h2>
            <div className="max-w-[64ch] text-ink">
              <p>
                Con al menos {PAGADOR_RAPIDO_PEDIDOS} pedidos pagados por
                completo y un plazo promedio de pago menor a{" "}
                {PAGADOR_RAPIDO_DIAS} días desde el retiro, obtenés el estatus
                Pagador Rápido: un punto porcentual menos de recargo sobre la
                mercadería. En Bronce, por ejemplo, pasás del 16 % al 15 %.
              </p>
              <p className="mt-3">
                Vale en todos los niveles, de Hierro a Diamante. Viene además
                con una insignia, un autoadhesivo con QR para tu local y el
                acceso al Club Doña Compra para vos y para tus clientes.
              </p>
            </div>
          </Revelar>

          <Revelar retardo={1}>
            <div className="mt-8">
              <Aviso titulo="Tres cosas que conviene saber">
                La rebaja alcanza solo al recargo sobre la mercadería: los cinco
                servicios se siguen facturando igual. No es retroactiva, se
                aplica a los pedidos posteriores al reconocimiento. Y el estatus
                se revisa cada tanto y se pierde apenas hay un atraso.
              </Aviso>
            </div>
          </Revelar>
        </Wrap>
      </section>

      <section className="bg-card">
        <Wrap>
          <Revelar>
            <Rotulo>Entrar a la red</Rotulo>
            <h2 className="mt-4 mb-3 max-w-[24ch]">
              El Análisis de ingreso, nivel por nivel.
            </h2>
            <p className="mb-8 max-w-[64ch] text-ink">
              La Solicitud de Entrada es gratuita. Si tu solicitud puede
              avanzar, recién ahí se te informa el costo del Análisis. Para
              entrar directo a un nivel intermedio se pagan también los de los
              niveles anteriores: son acumulativos.
            </p>
          </Revelar>

          <Revelar retardo={1}>
            <div className="overflow-x-auto rounded-[var(--radius-card)] border border-navy/12 bg-card">
              <table className="w-full min-w-[520px] text-left text-[14.5px]">
                <caption className="sr-only">
                  Precio del Análisis de cada nivel y total acumulado para
                  entrar directo
                </caption>
                <thead className="border-b border-navy/12 text-[11px] uppercase tracking-[0.1em] text-muted">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 font-medium">Nivel</th>
                    <th scope="col" className="px-5 py-3.5 text-right font-medium">
                      Análisis del nivel
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right font-medium">
                      Total en entrada directa
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {NIVELES_DE_ENTRADA.map((n) => (
                    <tr key={n.nombre} className="border-b border-navy/8 last:border-0">
                      <th scope="row" className="px-5 py-3.5 font-heading font-semibold text-navy">
                        {n.nombre}
                      </th>
                      <td className="px-5 py-3.5 text-right font-mono text-ink">
                        {precioGs(n.analisis ?? 0)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-terracotta-ink">
                        {precioGs(analisisAcumulado(n) ?? 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Revelar>

          <Revelar>
            <Nota>
              A Rubis y Diamante no se entra directo: se llega solo por ascenso.
              El total se te informa antes de que te comprometas a nada. Un
              Análisis pagado no garantiza la admisión y no se devuelve si la
              decisión es negativa. Si te admiten, recibís un crédito comercial
              equivalente al 50 % del Análisis del nivel otorgado, en tres
              tramos aplicables a las primeras compras de los niveles superiores
              que alcances, y que vence al año.
            </Nota>
          </Revelar>
        </Wrap>
      </section>

      <section>
        <Wrap>
          <Revelar>
            <Rotulo>Si algo se complica</Rotulo>
            <h2 className="mt-4 mb-3 max-w-[22ch]">Sin multas ni intereses.</h2>
            <div className="max-w-[66ch] text-ink">
              <p>
                No aplicamos multas ni intereses por atraso. Lo que sí pasa es
                que, al día siguiente del vencimiento, las compras nuevas quedan
                suspendidas hasta que se regularice; el desbloqueo lo revisa la
                dirección caso por caso.
              </p>
              <p className="mt-3">
                Si hiciera falta una gestión de cobranza o un pagaré, pueden
                refacturarse los gastos realmente realizados y comprobados, sin
                recargo adicional.
              </p>
              <p className="mt-3">
                Después de tres meses sin ningún pedido, el estatus de miembro
                termina, con aviso 30 y 7 días antes.
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
        titulo="Querés saber tu nivel?"
        texto="Se define en la visita, mirando tu negocio. Coordinamos una sin compromiso."
      />
    </main>
  );
}
