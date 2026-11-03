import Image from "next/image";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { requireDb } from "@/db";
import { publicaciones } from "@/db/schema";
import { moderarPublicacion } from "../actions";
import { fechaLarga, precioGs } from "@/lib/formato";

export const metadata = { title: "Publicaciones" };

const ESTADOS = ["pendiente", "publicada", "rechazada", "archivada"] as const;
type Estado = (typeof ESTADOS)[number];

const COLOR: Record<Estado, string> = {
  pendiente: "border-terracotta/45 bg-terracotta/8 text-terracotta-ink",
  publicada: "border-ok/45 bg-ok/10 text-ink",
  rechazada: "border-error/40 bg-error/8 text-error-ink",
  archivada: "border-navy/20 bg-navy/5 text-navy",
};

type Props = {
  searchParams: Promise<{ estado?: string; guardada?: string }>;
};

export default async function PublicacionesPage({ searchParams }: Props) {
  const { estado: filtro, guardada } = await searchParams;
  const db = requireDb();

  const filas = await db
    .select()
    .from(publicaciones)
    .where(
      filtro && (ESTADOS as readonly string[]).includes(filtro)
        ? eq(publicaciones.estado, filtro as Estado)
        : undefined,
    )
    .orderBy(desc(publicaciones.creadoEn))
    .limit(100);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="mb-2 text-[22px]">Publicaciones</h2>
          <p className="max-w-[70ch] text-ink">
            Solo las que están en estado <strong>publicada</strong> aparecen en
            el feed. Una publicación nueva nace en <strong>pendiente</strong>.
          </p>
        </div>
        <Link
          href="/admin/publicaciones/nueva"
          className="flex-none rounded-[var(--radius-button)] bg-navy px-5 py-2.5 text-[13.5px] font-medium text-card hover:bg-navy-deep hover:text-card"
        >
          Nueva publicación
        </Link>
      </div>

      {guardada && (
        <p
          role="status"
          className="mb-6 rounded-[var(--radius-card)] border border-ok/45 bg-ok/10 px-4 py-3 text-[14.5px] text-ink"
        >
          Publicación guardada.
        </p>
      )}

      <nav aria-label="Filtrar por estado" className="mb-6 flex flex-wrap gap-2">
        <Link
          href={"/admin/publicaciones"}
          className={`rounded-[var(--radius-button)] border px-4 py-2 text-[13.5px] ${
            !filtro ? "border-navy bg-navy text-card" : "border-navy/25 text-ink"
          }`}
        >
          Todas
        </Link>
        {ESTADOS.map((e) => (
          <Link
            key={e}
            href={`/admin/publicaciones?estado=${e}`}
            className={`rounded-[var(--radius-button)] border px-4 py-2 text-[13.5px] capitalize ${
              filtro === e ? "border-navy bg-navy text-card" : "border-navy/25 text-ink"
            }`}
          >
            {e}
          </Link>
        ))}
      </nav>

      {filas.length === 0 ? (
        <p className="rounded-[var(--radius-card)] border border-navy/12 bg-card p-8 text-center text-ink">
          No hay publicaciones {filtro ? `en estado «${filtro}»` : "todavía"}.{" "}
          <Link href="/admin/publicaciones/nueva" className="text-terracotta-ink underline">
            Creá la primera
          </Link>{" "}
          o cargá las de ejemplo con <code>npm run db:seed</code>.
        </p>
      ) : (
        <div className="grid gap-3">
          {filas.map((p) => (
            <article
              key={p.id}
              className="grid gap-4 rounded-[var(--radius-card)] border border-navy/12 bg-card p-5 sm:grid-cols-[120px_1fr]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-button)] bg-grad-start">
                <Image
                  src={p.imagen}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[18px]">{p.titulo}</h3>
                    <p className="mt-1 text-[13.5px] text-muted">
                      {p.categoria} · {p.ciudad} · {p.autor} ·{" "}
                      {fechaLarga(p.fecha)}
                      {p.precio > 0 ? ` · ${precioGs(p.precio)}` : ""}
                      {p.tipo === "video" ? " · video" : ""}
                    </p>
                  </div>
                  <span
                    className={`rounded-[var(--radius-button)] border px-3 py-1 text-[11px] uppercase tracking-[0.1em] ${COLOR[p.estado]}`}
                  >
                    {p.estado}
                  </span>
                </div>

                <p className="mb-3 text-ink">{p.texto}</p>

                {p.notaModeracion && (
                  <p className="mb-3 rounded-[var(--radius-button)] bg-navy/5 px-3 py-2 text-[13px] text-muted">
                    Nota interna: {p.notaModeracion}
                  </p>
                )}

                {p.estado === "publicada" && (
                  <p className="mb-3 text-[13.5px]">
                    <Link
                      href={`/anuncios/${p.slug}`}
                      className="text-terracotta-ink underline"
                    >
                      Ver en el sitio →
                    </Link>
                  </p>
                )}

                <div className="flex flex-wrap items-end gap-2 border-t border-navy/10 pt-4">
                  <Link
                    href={`/admin/publicaciones/${p.id}`}
                    className="rounded-[var(--radius-button)] border border-navy/25 px-3.5 py-2 text-[13px] font-medium text-navy hover:border-terracotta"
                  >
                    Editar
                  </Link>
                  {ESTADOS.filter((e) => e !== p.estado).map((e) => (
                    <form key={e} action={moderarPublicacion}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="estado" value={e} />
                      <button
                        type="submit"
                        className={`cursor-pointer rounded-[var(--radius-button)] border px-3.5 py-2 text-[13px] capitalize hover:border-terracotta ${
                          e === "publicada"
                            ? "border-ok/50 text-ink"
                            : "border-navy/20 text-ink"
                        }`}
                      >
                        {e === "publicada" ? "Aprobar" : `Marcar ${e}`}
                      </button>
                    </form>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
