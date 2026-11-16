import { site } from "@/lib/site";

/**
 * Los botones de Instagram y Facebook.
 *
 * Van como íconos y no como texto porque es lo que la gente busca con la
 * vista en un pie: una fila de marcas redondas. Pero un ícono solo no le dice
 * nada a quien no ve la pantalla, así que cada enlace lleva su nombre
 * accesible completo —«Doña Compra en Instagram»— y el dibujo va con
 * `aria-hidden`. Sin eso, un lector de pantalla anuncia «enlace» y nada más.
 *
 * Los dos trazos son de línea, como el resto de los íconos del sitio, en vez
 * de los logos oficiales a color: sobre el verde del pie, dos cuadraditos de
 * marca ajenos al resto desentonan, y además los logos de marca tienen sus
 * propias reglas de uso. Un contorno reconocible no las pisa.
 *
 * Si falta una de las dos direcciones, ese botón no se dibuja.
 */

const REDES = [
  {
    nombre: "Instagram",
    url: site.instagram,
    trazo: (
      <>
        <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
        <circle cx="12" cy="12" r="4.1" />
        <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    nombre: "Facebook",
    url: site.facebook,
    trazo: (
      <>
        <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
        <path d="M15.2 8.2h-1.6a1.9 1.9 0 0 0-1.9 1.9v10.7M9.6 13.3h5.1" />
      </>
    ),
  },
];

export default function Redes({ className = "" }: { className?: string }) {
  const visibles = REDES.filter((r) => r.url);
  if (visibles.length === 0) return null;

  return (
    <ul className={`m-0 flex list-none items-center gap-2.5 p-0 ${className}`}>
      {visibles.map((r) => (
        <li key={r.nombre}>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${site.name} en ${r.nombre}`}
            className="grid h-10 w-10 place-items-center rounded-full border border-card/25 text-card/80 transition-colors hover:border-terracotta-soft hover:text-terracotta-soft"
          >
            <svg
              viewBox="0 0 24 24"
              width="19"
              height="19"
              aria-hidden="true"
              fill="none"
              className="stroke-current"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {r.trazo}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
