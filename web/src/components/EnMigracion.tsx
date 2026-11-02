import Link from "next/link";

/**
 * Marcador para las páginas cuyo contenido todavía vive en el sitio estático.
 * Se reemplaza por la página real a medida que avanza la migración.
 */
export default function EnMigracion({
  titulo,
  bajada,
  ruta,
}: {
  titulo: string;
  bajada: string;
  ruta: string;
}) {
  return (
    <main>
      <section className="border-b border-navy/12">
        <div className="mx-auto max-w-[1280px] px-[clamp(18px,4vw,40px)] py-[clamp(40px,6vw,86px)]">
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
            {titulo}
          </span>
          <h1 className="mt-4">{titulo}</h1>
          <p className="mt-4 max-w-[56ch] text-[clamp(16px,1.8vw,19px)] text-ink">
            {bajada}
          </p>
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto max-w-[1280px] px-[clamp(18px,4vw,40px)] py-[clamp(40px,6vw,86px)]">
          <div className="max-w-[70ch] rounded-[var(--radius-card)] border border-terracotta/30 bg-terracotta/8 p-[clamp(16px,2.2vw,24px)]">
            <h3 className="mb-2">Contenido en migración</h3>
            <p className="text-ink">
              Esta página ya está publicada en el sitio actual. La estamos
              pasando a la versión nueva, que suma URLs reales e indexables.
              Mientras tanto, podés verla en{" "}
              <code className="rounded bg-navy/8 px-1.5 py-0.5 text-[14px]">
                {ruta}
              </code>
              .
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Link
              href="/contacto"
              className="inline-block rounded-[var(--radius-button)] bg-navy px-6 py-3.5 text-sm font-medium text-card hover:bg-navy-deep hover:text-card"
            >
              Pedir una visita
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
