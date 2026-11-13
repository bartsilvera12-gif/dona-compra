import Link from "next/link";
import { waLink } from "@/lib/site";

/** Contenedor estándar: ancho máximo y márgenes laterales del manual. */
export function Wrap({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto max-w-[1280px] px-[clamp(18px,4vw,40px)] py-[clamp(40px,6vw,86px)] ${className}`}
    >
      {children}
    </div>
  );
}

/** Sección sobre el degradado de fondo (transparente) o sobre tarjeta. */
export function Section({
  children,
  tono = "fondo",
}: {
  children: React.ReactNode;
  tono?: "fondo" | "tarjeta";
}) {
  return (
    <section className={tono === "tarjeta" ? "bg-card" : ""}>
      <Wrap>{children}</Wrap>
    </section>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(16px,2.2vw,24px)] ${className}`}
    >
      {children}
    </div>
  );
}

/** Rejilla que se adapta sola: 3 columnas en escritorio, 1 en teléfono. */
export function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4">
      {children}
    </div>
  );
}

/** Tarjeta de título + texto, el patrón que más se repite. */
export function CardItem({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <h3 className="mb-2">{titulo}</h3>
      <p className="text-ink">{children}</p>
    </Card>
  );
}

/** Paso numerado, para las secuencias de "cómo empezar". */
export function Paso({
  n,
  titulo,
  children,
}: {
  n: number;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex items-start gap-4">
      <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-navy text-[15px] font-semibold text-card">
        {n}
      </span>
      <div>
        <h3 className="mb-2">{titulo}</h3>
        <p className="text-ink">{children}</p>
      </div>
    </Card>
  );
}

/* Botones tipo píldora, grandes. Es el formato de la referencia que pasó el
   cliente: un botón sólido, redondo y ancho, repetido en toda la página. El
   radio de 8 px de la carta gráfica queda para tarjetas y campos; acá manda
   lo que el cliente pidió ver. */
export const btnPrimario =
  "inline-block rounded-full bg-navy px-8 py-4 text-[15px] font-semibold tracking-[0.02em] text-card shadow-[0_10px_24px_-12px_rgba(16,41,25,0.9)] transition-transform hover:bg-navy-deep hover:text-card hover:-translate-y-0.5 motion-reduce:hover:translate-y-0";

/* El secundario en ocre sólido, con texto verde oscuro: el ocre sobre marfil
   no sirve para letra, pero como fondo de botón con texto oscuro da 5.9. */
export const btnSecundario =
  "inline-block rounded-full bg-ocre px-8 py-4 text-[15px] font-semibold tracking-[0.02em] text-navy shadow-[0_10px_24px_-12px_rgba(16,41,25,0.7)] transition-transform hover:bg-ocre-oscuro hover:text-navy hover:-translate-y-0.5 motion-reduce:hover:translate-y-0";

/** Bloque de cierre con las dos llamadas a la acción de siempre. */
export function CTA({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <section className="bg-navy">
      <div className="mx-auto max-w-[1280px] px-[clamp(18px,4vw,40px)] py-[clamp(36px,5vw,64px)] text-center">
        <h2 className="mb-3 text-card">{titulo}</h2>
        <p className="mx-auto mb-6 max-w-[52ch] text-card/75">{texto}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contacto"
            className="inline-block rounded-[var(--radius-button)] bg-terracotta-ink px-7 py-3.5 text-sm font-medium text-card hover:opacity-90 hover:text-card"
          >
            Pedir una visita
          </Link>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-[var(--radius-button)] border border-card/50 px-7 py-3.5 text-sm font-medium text-card hover:border-terracotta hover:text-card"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

/** Aviso destacado, en terracota. Se usa para advertencias que hay que leer. */
export function Aviso({
  titulo,
  children,
}: {
  titulo?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[74ch] rounded-[var(--radius-card)] border border-terracotta/30 bg-terracotta/8 p-[clamp(16px,2.2vw,24px)]">
      {titulo && <h3 className="mb-2">{titulo}</h3>}
      <p className="text-ink">{children}</p>
    </div>
  );
}

/** Nota al pie de sección: letra chica del manual (12px). */
export function Nota({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 max-w-[74ch] text-xs leading-relaxed text-muted">
      {children}
    </p>
  );
}
