import type { Metadata } from "next";
import Link from "next/link";
import Revelar from "@/components/Revelar";
import {
  Cifra,
  MosaicoRubros,
  PasoFoto,
  PortadaFoto,
  Rotulo,
} from "@/components/bloques";
import { btnPrimario, btnSecundario, CTA, Nota, Wrap } from "@/components/ui";

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
  ["Crecés de nivel", "A medida que cumplís, subís de nivel y tu tope de compra aumenta. El margen sigue siendo del 12 %."],
] as const;

const REQUISITOS = [
  {
    titulo: "Un negocio en funcionamiento",
    texto: "Local, puesto o emprendimiento que ya esté vendiendo en Gran Asunción.",
    foto: { src: "/assets/rubro-despensas.jpg", alt: "Despensa de barrio en actividad" },
  },
  {
    titulo: "Documento de identidad",
    texto: "Cédula vigente de la persona que va a quedar como responsable de la compra.",
    foto: { src: "/assets/paso-1.jpg", alt: "Documentación para la solicitud" },
  },
  {
    titulo: "Una visita al local",
    texto: "Pasamos por el negocio, conversamos y definimos tu nivel inicial y tu tope de compra.",
    foto: { src: "/assets/paso-2.jpg", alt: "Visita comercial al negocio" },
  },
] as const;

const RUBROS = [
  { slug: "ropa", nombre: "Ropa" },
  { slug: "calzado", nombre: "Calzado" },
  { slug: "bijouterie", nombre: "Bijouterie" },
  { slug: "cosmeticos", nombre: "Cosméticos" },
  { slug: "perfumes", nombre: "Perfumes" },
  { slug: "peluquerias", nombre: "Peluquerías" },
  { slug: "regaleria", nombre: "Regalería" },
  { slug: "libreria", nombre: "Librería y útiles" },
  { slug: "revendedoras", nombre: "Revendedoras" },
  { slug: "despensas", nombre: "Despensas" },
  { slug: "comedores", nombre: "Comedores" },
  { slug: "restaurantes", nombre: "Restaurantes" },
] as const;

export default function ComerciantePage() {
  return (
    <main>
      <PortadaFoto
        rotulo="Para comerciantes"
        titulo="Comprá el stock que necesitás, no el que te permite la caja."
        bajada="Si tenés un negocio en Gran Asunción y comprás mercadería para revender, Doña Compra te permite reponer hoy y pagar después de vender."
        foto={{
          src: "/assets/hoy-entrega-1400.jpg",
          alt: "Comerciante recibiendo mercadería en su local",
        }}
        acciones={
          <>
            <Link href="/contacto" className={btnPrimario}>
              Pedir una visita
            </Link>
            <Link href="/preguntas-frecuentes" className={btnSecundario}>
              Preguntas frecuentes
            </Link>
          </>
        }
      />

      <section>
        <Wrap>
          <div className="grid gap-[clamp(24px,3vw,40px)] sm:grid-cols-3">
            <Cifra
              valor="100"
              unidad="mil Gs."
              texto="Pedido mínimo en nivel Hierro, expresado en precio de compra."
            />
            <Cifra
              valor="7"
              unidad="niveles"
              texto="De Hierro a Diamante. El tope de compra sube con tu historial."
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
            <Rotulo>Lo que cambia</Rotulo>
            <h2 className="mt-4 max-w-[22ch]">
              Qué pasa en tu negocio cuando no pagás al contado.
            </h2>
          </Revelar>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFICIOS.map(([t, d], i) => (
              <Revelar key={t} retardo={((i % 3) + 1) as 1 | 2 | 3}>
                <div className="h-full rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(16px,2.2vw,24px)]">
                  <h3 className="mb-2">{t}</h3>
                  <p className="text-ink">{d}</p>
                </div>
              </Revelar>
            ))}
          </div>

          <Revelar>
            <p className="mt-7">
              <Link href="/el-concepto" className="font-medium text-terracotta-ink">
                Cómo funciona paso a paso →
              </Link>
            </p>
          </Revelar>
        </Wrap>
      </section>

      <section>
        <Wrap>
          <Revelar>
            <Rotulo>Para empezar</Rotulo>
            <h2 className="mt-4 max-w-[20ch]">Tres cosas y una visita.</h2>
          </Revelar>

          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {REQUISITOS.map((r, i) => (
              <PasoFoto
                key={r.titulo}
                n={i + 1}
                titulo={r.titulo}
                texto={r.texto}
                foto={r.foto}
                retardo={(i + 1) as 1 | 2 | 3}
              />
            ))}
          </div>

          <Revelar>
            <Nota>
              Toda solicitud queda sujeta a evaluación previa. El nivel
              inicial, el tope de compra y las condiciones de pago se definen
              en la visita y constan en el acuerdo firmado. El pedido mínimo
              pasa a Gs. 150.000 desde el nivel Cobre.
            </Nota>
          </Revelar>
        </Wrap>
      </section>

      <section className="bg-card">
        <Wrap>
          <Revelar>
            <Rotulo>Rubros</Rotulo>
            <h2 className="mt-4 max-w-[22ch]">¿Tu rubro está acá?</h2>
            <p className="mt-4 max-w-[56ch] text-ink">
              Estos son los que más trabajan con nosotros. Si el tuyo no está
              pero vendés al público y reponés con un mayorista, escribinos
              igual.
            </p>
          </Revelar>

          <div className="mt-9">
            <MosaicoRubros rubros={[...RUBROS]} />
          </div>
        </Wrap>
      </section>

      <CTA
        titulo="Empezá con una visita"
        texto="Sin costo y sin compromiso. Conversamos en tu local y te explicamos las condiciones."
      />
    </main>
  );
}
