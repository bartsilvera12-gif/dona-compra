import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Acciones from "@/components/anuncios/Acciones";
import { Aviso, Section, Wrap } from "@/components/ui";
import { obtenerPorSlug, slugsPublicados } from "@/db/anuncios";
import { yaReacciono } from "../actions";
import { fechaLarga, precioGs } from "@/lib/formato";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await slugsPublicados();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await obtenerPorSlug(slug);
  if (!p) return { title: "Publicación no encontrada" };

  return {
    title: p.titulo,
    description: p.texto.slice(0, 160),
    alternates: { canonical: `/anuncios/${p.slug}` },
    openGraph: {
      title: p.titulo,
      description: p.texto.slice(0, 160),
      type: "article",
      publishedTime: p.fecha,
      images: [{ url: p.imagen }],
    },
  };
}

export default async function PublicacionPage({ params }: Props) {
  const { slug } = await params;
  const p = await obtenerPorSlug(slug);
  if (!p) notFound();

  const activo = await yaReacciono(p.id);
  const esVideo = p.tipo === "video";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": esVideo ? "VideoObject" : "Article",
    headline: p.titulo,
    description: p.texto,
    datePublished: p.fecha,
    author: { "@type": "Organization", name: p.autor },
    publisher: { "@type": "Organization", name: site.name },
    image: `${site.url}${p.imagen}`,
    ...(esVideo ? { uploadDate: p.fecha, thumbnailUrl: `${site.url}${p.imagen}` } : {}),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-navy/12">
        <Wrap>
          <nav aria-label="Migas de pan" className="mb-6 text-[13px] text-muted">
            <Link href="/anuncios" className="hover:text-terracotta-ink">
              Anuncios
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span>{p.categoria}</span>
          </nav>

          <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
            {p.categoria} · {p.ciudad}
          </span>
          <h1 className="mt-4 max-w-[20ch]">{p.titulo}</h1>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted">
            <span>{p.autor}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={p.fecha}>{fechaLarga(p.fecha)}</time>
          </div>
        </Wrap>
      </section>

      <section className="bg-card">
        <Wrap>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-start gap-[clamp(20px,3vw,44px)]">
            <div
              className="relative overflow-hidden rounded-[var(--radius-card)] bg-grad-start"
              style={{ aspectRatio: esVideo ? "9 / 16" : "4 / 3" }}
            >
              {esVideo && p.videoUrl ? (
                <iframe
                  src={p.videoUrl}
                  title={p.titulo}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : (
                <Image
                  src={p.imagen}
                  alt={p.imagenAlt ?? `${p.titulo} — ${p.categoria}, ${p.ciudad}`}
                  fill
                  sizes="(max-width: 700px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              )}
            </div>

            <div>
              <p className="text-[clamp(16px,1.8vw,18px)] text-ink">{p.texto}</p>

              {p.precio > 0 && (
                <p className="mt-5 font-mono text-[clamp(22px,3vw,30px)] font-semibold text-terracotta-ink">
                  {precioGs(p.precio)}
                </p>
              )}

              {esVideo && !p.videoUrl && (
                <div className="mt-5">
                  <Aviso>
                    Video vertical 9:16. La reproducción se activa cuando se
                    configure el alojamiento externo (Cloudflare Stream, Vimeo
                    o YouTube no listado).
                  </Aviso>
                </div>
              )}

              <div className="mt-7">
                <Acciones
                  slug={p.slug}
                  titulo={p.titulo}
                  texto={p.texto}
                  meGusta={p.meGusta}
                  activo={activo}
                />
              </div>

              <div className="mt-8 border-t border-navy/10 pt-6">
                <h2 className="mb-2 text-[20px]">¿Te interesa?</h2>
                <p className="mb-4 text-ink">
                  Escribinos y coordinamos una visita a tu negocio.
                </p>
                <Link
                  href="/contacto"
                  className="inline-block rounded-[var(--radius-button)] bg-navy px-7 py-3.5 text-sm font-medium text-card hover:bg-navy-deep hover:text-card"
                >
                  Pedir una visita
                </Link>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      <Section>
        <Link href="/anuncios" className="font-medium text-terracotta-ink">
          ← Volver a todos los anuncios
        </Link>
      </Section>
    </main>
  );
}
