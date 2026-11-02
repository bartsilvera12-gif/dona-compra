import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Acciones from "@/components/anuncios/Acciones";
import { Aviso, Wrap } from "@/components/ui";
import { obtenerPorSlug, slugsPublicados } from "@/db/anuncios";
import { yaReacciono } from "../actions";
import { fechaLarga, precioGs } from "@/lib/formato";
import { site, waLink } from "@/lib/site";

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

      <section>
        <Wrap className="!pb-[clamp(48px,7vw,96px)]">
          <nav aria-label="Migas de pan" className="mb-8 flex flex-wrap items-center gap-2 text-[13px] text-muted">
            <Link href="/anuncios" className="text-muted hover:text-terracotta-ink">
              ← Anuncios
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/anuncios?categoria=${encodeURIComponent(p.categoria)}`}
              className="text-muted hover:text-terracotta-ink"
            >
              {p.categoria}
            </Link>
          </nav>

          <div
            className={`grid items-start gap-[clamp(24px,4vw,64px)] ${
              // El video vertical ocupa una columna angosta; la foto, la mitad.
              esVideo ? "lg:grid-cols-[minmax(0,400px)_1fr]" : "lg:grid-cols-[1.15fr_1fr]"
            }`}
          >
            <div
              className="relative overflow-hidden rounded-[var(--radius-card)] bg-grad-start lg:sticky lg:top-28"
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

            <div className="rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(20px,3vw,36px)]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-navy px-3 py-1 text-[12px] font-semibold text-card">
                  {p.categoria}
                </span>
                <span className="rounded-full border border-navy/15 px-3 py-1 text-[12px] text-ink">
                  {p.ciudad}
                </span>
                {esVideo && (
                  <span className="rounded-full border border-navy/15 px-3 py-1 text-[12px] text-ink">
                    Video
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-[clamp(28px,3.8vw,44px)]">{p.titulo}</h1>

              <p className="mt-3 text-sm text-muted">
                {p.autor} · <time dateTime={p.fecha}>{fechaLarga(p.fecha)}</time>
              </p>

              <p className="mt-6 text-[clamp(16px,1.8vw,18px)] leading-relaxed text-ink">
                {p.texto}
              </p>

              {p.precio > 0 && (
                <p className="mt-6 inline-block rounded-[var(--radius-button)] bg-terracotta/8 px-4 py-2 font-mono text-[clamp(22px,3vw,30px)] font-semibold text-terracotta-ink">
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

              <div className="mt-8 rounded-[var(--radius-card)] bg-navy p-[clamp(18px,2.6vw,28px)]">
                <h2 className="mb-2 text-[20px] text-card">¿Te interesa?</h2>
                <p className="mb-5 text-card/80">
                  Escribinos y coordinamos una visita a tu negocio.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/contacto"
                    className="inline-block rounded-[var(--radius-button)] bg-terracotta-ink px-6 py-3 text-sm font-medium text-card hover:opacity-90 hover:text-card"
                  >
                    Pedir una visita
                  </Link>
                  <a
                    href={waLink(`Hola, Doña Compra. Vi el anuncio "${p.titulo}" y me interesa.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-[var(--radius-button)] border border-card/50 px-6 py-3 text-sm font-medium text-card hover:border-terracotta-soft hover:text-card"
                  >
                    Escribir por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-12">
            <Link href="/anuncios" className="font-medium text-terracotta-ink">
              ← Volver a todos los anuncios
            </Link>
          </p>
        </Wrap>
      </section>
    </main>
  );
}
