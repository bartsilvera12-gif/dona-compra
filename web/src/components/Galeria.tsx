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

export default function Galeria({ fotos }: { fotos: Foto[] }) {
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
      <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3">
        {fotos.map((f, i) => (
          <li key={f.src}>
            <button
              type="button"
              onClick={() => abrir(i)}
              className="group block w-full cursor-pointer overflow-hidden rounded-[var(--radius-card)] border border-navy/12 bg-card p-0"
            >
              <span className="relative block aspect-[4/3]">
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
