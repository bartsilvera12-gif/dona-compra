import Image from "next/image";
import Link from "next/link";
import type { ItemFeed } from "@/db/anuncios";
import { fechaLarga, precioGs } from "@/lib/formato";

export default function Tarjeta({ p }: { p: ItemFeed }) {
  const esVideo = p.tipo === "video";

  return (
    <article className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-navy/12 bg-card">
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
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
          className="object-cover"
        />
        {esVideo && (
          <>
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center bg-navy-dark/25"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-card/92 pl-1 text-xl text-navy">
                ▶
              </span>
            </span>
            <span className="absolute left-2.5 top-2.5 rounded-[var(--radius-button)] bg-terracotta-ink px-2.5 py-1 text-[10.5px] uppercase tracking-[0.1em] text-card">
              Video 9:16
            </span>
          </>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded px-2 py-0.5 text-[11px] font-medium bg-navy/8 text-navy">
            {p.categoria}
          </span>
          <span className="text-xs text-muted">{p.ciudad}</span>
        </div>

        <h3 className="text-[17px] leading-tight">
          <Link href={`/anuncios/${p.slug}`} className="hover:text-terracotta-ink">
            {p.titulo}
          </Link>
        </h3>

        <p className="flex-1 text-[14.5px] text-ink">{p.texto}</p>

        {p.precio > 0 && (
          <span className="font-mono text-[17px] font-semibold text-terracotta-ink">
            {precioGs(p.precio)}
          </span>
        )}

        <div className="flex flex-wrap gap-1.5 text-xs text-muted">
          <span>{p.autor}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={p.fecha}>{fechaLarga(p.fecha)}</time>
          {p.meGusta > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                {p.meGusta} {p.meGusta === 1 ? "me gusta" : "me gusta"}
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
