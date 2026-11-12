/**
 * El juego de íconos de línea del sitio.
 *
 * Están dibujados a mano sobre una grilla de 24 y con un solo grosor de
 * trazo, en vez de traer una librería entera para usar quince: una librería
 * de íconos pesa más que todo el resto del sitio junto, y mezcla estilos de
 * trazo que después se notan.
 *
 * Todos son decorativos. El significado lo lleva el texto que va al lado,
 * nunca el dibujo, así que van con `aria-hidden` sin excepción. Un ícono que
 * tiene que explicarse es un ícono que no funcionó.
 */

export type NombreIcono =
  | "agenda"
  | "estante"
  | "cuaderno"
  | "codigo"
  | "treinta"
  | "cercania"
  | "consejos"
  | "juridica"
  | "seriedad"
  | "local"
  | "cedula"
  | "reunion"
  | "numero"
  | "llave"
  | "factura"
  | "candado"
  | "ropa"
  | "calzado"
  | "bijouterie"
  | "cosmeticos"
  | "perfumes"
  | "peluqueria"
  | "regalos"
  | "libreria"
  | "revendedora"
  | "despensa"
  | "comedor"
  | "restaurante"
  | "banco"
  | "alias"
  | "billetera";

const TRAZOS: Record<NombreIcono, React.ReactNode> = {
  // Cómo funciona
  agenda: (
    <>
      <path d="M4 6h16v15H4z" />
      <path d="M4 10h16M9 3v4M15 3v4" />
      <path d="m8.5 15.5 2 2 4-4" />
    </>
  ),
  estante: (
    <>
      <path d="M3 4h18M3 12h18M3 20h18" />
      <path d="M6 7h4v5H6zM13 8h5v4h-5zM7 15h4v5H7zM14 16h4v4h-4z" />
    </>
  ),
  cuaderno: (
    <>
      <path d="M5 3h12v18H5z" />
      <path d="M5 7H3M5 12H3M5 17H3" />
      <path d="M9 8h4M9 12h4" />
    </>
  ),
  codigo: (
    <>
      <path d="M7 2h10v20H7z" />
      <path d="M10 6h4M10 10h4M10 14h4" />
      <path d="M11 18.5h2" />
    </>
  ),
  treinta: (
    <>
      <path d="M4 6h16v15H4z" />
      <path d="M4 10h16M9 3v4M15 3v4" />
      <text
        x="12"
        y="18.2"
        textAnchor="middle"
        fontSize="6.4"
        fontWeight="700"
        stroke="none"
        fill="currentColor"
      >
        30
      </text>
    </>
  ),

  // Acompañamiento
  cercania: (
    <>
      <path d="M12 21s-7-4.6-7-9.6A4.4 4.4 0 0 1 12 8a4.4 4.4 0 0 1 7 3.4c0 5-7 9.6-7 9.6Z" />
      <path d="M9.5 4.5 12 2l2.5 2.5" />
    </>
  ),
  consejos: (
    <>
      <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
      <path d="m16 8 3-3M19 5h-3M19 5v3" />
    </>
  ),
  juridica: (
    <>
      <path d="M12 3v18M6 21h12" />
      <path d="M4 8h16M7 8l-3 6h6zM17 8l-3 6h6z" />
    </>
  ),
  seriedad: (
    <>
      <path d="M12 2.5 20 6v6c0 5-3.4 8.2-8 9.5-4.6-1.3-8-4.5-8-9.5V6z" />
      <path d="m8.5 12 2.4 2.4L15.5 10" />
    </>
  ),

  // Requisitos
  local: (
    <>
      <path d="M4 10h16v11H4z" />
      <path d="M3 10 4.5 4h15L21 10" />
      <path d="M10 21v-6h4v6" />
    </>
  ),
  cedula: (
    <>
      <path d="M2.5 5h19v14h-19z" />
      <circle cx="8.5" cy="11" r="2.2" />
      <path d="M5 16.5c.6-1.6 2-2.4 3.5-2.4s2.9.8 3.5 2.4M14.5 9.5h4M14.5 13h4" />
    </>
  ),
  reunion: (
    <>
      <circle cx="8" cy="8.5" r="2.8" />
      <circle cx="16.5" cy="10" r="2.3" />
      <path d="M3 19c.7-2.9 2.6-4.4 5-4.4s4.3 1.5 5 4.4M14 19c.5-2 1.6-3.1 3-3.1S19.6 17 20.2 19" />
    </>
  ),

  // Doña te cuida
  numero: (
    <>
      <path d="M7 2h10v20H7z" />
      <path d="M11 18.5h2" />
      <path d="m9.5 9.5 2 2 4-4" />
    </>
  ),
  llave: (
    <>
      <circle cx="7.5" cy="12" r="3.5" />
      <path d="M11 12h10M18 12v3.5M15 12v2.5" />
    </>
  ),
  factura: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9.5 8.5h5M9.5 12h5" />
    </>
  ),
  candado: (
    <>
      <path d="M5 11h14v10H5z" />
      <path d="M8.5 11V7.5a3.5 3.5 0 0 1 7 0V11" />
      <path d="M12 15v2.5" />
    </>
  ),

  // Rubros
  ropa: (
    <>
      <path d="M9 4 4 7l1.5 3.5L8 9.5V20h8V9.5l2.5 1L20 7l-5-3z" />
      <path d="M9 4c0 1.7 1.3 2.6 3 2.6S15 5.7 15 4" />
    </>
  ),
  calzado: (
    <>
      <path d="M3 17V9h3l2.5 2.5h4c3.5 0 6.5 1.6 7.5 3.5v2z" />
      <path d="M3 13h3M9 13.5l1.5 1.5" />
    </>
  ),
  bijouterie: (
    <>
      <path d="M5 4c0 6 3 9 7 9s7-3 7-9" />
      <circle cx="12" cy="17" r="3.2" />
    </>
  ),
  cosmeticos: (
    <>
      <path d="M9 21h6V10H9z" />
      <path d="M10.5 10V5.8c0-1.6.7-2.8 1.5-2.8s1.5 1.2 1.5 2.8V10" />
    </>
  ),
  perfumes: (
    <>
      <path d="M7 10h10v11H7z" />
      <path d="M10 10V7h4v3M11 7V4.5h2V7" />
      <path d="M7 14h10" />
    </>
  ),
  peluqueria: (
    <>
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="18" r="2.5" />
      <path d="m8.3 16.2 8-12M15.7 16.2l-8-12" />
    </>
  ),
  regalos: (
    <>
      <path d="M3 10h18v11H3zM3 10V7h18v3M12 7v14" />
      <path d="M12 7S10.5 3 8.5 3.5 8 7 12 7s3.5-3 1.5-3.5S12 7 12 7Z" />
    </>
  ),
  libreria: (
    <>
      <path d="M4 4h7v16H4zM13 4h7v16h-7z" />
      <path d="M16.5 8v4l-1-1-1 1V8" />
      <path d="M6.5 8h2" />
    </>
  ),
  revendedora: (
    <>
      <path d="M5 8h14l-1.2 13H6.2z" />
      <path d="M9 10V6a3 3 0 0 1 6 0v4" />
    </>
  ),
  despensa: (
    <>
      <path d="M3 9h18l-2 11H5z" />
      <path d="M8 9 10.5 3M16 9 13.5 3" />
    </>
  ),
  comedor: (
    <>
      <circle cx="12" cy="13" r="6.5" />
      <path d="M12 9.5a3.5 3.5 0 0 0 0 7" />
      <path d="M3.5 3v5M21 3v5M19 3v18" />
    </>
  ),
  // Medios de pago
  banco: (
    <>
      <path d="M3 10h18L12 4 3 10Z" />
      <path d="M5.5 10v8M9.5 10v8M14.5 10v8M18.5 10v8" />
      <path d="M3 21h18" />
    </>
  ),
  alias: (
    <>
      <path d="M12 21a9 9 0 1 1 9-9v1.2a2.3 2.3 0 0 1-4.6 0V12" />
      <circle cx="12" cy="12" r="3.4" />
    </>
  ),
  billetera: (
    <>
      <path d="M3 7.5h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.5Z" />
      <path d="M3 7.5 15.5 4v3.5" />
      <circle cx="16.5" cy="13.5" r="1.2" />
    </>
  ),
  restaurante: (
    <>
      <path d="M7 14h10v6H7z" />
      <path d="M7 14c-2.2-.6-3.5-2.2-3.5-4.2C3.5 7 5.7 5 8.5 5c.6-1.3 2-2 3.5-2s2.9.7 3.5 2c2.8 0 5 2 5 4.8 0 2-1.3 3.6-3.5 4.2" />
    </>
  ),
};

export default function Icono({
  nombre,
  tam = 24,
  className = "",
}: {
  nombre: NombreIcono;
  tam?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={tam}
      height={tam}
      aria-hidden="true"
      fill="none"
      className={`flex-none stroke-current ${className}`}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {TRAZOS[nombre]}
    </svg>
  );
}
