import Link from "next/link";
import { type Filtros } from "@/db/anuncios";
import { urlConFiltro } from "./Filtros";

export default function Paginacion({
  filtros,
  pagina,
  paginas,
}: {
  filtros: Filtros;
  pagina: number;
  paginas: number;
}) {
  if (paginas <= 1) return null;

  const numeros = Array.from({ length: paginas }, (_, i) => i + 1);
  const base =
    "rounded-[var(--radius-button)] border px-4 py-2.5 text-[13.5px] font-medium";

  return (
    <nav aria-label="Paginación" className="mt-10 flex flex-wrap items-center gap-2">
      {pagina > 1 && (
        <Link
          href={urlConFiltro(filtros, { pagina: pagina - 1 })}
          rel="prev"
          className={`${base} border-navy/25 text-ink hover:border-terracotta`}
        >
          ← Anterior
        </Link>
      )}

      {numeros.map((n) => (
        <Link
          key={n}
          href={urlConFiltro(filtros, { pagina: n })}
          aria-current={n === pagina ? "page" : undefined}
          className={
            n === pagina
              ? `${base} border-navy bg-navy text-card`
              : `${base} border-navy/25 text-ink hover:border-terracotta`
          }
        >
          {n}
        </Link>
      ))}

      {pagina < paginas && (
        <Link
          href={urlConFiltro(filtros, { pagina: pagina + 1 })}
          rel="next"
          className={`${base} border-navy/25 text-ink hover:border-terracotta`}
        >
          Siguiente →
        </Link>
      )}
    </nav>
  );
}
