import Image from "next/image";
import Link from "next/link";
import type { ItemFeed } from "@/db/anuncios";
import { fechaLarga, precioGs } from "@/lib/formato";

export default function Tarjeta({ p }: { p: ItemFeed }) {
  const esVideo = p.tipo === "video";

  return (
    // break-inside-avoid: el feed va en columnas y una tarjeta no se parte.
    <article className="group mb-[clamp(16px,2vw,24px)] flex break-inside-avoid flex-col overflow-hidden rounded-[var(--radius-card)] border border-navy/12 bg-card transition-shadow duration-300 hover:shadow-[0_14px_34px_-18px_rgba(26,54,93,0.45)]">
      <Link
        href={`/anuncios/${p.slug}`}
        className="relative block overflow-hidden bg-grad-start"
        // Los videos del pliego son verticales 9:16; las fotos, apaisadas.
        style={{ aspectRatio: esVideo ? "9 / 16" : "4 / 3" }}
      >
        <Image
          src={p.imagen}
          alt={p.imagenAlt ?? `${p.titulo} — ${p.categoria}, ${p.ciudad}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {/* Degradado: garantiza el contraste de los rótulos sobre la foto. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-navy-dark/55 to-transparent"
        />
        <span className="absolute left-3 top-3 rounded-full bg-card px-3 py-1 text-[11.5px] font-semibold text-navy">
          {p.categoria}
        </span>
        {esVideo && (
          <>
            <span className="absolute right-3 top-3 rounded-full bg-terracotta-ink px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-card">
              Video
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* SVG y no "▶": algunos sistemas dibujan ese carácter como emoji. */}
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-card/92 pl-1 text-navy shadow-lg transition-transform duration-300 group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                  <path d="M7 4.5v15l13-7.5z" />
                </svg>
              </span>
            </span>
          </>
        )}
        {p.precio > 0 && (
          <span className="absolute bottom-3 left-3 rounded-[var(--radius-button)] bg-card px-3 py-1.5 font-mono text-[15px] font-semibold text-terracotta-ink shadow-sm">
            {precioGs(p.precio)}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-[clamp(16px,1.8vw,20px)]">
        <span className="text-xs uppercase tracking-[0.12em] text-muted">
          {p.ciudad}
        </span>

        <h3 className="text-[18px] leading-snug">
          <Link href={`/anuncios/${p.slug}`} className="hover:text-terracotta-ink">
            {p.titulo}
          </Link>
        </h3>

        <p className="line-clamp-3 text-[14.5px] text-ink">{p.texto}</p>

        <div className="mt-2 flex items-center justify-between gap-3 border-t border-navy/10 pt-3 text-xs text-muted">
          <span className="min-w-0 truncate">
            {p.autor} · <time dateTime={p.fecha}>{fechaLarga(p.fecha)}</time>
          </span>
          {p.meGusta > 0 && (
            <span className="flex-none text-terracotta-ink">
              <span aria-hidden="true">♥</span> {p.meGusta}
              <span className="sr-only"> me gusta</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
