import Image from "next/image";
import Revelar from "@/components/Revelar";
import { Wrap } from "@/components/ui";

/**
 * Testimonios de comerciantes.
 *
 * La hoja de dirección de comunicación pone «ningún testimonio inventado»
 * entre los puntos no negociables. Así que hay dos listas separadas y una
 * sola perilla:
 *
 *   TESTIMONIOS  — los de verdad. Hoy está vacía.
 *   MUESTRA      — tres de ejemplo, para ver la forma de la sección.
 *   MOSTRAR_MUESTRA — qué lista se dibuja.
 *
 * Mientras se dibuja la muestra, la sección lleva un aviso visible que dice
 * que son textos de ejemplo. No es decoración: es lo que impide que esto
 * pase por prueba real si alguien se olvida de apagarlo.
 *
 * Para publicar los de verdad: cargar TESTIMONIOS y poner MOSTRAR_MUESTRA en
 * false. Hace falta, por cada persona, nombre y comercio, una frase dicha por
 * ella, su foto y la autorización escrita —las casillas CT01 a CT06 de la
 * guía del CRM—. Está pedido en docs/pedido-material-sitio.md.
 */

export type Testimonio = {
  nombre: string;
  comercio: string;
  frase: string;
  foto?: { src: string; alt: string };
};

/** Los de verdad. Vacía hasta que lleguen con autorización firmada. */
export const TESTIMONIOS: Testimonio[] = [];

/**
 * De ejemplo. Nombres y comercios inventados a propósito, sin foto: poner la
 * cara de una persona real al lado de una frase que no dijo es justamente lo
 * que la hoja prohíbe.
 */
export const MUESTRA: Testimonio[] = [
  {
    nombre: "Nombre de ejemplo",
    comercio: "Despensa en San Lorenzo",
    frase:
      "Antes compraba lo que me alcanzaba el día que cobraba. Ahora traigo la mercadería cuando el cliente la pide y pago después de venderla.",
  },
  {
    nombre: "Nombre de ejemplo",
    comercio: "Tienda de ropa en Luque",
    frase:
      "Me explicaron el cupo y el recargo en la visita, con la pizarra. Salí sabiendo cuánto iba a pagar, sin letra chica.",
  },
  {
    nombre: "Nombre de ejemplo",
    comercio: "Ferretería en Capiatá",
    frase:
      "Pago antes de los 25 días y me hacen un punto menos de recargo. Eso solo ya me ordenó la caja.",
  },
];

/** La perilla. En false se dibujan los de verdad (o nada, si no hay). */
export const MOSTRAR_MUESTRA = true;

export default function Testimonios({
  testimonios,
  muestra = MOSTRAR_MUESTRA,
}: {
  testimonios?: Testimonio[];
  muestra?: boolean;
}) {
  const lista = testimonios ?? (muestra ? MUESTRA : TESTIMONIOS);
  if (lista.length === 0) return null;

  const esMuestra = !testimonios && muestra;

  return (
    <section className="relative overflow-hidden bg-navy text-card">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #f5f2eb 1px, transparent 1.2px)",
          backgroundSize: "24px 24px",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-32 h-[460px] w-[460px] rounded-full bg-terracotta/25 blur-[130px]"
      />

      <Wrap className="relative">
        <Revelar>
          <div className="mx-auto max-w-[56ch] text-center">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-terracotta-soft">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-terracotta-soft"
              />
              Lo dicen ellos
              <span
                aria-hidden="true"
                className="h-px w-8 bg-terracotta-soft"
              />
            </span>
            <h2 className="mx-auto mt-4 max-w-[20ch] text-card">
              Comerciantes que ya compran así.
            </h2>
          </div>
        </Revelar>

        {esMuestra && (
          <p className="mx-auto mt-6 max-w-[62ch] rounded-[var(--radius-card)] border border-ocre/60 bg-ocre/15 px-5 py-3 text-center text-[14px] text-card">
            <strong className="font-semibold">Ejemplo.</strong> Los nombres y
            las frases son de muestra, para ver cómo queda la sección. No se
            publica así: van los comerciantes de verdad, con su autorización
            firmada.
          </p>
        )}

        <ul className="mt-10 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3">
          {lista.map((t, i) => (
            <Revelar
              as="li"
              key={`${t.nombre}-${t.comercio}-${i}`}
              retardo={((i % 3) + 1) as 1 | 2 | 3}
              className="flex"
            >
              <figure className="m-0 flex w-full flex-col rounded-[var(--radius-card)] bg-card p-[clamp(18px,2.4vw,26px)]">
                {/* Las comillas, grandes y en ocre: la referencia abre cada
                  tarjeta con una marca de cita en vez de un borde. */}
                <span
                  aria-hidden="true"
                  className="font-heading text-[44px] leading-[0.6] text-ocre"
                >
                  «
                </span>
                <blockquote className="m-0 mt-3 flex-1 text-[clamp(16px,1.9vw,18px)] leading-[1.55] text-ink">
                  {t.frase}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-navy/10 pt-5">
                  {t.foto ? (
                    <span className="relative block h-11 w-11 flex-none overflow-hidden rounded-full bg-grad-start">
                      <Image
                        src={t.foto.src}
                        alt={t.foto.alt}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid h-11 w-11 flex-none place-items-center rounded-full bg-salvia/35 font-heading text-[15px] font-semibold text-navy"
                    >
                      {t.nombre
                        .split(" ")
                        .slice(0, 2)
                        .map((p) => p[0]?.toUpperCase())
                        .join("")}
                    </span>
                  )}
                  <span className="text-[14px] text-muted">
                    <strong className="block font-semibold text-navy">
                      {t.nombre}
                    </strong>
                    {t.comercio}
                  </span>
                </figcaption>
              </figure>
            </Revelar>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}
