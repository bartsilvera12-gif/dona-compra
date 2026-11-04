import type { Metadata } from "next";
import Galeria from "@/components/Galeria";
import Revelar from "@/components/Revelar";
import { FilaAlterna, PortadaCompacta, Rotulo } from "@/components/bloques";
import { CTA, Wrap } from "@/components/ui";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Quiénes somos y por qué existe Doña Compra: ordenar la costumbre del fiado de barrio en una operación comercial clara.",
};

const VALORES = [
  ["Claridad", "Recargo, servicios y vencimiento se explican antes de confirmar el pedido."],
  ["Relación comercial", "Tratamos con el comerciante, no con un número de expediente."],
  ["Puntualidad", "Pagamos al proveedor al contado y esperamos la misma seriedad de vuelta."],
  ["Crecimiento progresivo", "La relación se amplía con el tiempo y con cada pedido cumplido."],
] as const;

const FOTOS = [
  {
    src: "/assets/local-despensa.jpg",
    mini: "/assets/local-despensa-640.jpg",
    alt: "Interior de una despensa de barrio: verdulería a la entrada, góndolas de almacén y la encargada en el mostrador",
    pie: "Una despensa de barrio, con la encargada en el mostrador.",
  },
  {
    src: "/assets/local-comedor.jpg",
    mini: "/assets/local-comedor-640.jpg",
    alt: "Comedor lleno al mediodía, con mesas largas, clientes almorzando y la vitrina de empanadas al fondo",
    pie: "Un comedor al mediodía, en plena hora pico.",
  },
  {
    src: "/assets/local-ropa.jpg",
    mini: "/assets/local-ropa-640.jpg",
    alt: "Tienda de ropa y artesanía con perchas, canastos y mantelería, atendiendo a una clienta",
    pie: "Una tienda de ropa y artesanía, atendiendo.",
  },
];

export default function NosotrosPage() {
  return (
    <main>
      <PortadaCompacta
        rotulo="Nosotros"
        titulo="Una forma más cercana de hacer negocios."
        bajada={
          <p>
            Doña Compra es una propuesta comercial que facilita la compra de
            mercadería a comerciantes, con operaciones claras y acompañamiento
            en cada pedido.
          </p>
        }
        fotos={[
          { src: "/assets/hero-1-640.jpg", alt: "Despensa de barrio" },
          { src: "/assets/rubro-revendedoras.jpg", alt: "Emprendedora con su pedido" },
          { src: "/assets/hero-3-640.jpg", alt: "Mercadería lista para retirar" },
        ]}
      />

      <section className="bg-card">
        <Wrap>
          <FilaAlterna
            rotulo="De dónde viene"
            titulo="Al que cumple, se le fía."
            foto={{
              src: "/assets/rubro-comedores.jpg",
              alt: "Comerciante atendiendo en su negocio",
            }}
          >
            <p>
              El comercio de barrio funciona desde siempre con una idea simple:
              al que cumple, se le fía. Doña Compra ordena esa costumbre y la
              convierte en una operación comercial clara, con factura, fechas y
              condiciones escritas.
            </p>
            <p className="mt-3">
              No reemplazamos a tu proveedor ni te vendemos un surtido armado.
              Compramos lo que vos elegís, te lo revendemos con un recargo
              conocido de antemano y acordamos cuándo lo pagás.
            </p>
            <p className="mt-3">
              Antes de abrir una ficha visitamos el negocio. Conocer cómo
              trabaja cada comerciante es parte del servicio: de ahí sale la
              confianza, no de un formulario.
            </p>
          </FilaAlterna>
        </Wrap>
      </section>

      <section>
        <Wrap>
          <Revelar>
            <Rotulo>Cómo trabajamos</Rotulo>
            <h2 className="mt-4 mb-8 max-w-[20ch]">Cuatro cosas que no negociamos.</h2>
          </Revelar>

          <div className="grid gap-4 sm:grid-cols-2">
            {VALORES.map(([t, d], i) => (
              <Revelar key={t} retardo={((i % 2) + 1) as 1 | 2}>
                <div className="flex h-full gap-4 rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(16px,2.2vw,24px)]">
                  <span
                    aria-hidden="true"
                    className="w-0.5 flex-none self-stretch rounded bg-terracotta"
                  />
                  <div>
                    <h3 className="mb-1.5">{t}</h3>
                    <p className="text-ink">{d}</p>
                  </div>
                </div>
              </Revelar>
            ))}
          </div>
        </Wrap>
      </section>

      <section className="bg-card">
        <Wrap>
          <Revelar>
            <div className="mx-auto max-w-[62ch] text-center">
              <Rotulo>
                <span className="sr-only">El historial</span>
              </Rotulo>
              <h2 className="mt-4 mb-5 text-[clamp(26px,4vw,42px)]">
                Tu palabra importa. Tus compras también.
              </h2>
              <p className="text-[clamp(16px,1.8vw,18.5px)] text-ink">
                El sistema de niveles es la forma de registrar esa historia:
                cada pedido cumplido queda anotado y suma al historial comercial
                que compartimos con vos.
              </p>
              <p className="mt-6 text-xs leading-relaxed text-muted">
                El historial comercial no constituye una garantía legal ni
                implica la aprobación automática de nuevas operaciones.
              </p>
            </div>
          </Revelar>
        </Wrap>
      </section>

      <section>
        <Wrap>
          <Revelar>
            <Rotulo>En los comercios</Rotulo>
            <h2 className="mt-4 mb-3 max-w-[22ch]">
              Dónde trabajamos, en imágenes.
            </h2>
            <p className="mb-9 max-w-[58ch] text-ink">
              La despensa de la esquina, el comedor al mediodía, la tienda de
              ropa. Estos son los negocios con los que trabajamos todas las
              semanas.
            </p>
          </Revelar>

          <Revelar>
            <Galeria fotos={FOTOS} />
          </Revelar>
        </Wrap>
      </section>

      <CTA
        titulo="La mejor forma de conocernos es conversando"
        texto="Coordinamos una visita a tu negocio, sin costo y sin compromiso."
      />
    </main>
  );
}
