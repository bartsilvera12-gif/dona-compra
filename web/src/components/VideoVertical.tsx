"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Reproductor para los videos verticales 9:16 (formato historia).
 *
 * Arranca solo cuando entra en pantalla, siempre en silencio. Eso no es un
 * capricho: ningún navegador deja que un video con audio arranque sin que la
 * persona lo haya pedido, y hace bien. Sin sonido sí deja, y este video trae
 * los subtítulos quemados en la imagen, así que se entiende igual. El botón
 * de sonido queda a la vista para quien lo quiera.
 *
 * Cuando el video sale de pantalla se pausa. Un video sonando en una sección
 * que ya nadie está mirando es de las cosas más molestas que puede hacer una
 * página.
 *
 * Se respeta `prefers-reduced-motion`: a quien pidió menos movimiento no se
 * le arranca nada solo, le queda el botón de play.
 *
 * `preload="none"` sigue puesto. El archivo recién viaja cuando el video
 * entra en pantalla, no al abrir la página. En un teléfono con datos medidos,
 * que es como se ve este sitio, la diferencia es real.
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
   * subtítulos incrustados en la imagen: se ven siempre, pero no se pueden
   * apagar ni leer con un lector de pantalla. Una pista aparte sería mejor.
   */
  subtitulos?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [andando, setAndando] = useState(false);
  const [silencio, setSilencio] = useState(true);

  // Arranque automático al entrar en pantalla, pausa al salir.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mirador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          v.muted = true;
          setSilencio(true);
          // Si el navegador igual lo rechaza, queda el botón de play.
          void v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      },
      // 0.35 y no 0.6: un 9:16 es más alto que muchas ventanas, y con un
      // umbral alto hay pantallas donde nunca se cumple y el video no
      // arranca nunca.
      { threshold: 0.35 },
    );

    mirador.observe(v);
    return () => mirador.disconnect();
  }, []);

  const arrancar = useCallback(async () => {
    const v = video.current;
    if (!v) return;
    try {
      await v.play();
    } catch {
      /* el póster queda como estaba */
    }
  }, []);

  const alternarSonido = useCallback(() => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setSilencio(v.muted);
    if (!v.muted && v.paused) void v.play().catch(() => {});
  }, []);

  return (
    // En teléfono el ancho se limita a propósito: a pantalla completa, un
    // 9:16 mide más que la ventana y no se ve nada alrededor.
    <figure className="relative mx-auto my-0 w-full max-w-[320px]">
      {/* Tarjeta terracota girada detrás del video: le da cuerpo al bloque
          sin pedir una imagen más. */}
      <span
        aria-hidden="true"
        className="absolute -inset-x-3 top-7 -bottom-3 -rotate-[2.5deg] rounded-[18px] bg-terracotta/40"
      />

      <div className="relative overflow-hidden rounded-[18px] border border-card/25 bg-navy shadow-[0_30px_60px_-30px_rgba(0,0,0,0.85)]">
        <video
          ref={video}
          className="block aspect-[9/16] w-full"
          src={src}
          poster={poster}
          controls
          playsInline
          loop
          muted
          preload="none"
          aria-label={titulo}
          onPlay={() => setAndando(true)}
          onPause={() => setAndando(false)}
          onVolumeChange={(ev) => setSilencio(ev.currentTarget.muted)}
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

        {/* Botón de play, solo mientras el video está quieto. */}
        {!andando && (
          <button
            type="button"
            onClick={arrancar}
            aria-label={`Reproducir el video: ${titulo}`}
            className="absolute inset-0 grid cursor-pointer place-items-center bg-navy/25 transition-colors hover:bg-navy/40"
          >
            <span className="grid h-[72px] w-[72px] place-items-center rounded-full bg-card/95 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]">
              {/* Triángulo corrido 3 px: centrado de verdad, un triángulo se
                  ve descentrado dentro de un círculo. */}
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

        {/* Sonido. Va arriba para no pisar la barra de controles nativa. */}
        <button
          type="button"
          onClick={alternarSonido}
          aria-pressed={!silencio}
          className="absolute top-3 right-3 flex cursor-pointer items-center gap-1.5 rounded-full border border-card/30 bg-navy-dark/75 py-1.5 pr-3 pl-2.5 text-[11.5px] font-medium tracking-[0.04em] text-card backdrop-blur transition-colors hover:bg-navy-dark"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path
              d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z"
              className="fill-card"
            />
            {silencio ? (
              <path
                d="M16 9.5l5 5m0-5l-5 5"
                className="stroke-terracotta-soft"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              <path
                d="M16 9a4.2 4.2 0 010 6M18.5 6.5a7.5 7.5 0 010 11"
                className="stroke-card"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </svg>
          {silencio ? "Con sonido" : "Silenciar"}
        </button>
      </div>

      {descripcion && (
        <figcaption className="relative mt-3 text-[14.5px] text-card/70">
          {descripcion}
        </figcaption>
      )}
    </figure>
  );
}
