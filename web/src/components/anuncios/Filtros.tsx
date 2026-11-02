import Link from "next/link";
import { CATEGORIAS, ORDENES, type Filtros } from "@/db/anuncios";

const INPUT =
  "w-full rounded-[var(--radius-button)] border border-navy/25 bg-card px-3.5 py-2.5 text-[15px] text-ink";
const LABEL = "mb-1.5 block text-xs uppercase tracking-[0.08em] text-muted";

const chip = (activo: boolean) =>
  `rounded-full border px-4 py-2 text-[13.5px] font-medium ${
    activo
      ? "border-navy bg-navy text-card hover:text-card"
      : "border-navy/20 bg-card text-ink hover:border-terracotta"
  }`;

/** Opción del selector Todos / Fotos / Videos, que va como un solo control. */
const segmento = (activo: boolean) =>
  `rounded-full px-4 py-1.5 text-[13.5px] font-medium ${
    activo ? "bg-navy text-card hover:text-card" : "text-ink"
  }`;

/** Arma una URL conservando el resto de los filtros. */
export function urlConFiltro(f: Filtros, cambios: Partial<Filtros>): string {
  const p = new URLSearchParams();
  const final = { ...f, ...cambios, pagina: cambios.pagina ?? 1 };
  if (final.categoria) p.set("categoria", final.categoria);
  if (final.ciudad) p.set("ciudad", final.ciudad);
  if (final.tipo) p.set("tipo", final.tipo);
  if (final.precioMax) p.set("precioMax", String(final.precioMax));
  if (final.orden && final.orden !== "recientes") p.set("orden", final.orden);
  if (final.pagina && final.pagina > 1) p.set("pagina", String(final.pagina));
  const q = p.toString();
  return q ? `/anuncios?${q}` : "/anuncios";
}

export default function FiltrosAnuncios({
  filtros,
  ciudades,
  total,
}: {
  filtros: Filtros;
  ciudades: string[];
  total: number;
}) {
  const hayFiltros =
    !!filtros.categoria ||
    !!filtros.ciudad ||
    !!filtros.tipo ||
    !!filtros.precioMax ||
    (filtros.orden && filtros.orden !== "recientes");

  return (
    <div className="mb-10 rounded-[var(--radius-card)] border border-navy/12 bg-grad-mid p-[clamp(16px,2.2vw,24px)]">
      <h2 className="sr-only">Filtrar publicaciones</h2>

      {/* Categoría y tipo son enlaces: cada combinación tiene su propia URL,
          se puede compartir y el buscador la puede recorrer. */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Categoría" className="flex flex-wrap gap-2">
          <Link href={urlConFiltro(filtros, { categoria: undefined })} className={chip(!filtros.categoria)}>
            Todas
          </Link>
          {CATEGORIAS.map((c) => (
            <Link
              key={c}
              href={urlConFiltro(filtros, { categoria: c })}
              className={chip(filtros.categoria === c)}
            >
              {c}
            </Link>
          ))}
        </nav>

        <nav
          aria-label="Tipo de publicación"
          className="inline-flex rounded-full border border-navy/20 bg-card p-1"
        >
          <Link href={urlConFiltro(filtros, { tipo: undefined })} className={segmento(!filtros.tipo)}>
            Todos
          </Link>
          <Link href={urlConFiltro(filtros, { tipo: "foto" })} className={segmento(filtros.tipo === "foto")}>
            Fotos
          </Link>
          <Link href={urlConFiltro(filtros, { tipo: "video" })} className={segmento(filtros.tipo === "video")}>
            Videos
          </Link>
        </nav>
      </div>

      {/* Un GET normal: sin JavaScript también filtra. */}
      <form method="get" action="/anuncios" className="mt-5 grid gap-4 border-t border-navy/10 pt-5">
        {filtros.categoria && (
          <input type="hidden" name="categoria" value={filtros.categoria} />
        )}
        {filtros.tipo && <input type="hidden" name="tipo" value={filtros.tipo} />}

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-4">
          <div>
            <label htmlFor="f-ciudad" className={LABEL}>
              Ciudad
            </label>
            <select
              id="f-ciudad"
              name="ciudad"
              defaultValue={filtros.ciudad ?? ""}
              className={INPUT}
            >
              <option value="">Todas</option>
              {ciudades.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="f-orden" className={LABEL}>
              Ordenar por
            </label>
            <select
              id="f-orden"
              name="orden"
              defaultValue={filtros.orden ?? "recientes"}
              className={INPUT}
            >
              {Object.entries(ORDENES).map(([v, label]) => (
                <option key={v} value={v}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="f-precio" className={LABEL}>
              Precio máximo en guaraníes
            </label>
            <input
              id="f-precio"
              name="precioMax"
              type="number"
              min={0}
              step={10000}
              inputMode="numeric"
              placeholder="Sin tope"
              defaultValue={filtros.precioMax || ""}
              className={INPUT}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-muted" role="status">
            {total === 1 ? "1 publicación" : `${total} publicaciones`}
          </span>
          <span className="flex flex-wrap items-center gap-3">
            {hayFiltros && (
              <Link href="/anuncios" className="text-[13.5px] font-medium text-terracotta-ink">
                Limpiar filtros
              </Link>
            )}
            <button
              type="submit"
              className="cursor-pointer rounded-[var(--radius-button)] bg-navy px-5 py-2.5 text-[13.5px] font-medium text-card hover:bg-navy-deep"
            >
              Aplicar
            </button>
          </span>
        </div>
      </form>
    </div>
  );
}
