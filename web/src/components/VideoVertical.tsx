import { Nota } from "@/components/ui";

/**
 * Reproductor para los videos verticales 9:16 (formato historia).
 *
 * No es componente de cliente a propósito: el <video> del navegador ya trae
 * reproducción, volumen, pantalla completa y teclado, todo accesible. Un
 * reproductor propio en React solo agrega JavaScript y suele perder la mitad
 * de eso por el camino.
 *
 * `preload="none"` es la decisión importante: sin eso el navegador se baja el
 * archivo entero aunque nadie lo mire. Con el póster se ve el primer cuadro
 * y el video recién viaja cuando alguien le da play. En un teléfono con datos
 * medidos, que es como se ve este sitio, la diferencia es real.
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
  /** Ruta a un .vtt. Mientras no exista, se avisa en pantalla. */
  subtitulos?: string;
}) {
  return (
    <figure className="m-0">
      <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[var(--radius-card)] border border-navy/15 bg-navy">
        <video
          className="block aspect-[9/16] w-full"
          src={src}
          poster={poster}
          controls
          playsInline
          preload="none"
          aria-label={titulo}
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
      </div>
      {descripcion && (
        <figcaption className="mx-auto mt-3 max-w-[340px] text-[14.5px] text-ink">
          {descripcion}
        </figcaption>
      )}
      {!subtitulos && (
        <Nota>
          Este video todavía no tiene subtítulos. Se agregan en cuanto esté la
          transcripción.
        </Nota>
      )}
    </figure>
  );
}
