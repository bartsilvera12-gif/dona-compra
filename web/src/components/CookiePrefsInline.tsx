"use client";

import { reabrirBanner } from "@/lib/consent";

/** Botón de la página jurídica para reabrir el banner de cookies. */
export default function CookiePrefsInline() {
  return (
    <button
      type="button"
      onClick={reabrirBanner}
      className="mt-2 cursor-pointer rounded-[var(--radius-button)] bg-navy px-7 py-3.5 text-sm font-medium text-card hover:bg-navy-deep"
    >
      Cambiar mis preferencias de cookies
    </button>
  );
}
