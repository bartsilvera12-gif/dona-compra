import { site, waLink } from "@/lib/site";

/**
 * Burbuja de WhatsApp, fija abajo a la derecha.
 *
 * Va en verde oscuro de marca y no en el verde de WhatsApp: la carta gráfica
 * dice que sus cuatro colores valen para todos los soportes, el sitio
 * incluido. Lo que hace reconocible al botón es el ícono, no el fondo.
 *
 * `z-100` la deja por debajo del aviso de cookies (`z-110`), que ocupa el
 * borde inferior: mientras el aviso está abierto la burbuja queda detrás en
 * vez de taparlo.
 *
 * No es componente de cliente: es un enlace. Un enlace no necesita
 * JavaScript, funciona con el teclado solo y se puede abrir en otra pestaña
 * con el botón del medio, cosa que un div con onClick pierde.
 */
export default function BurbujaWhatsApp() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Escribir por WhatsApp al ${site.phone}`}
      className="group fixed right-[clamp(16px,3vw,28px)] bottom-[clamp(16px,3vw,28px)] z-100 flex h-14 w-14 items-center justify-center rounded-full border border-ocre/70 bg-navy text-card shadow-[0_12px_30px_-10px_rgba(20,44,32,0.7)] transition-transform duration-200 hover:scale-105 hover:bg-navy-deep hover:text-card focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100"
    >
      <svg
        viewBox="0 0 32 32"
        width="27"
        height="27"
        aria-hidden="true"
        className="fill-current"
      >
        <path d="M16.04 3.2c-7.1 0-12.87 5.77-12.87 12.87 0 2.27.6 4.49 1.73 6.45L3.1 29.2l6.85-1.79a12.82 12.82 0 0 0 6.09 1.55h.01c7.1 0 12.87-5.77 12.87-12.87S23.14 3.2 16.04 3.2Zm0 23.56h-.01a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-4.06 1.06 1.08-3.96-.25-.41a10.66 10.66 0 0 1-1.63-5.66c0-5.9 4.8-10.7 10.71-10.7 2.86 0 5.55 1.12 7.57 3.14a10.63 10.63 0 0 1 3.13 7.57c0 5.9-4.8 10.68-10.7 10.68Zm5.87-8c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.51-.16-.73.16-.21.32-.83 1.05-1.02 1.26-.19.22-.37.24-.69.08-.32-.16-1.36-.5-2.58-1.6a9.7 9.7 0 0 1-1.79-2.23c-.19-.32-.02-.5.14-.66.15-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.54-.73-.55l-.62-.01c-.21 0-.56.08-.86.4-.29.32-1.12 1.1-1.12 2.68s1.15 3.1 1.31 3.32c.16.21 2.26 3.45 5.48 4.84.77.33 1.36.53 1.82.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    </a>
  );
}
