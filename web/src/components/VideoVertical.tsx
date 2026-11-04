"use client";

import { useRef, useState } from "react";

/**
 * Reproductor para los videos verticales 9:16 (formato historia).
 *
 * El <video> del navegador ya trae reproducción, volumen, pantalla completa y
 * teclado, todo accesible, así que no hay reproductor propio: lo único que se
 * agrega es un botón de play encima del póster.
 *
 * Ese botón no es decorativo. En escritorio, la única forma de arrancar un
 * video que ofrece el navegador es una barra de controles de unos 30 px
 * pegada al borde de abajo. En un 9:16 de 600 px de alto esa barra queda
 * fuera de la pantalla apenas la ventana es un poco baja, y entonces se ve un
 * cuadro quieto sin ninguna forma visible de reproducirlo: parece roto. Con
 * el botón al medio del póster se ve siempre. Una vez que arranca, mandan los
 * controles nativos y el botón desaparece.
 *
 * `preload="none"` es la otra decisión importante: sin eso el navegador se
 * baja el archivo entero aunque nadie lo mire. Con el póster se ve el primer
 * cuadro y el video recién viaja cuando alguien le da play. En un teléfono
 * con datos medidos, que es como se ve este sitio, la diferencia es real.
 */

export default function VideoVertical({
  src,
  poster,
  titulo,
  descripcion,
  subtitulos,
}: {
  src: string;
  poster: string;
  titulo: string;
  descripcion?: string;
  /**
   * Ruta a un .vtt, si alguna vez hay transcripción. Este video trae los
   * subtítulos incrustados en la imagen, que se ven siempre pero no se pueden
   * apagar ni leer con un lector de pantalla; una pista aparte sería mejor.
   */
  subtitulos?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [arrancado, setArrancado] = useState(false);

  async function arrancar() {
    const v = video.current;
    if (!v) return;
    setArrancado(true);
    try {
      await v.play();
    } catch {
      // Si el navegador lo rechaza, que vuelva el botón en vez de dejar un
      // póster mudo.
      setArrancado(false);
    }
  }

  return (
    <figure className="m-0">
      <div className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-[var(--radius-card)] border border-navy/15 bg-navy">
        <video
          ref={video}
          className="block aspect-[9/16] w-full"
          src={src}
          poster={poster}
          controls
          playsInline
          preload="none"
          aria-label={titulo}
          onPlay={() => setArrancado(true)}
        >
          {subtitulos && (
            <track
              kind="subtitles"
              srcLang="es"
              label="Español"
              src={subtitulos}
              default
            />
          )}
        </video>

        {!arrancado && (
          <button
            type="button"
            onClick={arrancar}
            aria-label={`Reproducir el video: ${titulo}`}
            className="absolute inset-0 grid cursor-pointer place-items-center bg-navy/15 transition-colors hover:bg-navy/30"
          >
            <span className="grid h-[72px] w-[72px] place-items-center rounded-full bg-card/95 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]">
              {/* Triángulo corrido 3 px a la derecha: centrado de verdad, un
                  triángulo se ve descentrado dentro de un círculo. */}
              <svg
                viewBox="0 0 24 24"
                width="28"
                height="28"
                aria-hidden="true"
                className="translate-x-[3px] fill-navy"
              >
                <path d="M6 3.5v17l15-8.5z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {descripcion && (
        <figcaption className="mx-auto mt-3 max-w-[340px] text-[14.5px] text-ink">
          {descripcion}
        </figcaption>
      )}
    </figure>
  );
}
