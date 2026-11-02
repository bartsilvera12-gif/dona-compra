"use client";

import { reabrirBanner } from "@/lib/consent";

export default function CookiePrefsButton() {
  return (
    <button
      type="button"
      onClick={reabrirBanner}
      className="cursor-pointer bg-transparent p-0 text-[12.5px] text-card/60 underline hover:text-terracotta-soft"
    >
      Preferencias de cookies
    </button>
  );
}
