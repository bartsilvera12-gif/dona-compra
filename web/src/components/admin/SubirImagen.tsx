"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { subirImagen, type EstadoSubida } from "@/app/admin/publicaciones/subir";

function Boton({ disponible }: { disponible: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || !disponible}
      className="cursor-pointer rounded-[var(--radius-button)] border border-navy/25 px-4 py-2.5 text-[13.5px] text-ink hover:border-terracotta disabled:opacity-50"
    >
      {pending ? "Procesando…" : "Subir"}
    </button>
  );
}

/**
 * Sube una imagen y avisa al formulario con qué URL quedó.
 *
 * Va en su propio formulario, separado del de la publicación: así subir no
 * envía ni valida el resto de los campos.
 */
export default function SubirImagen({
  disponible,
  onSubida,
}: {
  disponible: boolean;
  onSubida: (url: string) => void;
}) {
  const [estado, accion] = useActionState(
    subirImagen,
    {} satisfies EstadoSubida,
  );

  // Cuando llega la URL, se la pasa al campo de imagen del formulario.
  useEffect(() => {
    if (estado.ok && estado.url) onSubida(estado.url);
  }, [estado, onSubida]);

  return (
    <div className="rounded-[var(--radius-button)] border border-dashed border-navy/25 p-4">
      <form action={accion} className="flex flex-wrap items-center gap-3">
        <label htmlFor="archivo" className="sr-only">
          Archivo de imagen
        </label>
        <input
          id="archivo"
          name="archivo"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          disabled={!disponible}
          className="max-w-full flex-1 text-[13.5px] text-ink file:mr-3 file:cursor-pointer file:rounded-[var(--radius-button)] file:border-0 file:bg-navy file:px-4 file:py-2 file:text-[13px] file:text-card disabled:opacity-50"
        />
        <Boton disponible={disponible} />
      </form>

      {!disponible && (
        <p className="mt-3 text-xs text-muted">
          La subida de archivos no está configurada. Falta{" "}
          <code className="rounded bg-navy/8 px-1.5 py-0.5">
            BLOB_READ_WRITE_TOKEN
          </code>
          . Mientras tanto, cargá la imagen por ruta o URL en el campo de
          arriba.
        </p>
      )}

      {estado.aviso && (
        <p
          role={estado.ok ? "status" : "alert"}
          className={`mt-3 text-[13.5px] ${
            estado.ok ? "text-ok" : "text-error-ink"
          }`}
        >
          {estado.aviso}
        </p>
      )}
      {estado.detalle && (
        <p className="mt-1 text-xs text-muted">{estado.detalle}</p>
      )}

      {disponible && !estado.aviso && (
        <p className="mt-3 text-xs text-muted">
          JPEG, PNG, WebP, AVIF o GIF, hasta 8 MB. Se convierte a WebP, se
          achica a 1600 px de lado mayor y se le borran los metadatos, incluida
          la ubicación GPS que suelen dejar las cámaras de teléfono.
        </p>
      )}
    </div>
  );
}
