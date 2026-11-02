import type { Metadata } from "next";
import BoletinForm from "@/components/BoletinForm";
import FiltrosAnuncios from "@/components/anuncios/Filtros";
import Paginacion from "@/components/anuncios/Paginacion";
import Tarjeta from "@/components/anuncios/Tarjeta";
import { Aviso, Card, Hero, Section } from "@/components/ui";
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
      <Hero
        eyebrow="Anuncios"
        titulo="Lo que pasa en la comunidad."
        bajada="Novedades, ofertas de mayoristas socios y publicaciones de comerciantes del Club, en fotos y videos cortos."
      />

      <Section tono="tarjeta">
        {modoDemo && (
          <div className="mb-8">
            <Aviso titulo="Contenido de ejemplo">
              La base de datos todavía no está conectada, así que lo que se ve
              abajo son publicaciones de muestra. Con{" "}
              <code className="rounded bg-navy/8 px-1.5 py-0.5 text-[14px]">
                DATABASE_URL
              </code>{" "}
              configurada, el feed pasa a mostrar las publicaciones reales.
            </Aviso>
          </div>
        )}

        <FiltrosAnuncios filtros={filtros} ciudades={ciudades} total={total} />

        {items.length === 0 ? (
          <Card className="py-12 text-center">
            <h3 className="mb-2">No hay publicaciones con esos filtros</h3>
            <p className="text-ink">
              Probá ampliando la ciudad o subiendo el precio máximo.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(290px,100%),1fr))] gap-[clamp(16px,2vw,24px)]">
            {items.map((p) => (
              <Tarjeta key={p.id} p={p} />
            ))}
          </div>
        )}

        <Paginacion filtros={filtros} pagina={pagina} paginas={paginas} />

        <p className="mt-8 max-w-[76ch] text-xs leading-relaxed text-muted">
          Las publicaciones pasan por moderación antes de aparecer. Los
          contenidos de mayoristas y comerciantes son responsabilidad de quien
          los publica.
        </p>
      </Section>

      <Section>
        <Card className="max-w-[620px]">
          <h2 className="mb-2 text-[clamp(20px,2.6vw,26px)]">
            Boletín Doña Compra
          </h2>
          <p className="mb-5 text-ink">
            Ofertas y novedades en tu correo. Te mandamos un correo para
            confirmar, y te podés dar de baja cuando quieras.
          </p>
          <BoletinForm />
        </Card>
      </Section>
    </main>
  );
}
