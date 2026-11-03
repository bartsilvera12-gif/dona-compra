import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { requireDb } from "@/db";
import { mensajes } from "@/db/schema";
import { cambiarEstadoMensaje } from "../actions";
import { fechaLarga } from "@/lib/formato";

export const metadata = { title: "Mensajes" };

const ESTADOS = ["nuevo", "leido", "respondido", "spam"] as const;
type Estado = (typeof ESTADOS)[number];

const COLOR: Record<Estado, string> = {
  nuevo: "border-terracotta/45 bg-terracotta/8 text-terracotta-ink",
  leido: "border-navy/20 bg-navy/5 text-navy",
  respondido: "border-ok/45 bg-ok/10 text-ink",
  spam: "border-error/40 bg-error/8 text-error-ink",
};

type Props = { searchParams: Promise<{ estado?: string }> };

export default async function MensajesPage({ searchParams }: Props) {
  const { estado: filtro } = await searchParams;
  const db = requireDb();

  const filas = await db
    .select()
    .from(mensajes)
    .where(
      filtro && (ESTADOS as readonly string[]).includes(filtro)
        ? eq(mensajes.estado, filtro as Estado)
        : undefined,
    )
    .orderBy(desc(mensajes.creadoEn))
    .limit(100);

  return (
    <div>
      <h2 className="mb-5 text-[22px]">Mensajes</h2>

      <nav aria-label="Filtrar por estado" className="mb-6 flex flex-wrap gap-2">
        <Link
          href={"/admin/mensajes"}
          className={`rounded-[var(--radius-button)] border px-4 py-2 text-[13.5px] ${
            !filtro ? "border-navy bg-navy text-card" : "border-navy/25 text-ink"
          }`}
        >
          Todos
        </Link>
        {ESTADOS.map((e) => (
          <Link
            key={e}
            href={`/admin/mensajes?estado=${e}`}
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
          No hay mensajes {filtro ? `en estado «${filtro}»` : "todavía"}.
        </p>
      ) : (
        <div className="grid gap-3">
          {filas.map((m) => (
            <article
              key={m.id}
              className="rounded-[var(--radius-card)] border border-navy/12 bg-card p-5"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px]">
                    {m.nombre} {m.apellido}
                  </h3>
                  <p className="mt-1 text-[13.5px] text-muted">
                    {m.asunto}
                    {m.negocio ? ` · ${m.negocio}` : ""}
                    {m.ciudad ? ` · ${m.ciudad}` : ""}
                    {" · "}
                    {fechaLarga(m.creadoEn.toISOString().slice(0, 10))}
                  </p>
                </div>
                <span
                  className={`rounded-[var(--radius-button)] border px-3 py-1 text-[11px] uppercase tracking-[0.1em] ${COLOR[m.estado]}`}
                >
                  {m.estado}
                </span>
              </div>

              <p className="mb-4 whitespace-pre-wrap text-ink">{m.mensaje}</p>

              <div className="mb-4 flex flex-wrap gap-4 text-[13.5px]">
                <a href={`mailto:${m.correo}`} className="text-terracotta-ink underline">
                  {m.correo}
                </a>
                <a
                  href={`https://wa.me/595${m.telefono.replace(/\D/g, "").replace(/^0/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terracotta-ink underline"
                >
                  {m.telefono}
                </a>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-navy/10 pt-4">
                {ESTADOS.filter((e) => e !== m.estado).map((e) => (
                  <form key={e} action={cambiarEstadoMensaje}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="estado" value={e} />
                    <button
                      type="submit"
                      className="cursor-pointer rounded-[var(--radius-button)] border border-navy/20 px-3.5 py-2 text-[13px] capitalize text-ink hover:border-terracotta"
                    >
                      Marcar {e}
                    </button>
                  </form>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
