import type { Metadata } from "next";
import Link from "next/link";
import Revelar from "@/components/Revelar";
import {
  FilaAlterna,
  MosaicoRubros,
  PasoFoto,
  PortadaCompacta,
  Rotulo,
} from "@/components/bloques";
import { btnPrimario, btnSecundario, CTA, Wrap } from "@/components/ui";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "El Club Doña Compra",
  description:
    "El espacio publicitario de las marcas que acompañan a Doña Compra: presencia ante los comercios de barrio de Gran Asunción y sus clientes.",
};

/* El Club es el espacio de las MARCAS que acompañan a Doña Compra, no un área
   de socios para comerciantes. En Servicios, el Pack lo describe como el
   componente «destinado a crear beneficios para los clientes de los
   comerciantes»: son las marcas las que aportan esos beneficios. */

const PARA_MARCAS = [
  [
    "Llegás al comercio de barrio",
    "La despensa, la tienda de ropa, la perfumería. Los puntos de venta donde la gente compra todas las semanas y donde una marca se elige de verdad.",
  ],
  [
    "Presencia donde se decide",
    "Tu marca aparece en el mostrador y en el pedido, no en un aviso que alguien saltea. Es el momento en que el comerciante repone y el cliente elige.",
  ],
  [
    "Una red que ya está armada",
    "No hay que construir el vínculo con cada comercio: ya trabajamos con ellos pedido a pedido, y el Club se apoya en esa relación.",
  ],
] as const;

const COMO = [
  {
    titulo: "Conversamos",
    texto:
      "Nos contás qué querés lograr y a qué rubros apuntás. De ahí sale qué tiene sentido hacer y qué no.",
    foto: { src: "/assets/paso-2.jpg", alt: "Reunión con una marca" },
  },
  {
    titulo: "Armamos la acción",
    texto:
      "Definimos en qué consiste la presencia de tu marca, en qué comercios y por cuánto tiempo, y queda por escrito.",
    foto: { src: "/assets/paso-1.jpg", alt: "Planificación de la acción" },
  },
  {
    titulo: "Sale a la calle",
    texto:
      "La acción llega a los comercios y a la página de anuncios, y te contamos cómo fue con lo que efectivamente pasó.",
    foto: { src: "/assets/paso-3.jpg", alt: "La acción en el punto de venta" },
  },
] as const;

const RUBROS = [
  { slug: "despensas", nombre: "Despensas" },
  { slug: "ropa", nombre: "Ropa" },
  { slug: "cosmeticos", nombre: "Cosméticos" },
  { slug: "perfumes", nombre: "Perfumes" },
  { slug: "libreria", nombre: "Librería" },
  { slug: "peluquerias", nombre: "Peluquerías" },
  { slug: "regaleria", nombre: "Regalería" },
  { slug: "calzado", nombre: "Calzado" },
] as const;

export default function ClubPage() {
  return (
    <main>
      <PortadaCompacta
        rotulo="El Club Doña Compra"
        titulo="El espacio de las marcas que nos acompañan."
        bajada={
          <>
            <p>
              El Club es donde las marcas que caminan con nosotros se hacen
              presentes ante los comercios de barrio de Gran Asunción y la
              gente que les compra.
            </p>
            <p className="mt-3">
              No es publicidad suelta: es presencia en los mismos comercios con
              los que trabajamos pedido a pedido.
            </p>
          </>
        }
        fotos={[
          { src: "/assets/rubro-despensas.jpg", alt: "Góndola de una despensa de barrio" },
          { src: "/assets/rubro-cosmeticos.jpg", alt: "Exhibidor de cosmética" },
          { src: "/assets/rubro-regaleria.jpg", alt: "Local de regalería" },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/contacto" className={btnPrimario}>
            Quiero acompañar
          </Link>
          <a
            href={waLink(
              "Hola, Doña Compra. Represento a una marca y me interesa el Club.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={btnSecundario}
          >
            Escribir por WhatsApp
          </a>
        </div>
      </PortadaCompacta>

      <section className="bg-card">
        <Wrap>
          <Revelar>
            <Rotulo>Para marcas</Rotulo>
            <h2 className="mt-4 mb-3 max-w-[22ch]">
              Por qué acompañar a Doña Compra.
            </h2>
          </Revelar>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {PARA_MARCAS.map(([t, d], i) => (
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
            <Rotulo>Dónde llega</Rotulo>
            <h2 className="mt-4 mb-3 max-w-[24ch]">
              Los rubros con los que trabajamos.
            </h2>
            <p className="mb-8 max-w-[58ch] text-ink">
              Comercios de Gran Asunción que reponen mercadería con nosotros.
              Según qué venda tu marca, tiene sentido en unos y no en otros, y
              eso lo definimos juntos.
            </p>
          </Revelar>

          <MosaicoRubros rubros={[...RUBROS]} />
        </Wrap>
      </section>

      <section className="bg-card">
        <Wrap>
          <Revelar>
            <Rotulo>Cómo se arma</Rotulo>
            <h2 className="mt-4 mb-3 max-w-[20ch]">Tres pasos, sin paquetes cerrados.</h2>
            <p className="mb-9 max-w-[58ch] text-ink">
              No vendemos un plan de la góndola. Cada acción se arma según lo
              que la marca quiere lograr.
            </p>
          </Revelar>

          <div className="grid gap-4 sm:grid-cols-3">
            {COMO.map((p, i) => (
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

          <Revelar>
            <p className="mt-6 max-w-[74ch] text-xs leading-relaxed text-muted">
              Las condiciones, los importes y el alcance de cada acción se
              acuerdan caso por caso y constan por escrito. No publicamos
              tarifas ni cifras de alcance que todavía no estén medidas.
            </p>
          </Revelar>
        </Wrap>
      </section>

      <section>
        <Wrap>
          <FilaAlterna
            rotulo="Y para el comerciante"
            titulo="Qué significa el Club de este lado."
            invertida
            foto={{
              src: "/assets/rubro-ropa.jpg",
              alt: "Comerciante atendiendo en su local",
            }}
            enlace={{ href: "/servicios", texto: "Ver el Pack Doña Compra" }}
          >
            <p>
              Para vos, el Club es la parte del Pack Doña Compra que trae
              beneficios de las marcas que nos acompañan hacia tus clientes.
            </p>
            <p className="mt-3">
              Está incluido en el Pack: no tiene cuota aparte ni hay que pedir
              nada para formar parte.
            </p>
            <p className="mt-3 text-[14.5px] text-muted">
              Los beneficios concretos se comunican una vez definidos. No
              publicamos promesas que todavía no están detalladas en las
              condiciones.
            </p>
          </FilaAlterna>
        </Wrap>
      </section>

      <CTA
        titulo="¿Tu marca quiere acompañarnos?"
        texto="Contanos qué querés lograr y vemos juntos si el Club tiene sentido para lo que vendés."
      />
    </main>
  );
}
