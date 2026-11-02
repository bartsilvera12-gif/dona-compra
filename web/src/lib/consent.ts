"use client";

import { useSyncExternalStore } from "react";

/**
 * Consentimiento de cookies.
 *
 * Se guarda en localStorage del propio navegador, no en una cookie que
 * viajaría en cada petición. Se expone como store externo para que React lo
 * lea con useSyncExternalStore: así no hace falta copiarlo a estado dentro
 * de un efecto, que es justo lo que provoca renders en cascada.
 */

export type Consentimiento = "all" | "essential" | null;

const CLAVE = "dc-consent";
const EVENTO = "dc-consent-change";

/** Cache del último valor leído: getSnapshot debe ser estable entre renders. */
let cache: Consentimiento = null;
let cacheIniciada = false;

function leer(): Consentimiento {
  try {
    const v = window.localStorage.getItem(CLAVE);
    return v === "all" || v === "essential" ? v : null;
  } catch {
    // Modo privado o almacenamiento bloqueado: se trata como sin decisión.
    return null;
  }
}

function suscribir(onChange: () => void) {
  const alCambiar = () => {
    cache = leer();
    onChange();
  };
  window.addEventListener(EVENTO, alCambiar);
  // `storage` avisa de cambios hechos en otras pestañas.
  window.addEventListener("storage", alCambiar);
  return () => {
    window.removeEventListener(EVENTO, alCambiar);
    window.removeEventListener("storage", alCambiar);
  };
}

function snapshot(): Consentimiento {
  if (!cacheIniciada) {
    cache = leer();
    cacheIniciada = true;
  }
  return cache;
}

/** En el servidor no hay decisión todavía. */
function snapshotServidor(): Consentimiento {
  return null;
}

export function useConsentimiento(): Consentimiento {
  return useSyncExternalStore(suscribir, snapshot, snapshotServidor);
}

export function guardarConsentimiento(valor: Exclude<Consentimiento, null>) {
  try {
    window.localStorage.setItem(CLAVE, valor);
  } catch {
    // Si no se puede guardar, la decisión vale al menos para esta visita.
  }
  cache = valor;
  cacheIniciada = true;
  window.dispatchEvent(new CustomEvent(EVENTO));
}

/** Evento aparte: reabrir el banner no cambia la decisión guardada. */
const EVENTO_REABRIR = "dc-consent-reopen";

export function reabrirBanner() {
  window.dispatchEvent(new CustomEvent(EVENTO_REABRIR));
}

export function alReabrir(handler: () => void) {
  window.addEventListener(EVENTO_REABRIR, handler);
  return () => window.removeEventListener(EVENTO_REABRIR, handler);
}
