import type { Metadata } from "next";
import Image from "next/image";
import BoletinForm from "@/components/BoletinForm";
import Revelar from "@/components/Revelar";
import FiltrosAnuncios from "@/components/anuncios/Filtros";
import Paginacion from "@/components/anuncios/Paginacion";
import Tarjeta from "@/components/anuncios/Tarjeta";
import { PortadaCompacta, Rotulo } from "@/components/bloques";
import { CTA, Wrap } from "@/components/ui";
import {
  listarPublicaciones,
  ORDENES,
  type Filtros,
  type Orden,
} from "@/db/anuncios";

export const metadata: Metadata = {
  title: "Anuncios",
  description:
    "Novedades, ofertas de mayoristas socios y publicaciones de la comunidad Doña Compra, en fotos y videos cortos.",
};

const PORTADA = [
  { src: "/assets/hero-2-640.jpg", alt: "Comerciante reponiendo una góndola" },
  { src: "/assets/rubro-despensas.jpg", alt: "Góndolas de una despensa" },
  { src: "/assets/rubro-ropa.jpg", alt: "Ropa en exhibición" },
];

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const uno = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v)?.trim() || undefined;

export default async function AnunciosPage({ searchParams }: Props) {
  const sp = await searchParams;

  const ordenCrudo = uno(sp.orden);
  const filtros: Filtros = {
    categoria: uno(sp.categoria),
    ciudad: uno(sp.ciudad),
    tipo: uno(sp.tipo),
    precioMax: Number(uno(sp.precioMax)) || undefined,
    orden:
      ordenCrudo && ordenCrudo in ORDENES ? (ordenCrudo as Orden) : "recientes",
    pagina: Number(uno(sp.pagina)) || 1,
  };

  const { items, total, pagina, paginas, ciudades, modoDemo } =
    await listarPublicaciones(filtros);

  return (
    <main>
      <PortadaCompacta
        rotulo="Anuncios"
        titulo="Lo que pasa en la comunidad."
        bajada={
          <p>
            Novedades de la red, ofertas de los Proveedores Amigos y
            publicaciones de los comerciantes del Club, en fotos y videos
            cortos.
          </p>
        }
        fotos={PORTADA}
      >
        <div className="flex flex-wrap gap-2 text-[13px] text-ink">
          {["Fotos y videos 9:16", "Me gusta y compartir", "Moderación previa"].map(
            (t) => (
              <span
                key={t}
                className="rounded-full border border-navy/15 bg-card px-3.5 py-1.5"
              >
                {t}
              </span>
            ),
          )}
        </div>
      </PortadaCompacta>

      <section className="bg-card">
        <Wrap>
          {modoDemo && (
            <p className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-[var(--radius-button)] border border-terracotta/30 bg-terracotta/8 px-4 py-2.5 text-[13.5px] text-ink">
              <strong className="font-semibold text-terracotta-ink">
                Contenido de ejemplo.
              </strong>
              La base de datos todavía no está conectada: con{" "}
              <code className="rounded bg-navy/8 px-1.5 py-0.5 text-[13px]">
                DATABASE_URL
              </code>{" "}
              configurada, el feed muestra las publicaciones reales.
            </p>
          )}

          <FiltrosAnuncios filtros={filtros} ciudades={ciudades} total={total} />

          {items.length === 0 ? (
            <div className="rounded-[var(--radius-card)] border border-dashed border-navy/25 px-6 py-16 text-center">
              <h3 className="mb-2">No hay publicaciones con esos filtros</h3>
              <p className="text-ink">
                Probá ampliando la ciudad o subiendo el precio máximo.
              </p>
            </div>
          ) : (
            // Columnas y no rejilla: los videos 9:16 conviven con las fotos
            // apaisadas sin dejar huecos, como en un feed de red social.
            <div className="columns-1 gap-[clamp(16px,2vw,24px)] sm:columns-2 lg:columns-3">
              {items.map((p) => (
                <Tarjeta key={p.id} p={p} />
              ))}
            </div>
          )}

          <Paginacion filtros={filtros} pagina={pagina} paginas={paginas} />

          <p className="mt-8 max-w-[76ch] text-xs leading-relaxed text-muted">
            Las publicaciones pasan por moderación antes de aparecer. Los
            contenidos de mayoristas y comerciantes son responsabilidad de
            quien los publica.
          </p>
        </Wrap>
      </section>

      <section>
        <Wrap>
          <Revelar>
            <div className="grid overflow-hidden rounded-[var(--radius-card)] border border-navy/12 bg-card md:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[200px] bg-grad-start">
                <Image
                  src="/assets/hoy-entrega-1400.jpg"
                  alt="Entrega de cajas de mercadería desde una camioneta"
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className="p-[clamp(20px,3.4vw,44px)]">
                <Rotulo>Boletín</Rotulo>
                <h2 className="mt-4 mb-3">Las ofertas, en tu correo.</h2>
                <p className="mb-6 max-w-[46ch] text-ink">
                  Ofertas y novedades de los mayoristas socios. Te mandamos un
                  correo para confirmar, y te podés dar de baja cuando quieras.
                </p>
                <BoletinForm />
              </div>
            </div>
          </Revelar>
        </Wrap>
      </section>

      <CTA
        titulo="Querés comprar así para tu negocio?"
        texto="Elegí la mercadería en tu proveedor, nosotros la pagamos y vos la pagás después. Empieza con una visita."
      />
    </main>
  );
}
