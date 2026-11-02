import type { Metadata } from "next";
import Link from "next/link";
import Revelar from "@/components/Revelar";
import {
  FilaAlterna,
  PasoFoto,
  PortadaCollage,
  Rotulo,
} from "@/components/bloques";
import { btnPrimario, btnSecundario, CTA, Wrap } from "@/components/ui";
import { waLink } from "@/lib/site";

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

const PASOS = [
  {
    titulo: "Elegís vos",
    texto:
      "El producto y el proveedor los elegís vos. Trabajamos con el mayorista que ya conocés, no te imponemos uno.",
    foto: { src: "/assets/paso-1.jpg", alt: "Eligiendo la mercadería" },
  },
  {
    titulo: "Doña paga al contado",
    texto:
      "Pagamos la mercadería al proveedor en el momento. Para él es una venta al contado como cualquier otra.",
    foto: { src: "/assets/paso-2.jpg", alt: "Pago al proveedor" },
  },
  {
    titulo: "Retirás con código",
    texto:
      "Te damos un código único de retiro, de un solo uso. La compra queda registrada con factura legal.",
    foto: { src: "/assets/paso-3.jpg", alt: "Retiro con código" },
  },
  {
    titulo: "Pagás después",
    texto:
      "Tenés hasta 30 días desde la factura para pagarnos, según las condiciones que acordamos en la visita.",
    foto: { src: "/assets/paso-4.jpg", alt: "Pago posterior" },
  },
] as const;

export default function ElConceptoPage() {
  return (
    <main>
      <PortadaCollage
        rotulo="El Concepto"
        titulo={
          <>
            Doña paga hoy.{" "}
            <span className="text-terracotta-ink">Vos pagás después.</span>
          </>
        }
        bajada="Doña Compra es un servicio de compra de mercadería para comerciantes. Vos elegís qué comprar y a qué proveedor. Nosotros lo pagamos al contado y vos nos pagás en hasta 30 días."
        fotos={[
          { src: "/assets/hero-2-640.jpg", alt: "Góndola de almacén" },
          { src: "/assets/hero-1-640.jpg", alt: "Despensa de barrio" },
          { src: "/assets/hero-4-640.jpg", alt: "Comercio con stock repuesto" },
          { src: "/assets/hero-3-640.jpg", alt: "Mercadería lista para retirar" },
        ]}
        acciones={
          <>
            <Link href="/contacto" className={btnPrimario}>
              Pedir una visita
            </Link>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={btnSecundario}
            >
              Escribir por WhatsApp
            </a>
          </>
        }
      />

      <section className="bg-card">
        <Wrap>
          <FilaAlterna
            rotulo="El problema"
            titulo="Vende bien, pero compra mal."
            foto={{
              src: "/assets/hoy-entrega-1400.jpg",
              alt: "Comerciante atendiendo su local",
            }}
          >
            <p>
              El comerciante de barrio vende bien, pero compra mal. Para
              reponer stock tiene que pagar al contado, y eso le vacía la caja
              justo cuando más la necesita.
            </p>
            <p className="mt-3">
              El resultado es conocido: se compra menos de lo que se podría
              vender, se pierden las temporadas fuertes y el negocio no crece.
            </p>
          </FilaAlterna>

          <div className="mt-[clamp(32px,5vw,64px)] grid gap-4 sm:grid-cols-3">
            {PROBLEMA.map(([t, d], i) => (
              <Revelar key={t} retardo={(i + 1) as 1 | 2 | 3}>
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
            <Rotulo>La solución</Rotulo>
            <h2 className="mt-4 max-w-[20ch]">Cómo lo resolvemos.</h2>
          </Revelar>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS.map((p, i) => (
              <PasoFoto
                key={p.titulo}
                n={i + 1}
                titulo={p.titulo}
                texto={p.texto}
                foto={p.foto}
                retardo={(i + 1) as 1 | 2 | 3 | 4}
              />
            ))}
          </div>
        </Wrap>
      </section>

      <section className="bg-card">
        <Wrap>
          <Revelar>
            <Rotulo>Para que quede claro</Rotulo>
            <h2 className="mt-4 max-w-[20ch]">Qué es y qué no es.</h2>
          </Revelar>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <Revelar retardo={1}>
              <div className="h-full rounded-[var(--radius-card)] border border-ok/40 bg-card p-[clamp(18px,2.5vw,28px)]">
                <h3 className="mb-4 flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-ok/15 text-[15px] text-ok"
                  >
                    ✓
                  </span>
                  Qué es
                </h3>
                <ul className="grid gap-3 text-ink">
                  <li>Un servicio de compra de mercadería con pago diferido.</li>
                  <li>Una compra con factura legal a nombre de Doña Compra.</li>
                  <li>
                    Un acuerdo evaluado caso por caso, con visita previa al
                    negocio.
                  </li>
                </ul>
              </div>
            </Revelar>

            <Revelar retardo={2}>
              <div className="h-full rounded-[var(--radius-card)] border border-error/40 bg-card p-[clamp(18px,2.5vw,28px)]">
                <h3 className="mb-4 flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-error/12 text-[15px] text-error-ink"
                  >
                    ✕
                  </span>
                  Qué no es
                </h3>
                <ul className="grid gap-3 text-ink">
                  <li>No es un préstamo de dinero: no te damos efectivo.</li>
                  <li>No somos un banco ni una financiera.</li>
                  <li>
                    No vendemos mercadería propia: el proveedor lo elegís vos.
                  </li>
                </ul>
              </div>
            </Revelar>
          </div>

          <Revelar>
            <p className="mt-8">
              <Link href="/preguntas-frecuentes" className="font-medium text-terracotta-ink">
                Ver las preguntas frecuentes →
              </Link>
            </p>
          </Revelar>
        </Wrap>
      </section>

      <CTA
        titulo="¿Te sirve para tu negocio?"
        texto="Coordinamos una visita al local, evaluamos juntos y te explicamos las condiciones sin compromiso."
      />
    </main>
  );
}
