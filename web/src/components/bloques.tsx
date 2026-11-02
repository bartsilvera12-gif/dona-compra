import Image from "next/image";
import Link from "next/link";
import Revelar from "./Revelar";
import { Wrap } from "./ui";

/* ---------------------------------------------------------------------------
   Bloques de composición.

   El sitio tiene fotos reales de comercios; la versión anterior de estas
   páginas no las usaba y por eso se veía plana. Estos bloques existen para
   que el contenido entre acompañado de imagen y con jerarquía tipográfica,
   no como una lista de tarjetas iguales.
   --------------------------------------------------------------------------- */

/** Rótulo de sección: texto corto con una línea al costado. */
export function Rotulo({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted">
      <span aria-hidden="true" className="h-px w-8 bg-terracotta" />
      {children}
    </span>
  );
}

/**
 * Portada con collage de fotos.
 *
 * Las cuatro imágenes van a distinta altura, como en el sitio original: una
 * fila perfectamente alineada se lee como un banco de imágenes, no como una
 * portada.
 */
export function PortadaCollage({
  rotulo,
  titulo,
  bajada,
  acciones,
  fotos,
}: {
  rotulo: string;
  titulo: React.ReactNode;
  bajada: string;
  acciones?: React.ReactNode;
  fotos: { src: string; alt: string }[];
}) {
  // Desfases que rompen la línea recta del collage.
  const desfase = ["sm:mt-10", "sm:mt-0", "sm:mt-14", "sm:mt-4"];

  return (
    <section className="overflow-hidden border-b border-navy/12">
      <Wrap className="!pb-[clamp(32px,5vw,64px)]">
        <Revelar>
          <Rotulo>{rotulo}</Rotulo>
        </Revelar>

        <div className="mt-7 grid grid-cols-2 gap-[clamp(8px,1.4vw,16px)] sm:grid-cols-4">
          {fotos.slice(0, 4).map((f, i) => (
            <Revelar key={f.src} retardo={(i + 1) as 1 | 2 | 3 | 4}>
              <div
                className={`relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-grad-start ${desfase[i]}`}
              >
                <Image
                  src={f.src}
                  alt={f.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                  data-acercar=""
                  priority={i < 2}
                />
              </div>
            </Revelar>
          ))}
        </div>

        <Revelar>
          {/* El título monta sobre el collage: es lo que le da profundidad. */}
          <h1 className="relative z-10 -mt-[clamp(14px,3vw,38px)] max-w-[20ch]">
            {titulo}
          </h1>
        </Revelar>

        <Revelar retardo={1}>
          <p className="mt-5 max-w-[56ch] text-[clamp(16px,1.8vw,19px)] text-ink">
            {bajada}
          </p>
          {acciones && <div className="mt-8 flex flex-wrap gap-3">{acciones}</div>}
        </Revelar>
      </Wrap>
    </section>
  );
}

/** Portada de una sola foto, al costado del título. */
export function PortadaFoto({
  rotulo,
  titulo,
  bajada,
  foto,
  acciones,
}: {
  rotulo: string;
  titulo: string;
  bajada: string;
  foto: { src: string; alt: string };
  acciones?: React.ReactNode;
}) {
  return (
    <section className="border-b border-navy/12">
      <Wrap>
        <div className="grid items-center gap-[clamp(24px,4vw,56px)] lg:grid-cols-[1.1fr_1fr]">
          <Revelar>
            <Rotulo>{rotulo}</Rotulo>
            <h1 className="mt-5 max-w-[18ch]">{titulo}</h1>
            <p className="mt-5 max-w-[52ch] text-[clamp(16px,1.8vw,19px)] text-ink">
              {bajada}
            </p>
            {acciones && (
              <div className="mt-8 flex flex-wrap gap-3">{acciones}</div>
            )}
          </Revelar>

          <Revelar retardo={2}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-grad-start">
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
                data-acercar=""
                priority
              />
            </div>
          </Revelar>
        </div>
      </Wrap>
    </section>
  );
}

/**
 * Portada compacta para las páginas de servicio (anuncios, contacto, FAQ,
 * jurídica): el título no ocupa la pantalla entera y el lado derecho lleva
 * tres fotos escalonadas o lo que la página necesite tener a mano, como el
 * WhatsApp en Contacto. Sin eso, media portada quedaba vacía.
 */
export function PortadaCompacta({
  rotulo,
  titulo,
  bajada,
  fotos,
  lateral,
  children,
}: {
  rotulo: string;
  titulo: string;
  bajada: React.ReactNode;
  fotos?: { src: string; alt: string }[];
  lateral?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const desfase = ["mt-8", "mt-0", "mt-12"];

  return (
    <section className="overflow-hidden border-b border-navy/12">
      <Wrap className="!py-[clamp(32px,5vw,64px)]">
        <div className="grid items-center gap-[clamp(24px,4vw,56px)] lg:grid-cols-[1.15fr_1fr]">
          <Revelar>
            <Rotulo>{rotulo}</Rotulo>
            <h1 className="mt-5 max-w-[18ch] text-[clamp(32px,4.6vw,54px)]">
              {titulo}
            </h1>
            <div className="mt-5 max-w-[52ch] text-[clamp(16px,1.8vw,18.5px)] text-ink">
              {bajada}
            </div>
            {children && <div className="mt-7">{children}</div>}
          </Revelar>

          {fotos && fotos.length > 0 && (
            <div className="grid grid-cols-3 gap-[clamp(8px,1.2vw,14px)]">
              {fotos.slice(0, 3).map((f, i) => (
                <Revelar key={f.src + i} retardo={(i + 1) as 1 | 2 | 3}>
                  <div
                    className={`relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-grad-start ${desfase[i]}`}
                  >
                    <Image
                      src={f.src}
                      alt={f.alt}
                      fill
                      sizes="(max-width: 1024px) 33vw, 16vw"
                      className="object-cover"
                      data-acercar=""
                      priority={i === 0}
                    />
                  </div>
                </Revelar>
              ))}
            </div>
          )}

          {lateral && <Revelar retardo={2}>{lateral}</Revelar>}
        </div>
      </Wrap>
    </section>
  );
}

/** Paso numerado con su foto. Para las secuencias de cuatro pasos. */
export function PasoFoto({
  n,
  titulo,
  texto,
  foto,
  retardo = 0,
}: {
  n: number;
  titulo: string;
  texto: string;
  foto?: { src: string; alt: string };
  retardo?: 0 | 1 | 2 | 3 | 4;
}) {
  return (
    <Revelar retardo={retardo} as="article">
      <div className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-navy/12 bg-card">
        {foto && (
          <div className="relative aspect-[5/3] bg-grad-start">
            <Image
              src={foto.src}
              alt={foto.alt}
              fill
              sizes="(max-width: 700px) 100vw, 25vw"
              className="object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 flex h-11 w-11 items-center justify-center rounded-tr-[var(--radius-card)] bg-card font-mono text-[17px] font-semibold text-terracotta-ink"
            >
              {n}
            </span>
          </div>
        )}
        <div className="flex flex-1 flex-col p-[clamp(16px,2vw,22px)]">
          {!foto && (
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-navy font-mono text-[16px] font-semibold text-card">
              {n}
            </span>
          )}
          <h3 className="mb-2">{titulo}</h3>
          <p className="text-ink">{texto}</p>
        </div>
      </div>
    </Revelar>
  );
}

/** Cifra grande con su explicación. Para los datos que conviene destacar. */
export function Cifra({
  valor,
  unidad,
  texto,
  retardo = 0,
}: {
  valor: string;
  unidad?: string;
  texto: string;
  retardo?: 0 | 1 | 2 | 3 | 4;
}) {
  return (
    <Revelar retardo={retardo}>
      <div className="border-l-2 border-terracotta pl-5">
        <span className="block font-heading text-[clamp(34px,5vw,56px)] font-bold leading-none text-navy">
          {valor}
          {unidad && (
            <span className="ml-1 text-[0.45em] font-semibold text-terracotta-ink">
              {unidad}
            </span>
          )}
        </span>
        <span className="mt-3 block max-w-[28ch] text-[14.5px] leading-relaxed text-ink">
          {texto}
        </span>
      </div>
    </Revelar>
  );
}

/**
 * Fila de imagen y texto que alterna de lado.
 * Rompe el ritmo de una página hecha solo de rejillas.
 */
export function FilaAlterna({
  rotulo,
  titulo,
  children,
  foto,
  invertida = false,
  enlace,
}: {
  rotulo?: string;
  titulo: string;
  children: React.ReactNode;
  foto: { src: string; alt: string };
  invertida?: boolean;
  enlace?: { href: string; texto: string };
}) {
  return (
    <div className="grid items-center gap-[clamp(24px,4vw,56px)] lg:grid-cols-2">
      <Revelar className={invertida ? "lg:order-2" : undefined}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-grad-start">
          <Image
            src={foto.src}
            alt={foto.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </Revelar>

      <Revelar retardo={1} className={invertida ? "lg:order-1" : undefined}>
        {rotulo && <Rotulo>{rotulo}</Rotulo>}
        <h2 className={rotulo ? "mt-4" : ""}>{titulo}</h2>
        <div className="mt-4 text-ink">{children}</div>
        {enlace && (
          <p className="mt-5">
            <Link href={enlace.href} className="font-medium text-terracotta-ink">
              {enlace.texto} →
            </Link>
          </p>
        )}
      </Revelar>
    </div>
  );
}

/** Mosaico de rubros: muchas fotos chicas con su nombre encima. */
export function MosaicoRubros({
  rubros,
}: {
  rubros: { slug: string; nombre: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-[clamp(8px,1.2vw,14px)] sm:grid-cols-3 lg:grid-cols-4">
      {rubros.map((r, i) => (
        <Revelar key={r.slug} retardo={((i % 4) + 1) as 1 | 2 | 3 | 4}>
          <div className="group relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-grad-start">
            <Image
              src={`/assets/rubro-${r.slug}.jpg`}
              alt={r.nombre}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* El degradado garantiza el contraste del nombre sobre
                cualquier foto, por clara que sea. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-navy-dark/85 via-navy-dark/20 to-transparent"
            />
            <span className="absolute inset-x-0 bottom-0 p-3 font-heading text-[15px] font-semibold text-card">
              {r.nombre}
            </span>
          </div>
        </Revelar>
      ))}
    </div>
  );
}
