"use client";

import { useActionState, useState } from "react";
import {
  alternarMeGusta,
  type EstadoReaccion,
} from "@/app/anuncios/actions";

const boton =
  "cursor-pointer rounded-[var(--radius-button)] border border-navy/18 px-5 py-2.5 text-[13.5px] disabled:opacity-60";

export default function Acciones({
  slug,
  titulo,
  texto,
  meGusta,
  activo,
}: {
  slug: string;
  titulo: string;
  texto: string;
  meGusta: number;
  activo: boolean;
}) {
  const [estado, accion, pendiente] = useActionState(
    alternarMeGusta.bind(null, slug),
    { meGusta, activo } satisfies EstadoReaccion,
  );
  const [avisoCompartir, setAvisoCompartir] = useState("");

  async function compartir() {
    const url = `${window.location.origin}/anuncios/${slug}`;
    // La API nativa abre la hoja de compartir del teléfono.
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, text: texto, url });
        return;
      } catch {
        // Si la persona cancela, no es un error: seguimos al respaldo.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setAvisoCompartir("Enlace copiado.");
      setTimeout(() => setAvisoCompartir(""), 2500);
    } catch {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${titulo} — ${url}`)}`,
        "_blank",
        "noopener",
      );
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <form action={accion}>
        <button
          type="submit"
          disabled={pendiente}
          aria-pressed={estado.activo}
          className={`${boton} ${
            estado.activo
              ? "border-terracotta bg-terracotta/10 text-terracotta-ink"
              : "text-ink hover:border-terracotta"
          }`}
        >
          ♥ {estado.activo ? "Te gusta" : "Me gusta"}
          {estado.meGusta > 0 && (
            <span className="ml-1.5 text-muted">({estado.meGusta})</span>
          )}
        </button>
      </form>

      <button type="button" onClick={compartir} className={`${boton} text-ink hover:border-terracotta`}>
        Compartir
      </button>

      {avisoCompartir && (
        <span role="status" className="text-[13px] text-ok">
          {avisoCompartir}
        </span>
      )}
      {estado.error && (
        <span role="status" className="text-[13px] text-error-ink">
          {estado.error}
        </span>
      )}
    </div>
  );
}
