"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Galería con lightbox.
 *
 * Usa <dialog> nativo en vez de un div con position:fixed. No es un detalle
 * estético: showModal() trae gratis lo que de otra forma hay que escribir a
 * mano y casi siempre queda mal — el foco queda atrapado adentro, Esc cierra,
 * el resto de la página queda inerte para el lector de pantalla, y al cerrar
 * el foco vuelve al botón que abrió. Nada de eso funciona con un div.
 */

export type Foto = {
  src: string;
  /** Versión chica para la miniatura; si falta se usa `src`. */
  mini?: string;
  alt: string;
  pie?: string;
};

/**
 * El desnivel y el giro del muro.
 *
 * Son cuatro valores fijos y distintos a propósito: una fila de tarjetas
 * perfectamente alineadas y rectas se lee como un banco de imágenes. Con un
 * grado de giro y unos píxeles de diferencia parecen fotos pegadas en la
 * pared del local, que es de donde salen. Al pasar por encima se enderezan.
 */
const GIRO = [
  "-rotate-[1.3deg]",
  "rotate-[0.9deg]",
  "-rotate-[0.7deg]",
  "rotate-[1.5deg]",
];
/* Margen y no translate: el translate se lo lleva el hover. */
const DESNIVEL = ["lg:mt-0", "lg:mt-8", "lg:mt-2", "lg:mt-10"];

export default function Galeria({
  fotos,
  columnas = 3,
  formato = "4/3",
  variante = "rejilla",
}: {
  fotos: Foto[];
  /** Columnas en pantalla ancha. En teléfono siempre son dos. */
  columnas?: 2 | 3;
  /**
   * Recorte de la miniatura. Para fotos de ambiente, 4/3. Para imágenes con
   * texto —una pizarra, una tabla— conviene 16/9: el 4/3 les come el borde
   * de arriba y el de abajo, que es justo donde suele estar el título.
   */
  formato?: "4/3" | "16/9";
  /**
   * «rejilla» es la galería de siempre. «muro» son tarjetas con marco,
   * numeradas, giradas y a distinta altura, para cuando la galería es el
   * motivo de la sección y no un anexo.
   */
  variante?: "rejilla" | "muro";
}) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [abierta, setAbierta] = useState<number | null>(null);

  const abrir = useCallback((i: number) => {
    setAbierta(i);
    dialogo.current?.showModal();
  }, []);

  const cerrar = useCallback(() => {
    dialogo.current?.close();
  }, []);

  const mover = useCallback(
    (paso: number) => {
      setAbierta((i) =>
        i === null ? null : (i + paso + fotos.length) % fotos.length,
      );
    },
    [fotos.length],
  );

  // Las flechas del teclado solo tienen sentido mientras el diálogo está
  // abierto; fuera de ahí robarían la navegación normal de la página.
  useEffect(() => {
    if (abierta === null) return;
    const alPulsar = (ev: KeyboardEvent) => {
      if (ev.key === "ArrowRight") {
        ev.preventDefault();
        mover(1);
      } else if (ev.key === "ArrowLeft") {
        ev.preventDefault();
        mover(-1);
      }
    };
    document.addEventListener("keydown", alPulsar);
    return () => document.removeEventListener("keydown", alPulsar);
  }, [abierta, mover]);

  const foto = abierta === null ? null : fotos[abierta];

  return (
    <>
      {variante === "muro" ? (
        <ul className="grid list-none grid-cols-2 gap-x-4 gap-y-7 p-0 lg:grid-cols-4">
          {fotos.map((f, i) => (
            <li key={f.src} className={DESNIVEL[i % DESNIVEL.length]}>
              <button
                type="button"
                onClick={() => abrir(i)}
                className={`group block w-full cursor-pointer rounded-[14px] border border-navy/12 bg-card p-2 text-left shadow-[0_18px_40px_-26px_rgba(26,54,93,0.85)] transition duration-300 hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[0_26px_50px_-24px_rgba(26,54,93,0.9)] ${
                  GIRO[i % GIRO.length]
                }`}
              >
                <span className="relative block aspect-[3/2] overflow-hidden rounded-[9px] bg-grad-start">
                  <Image
                    src={f.mini ?? f.src}
                    alt={f.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-2 left-2 grid h-6 w-6 place-items-center rounded-full bg-terracotta text-[11px] font-semibold text-card shadow-[0_4px_10px_-4px_rgba(0,0,0,0.6)]"
                  >
                    {i + 1}
                  </span>
                  {/* Lupa al pasar por encima: la señal de que la imagen se
                      amplía, sin ocupar lugar mientras nadie la mira. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-2 bottom-2 grid h-8 w-8 place-items-center rounded-full bg-card/95 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <circle
                        cx="10.5"
                        cy="10.5"
                        r="6.5"
                        className="stroke-navy"
                        strokeWidth="2"
                      />
                      <path
                        d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6"
                        className="stroke-navy"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </span>
                <span className="block px-1 pt-2.5 pb-1 text-[13px] leading-snug text-ink">
                  {f.pie ?? f.alt}
                  <span className="sr-only"> — ampliar</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul
          className={`grid list-none grid-cols-2 gap-3 p-0 ${
            columnas === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"
          }`}
        >
          {fotos.map((f, i) => (
            <li key={f.src}>
              <button
                type="button"
                onClick={() => abrir(i)}
                className="group block w-full cursor-pointer overflow-hidden rounded-[var(--radius-card)] border border-navy/12 bg-card p-0"
              >
                <span
                  className={`relative block ${
                    formato === "16/9" ? "aspect-[16/9]" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={f.mini ?? f.src}
                    alt={f.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </span>
                <span className="block px-3 py-2.5 text-left text-[13.5px] text-ink">
                  {f.pie ?? f.alt}
                  <span className="sr-only"> — ampliar</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogo}
        onClose={() => setAbierta(null)}
        aria-label="Imagen ampliada"
        // El clic sobre el ::backdrop llega al propio <dialog>, no a su
        // contenido: comparando el objetivo con el diálogo se cierra al tocar
        // fuera sin interceptar los clics de adentro.
        onClick={(ev) => {
          if (ev.target === dialogo.current) cerrar();
        }}
        className="m-auto max-h-[92dvh] w-[min(1100px,94vw)] rounded-[var(--radius-card)] border border-navy/20 bg-card p-0 backdrop:bg-navy/70"
      >
        {foto && (
          <figure className="m-0 grid gap-0">
            <div className="relative aspect-[16/9] w-full bg-navy">
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="94vw"
                className="object-contain"
              />
            </div>
            <figcaption className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <p className="m-0 text-[14.5px] text-ink">{foto.pie ?? foto.alt}</p>
              <div className="flex items-center gap-2">
                <span aria-live="polite" className="text-xs text-muted">
                  {(abierta ?? 0) + 1} de {fotos.length}
                </span>
                <button
                  type="button"
                  onClick={() => mover(-1)}
                  className="cursor-pointer rounded-[var(--radius-button)] border border-navy/30 px-3 py-1.5 text-sm text-navy"
                >
                  <span aria-hidden="true">←</span>
                  <span className="sr-only">Anterior</span>
                </button>
                <button
                  type="button"
                  onClick={() => mover(1)}
                  className="cursor-pointer rounded-[var(--radius-button)] border border-navy/30 px-3 py-1.5 text-sm text-navy"
                >
                  <span aria-hidden="true">→</span>
                  <span className="sr-only">Siguiente</span>
                </button>
                <button
                  type="button"
                  onClick={cerrar}
                  className="cursor-pointer rounded-[var(--radius-button)] bg-navy px-4 py-1.5 text-sm text-card"
                >
                  Cerrar
                </button>
              </div>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
