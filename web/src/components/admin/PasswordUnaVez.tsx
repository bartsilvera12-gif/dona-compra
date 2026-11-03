"use client";

import { useState } from "react";

/**
 * Muestra una contraseña recién generada, una sola vez.
 *
 * No queda guardada en claro en ningún lado: si se pierde, hay que
 * restablecerla. El aviso lo dice con todas las letras, porque es la clase de
 * cosa que se cierra sin leer y después se reclama.
 */
export default function PasswordUnaVez({
  password,
  correo,
}: {
  password: string;
  correo?: string;
}) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(password);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Si el navegador no deja copiar, el texto está a la vista igual.
    }
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-terracotta/45 bg-terracotta/8 p-[clamp(16px,2.2vw,22px)]">
      <h3 className="mb-2 text-[18px]">Contraseña inicial</h3>
      <p className="mb-4 text-[14.5px] text-ink">
        Se muestra <strong>una sola vez</strong>. Pasásela a{" "}
        {correo ? <strong>{correo}</strong> : "la persona"} por un medio seguro
        y guardala ahora si hace falta: no queda almacenada en claro, así que
        si se pierde hay que restablecerla.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <code className="select-all rounded-[var(--radius-button)] border border-navy/20 bg-card px-4 py-2.5 font-mono text-[16px] text-navy">
          {password}
        </code>
        <button
          type="button"
          onClick={copiar}
          className="cursor-pointer rounded-[var(--radius-button)] border border-navy/25 px-4 py-2.5 text-[13.5px] text-ink hover:border-terracotta"
        >
          {copiado ? "Copiado" : "Copiar"}
        </button>
        {copiado && (
          <span role="status" className="text-[13px] text-ok">
            En el portapapeles.
          </span>
        )}
      </div>

      <p className="mt-4 text-xs text-muted">
        Conviene que la persona la cambie al entrar, desde Mi cuenta.
      </p>
    </div>
  );
}
