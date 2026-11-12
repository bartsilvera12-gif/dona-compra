/**
 * La cinta de cuatro frases que va debajo de la portada, la misma del flyer.
 *
 * En pantalla ancha entran las cuatro en una fila y se quedan quietas. En
 * celular no entran, así que la cinta se desplaza sola —la guía lo pide—, y
 * para eso la lista va duplicada: la copia entra por la derecha justo cuando
 * la primera termina de salir, y el movimiento no tiene costura. La copia
 * lleva `aria-hidden`, porque para un lector de pantalla las frases son
 * cuatro, no ocho.
 *
 * Con `prefers-reduced-motion` la animación no corre y la cinta se puede
 * arrastrar con el dedo. Texto que se mueve solo y no se puede parar es,
 * para alguien con dislexia o vértigo, texto que no se puede leer.
 */

const FRASES = [
  { icono: "factura", texto: "Factura legal electrónica" },
  { icono: "whatsapp", texto: "Todo por WhatsApp" },
  { icono: "tienda", texto: "Tu mayorista de siempre" },
  { icono: "calendario", texto: "Pagá tu factura en 30 días" },
] as const;

type Icono = (typeof FRASES)[number]["icono"];

function Icono({ nombre }: { nombre: Icono }) {
  const trazos: Record<Icono, React.ReactNode> = {
    factura: (
      <>
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
        <path d="M9 8h6M9 12h6" />
      </>
    ),
    whatsapp: (
      <>
        <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20Z" />
        <path d="M9 10c.5 2 2 3.5 4 4" />
      </>
    ),
    tienda: (
      <>
        <path d="M4 9h16v11H4V9Z" />
        <path d="M3 9l1.5-5h15L21 9" />
        <path d="M10 20v-6h4v6" />
      </>
    ),
    calendario: (
      <>
        <path d="M4 6h16v15H4V6Z" />
        <path d="M4 10h16M9 3v4M15 3v4" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      aria-hidden="true"
      fill="none"
      className="flex-none stroke-current"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {trazos[nombre]}
    </svg>
  );
}

function Lista({ copia = false }: { copia?: boolean }) {
  return (
    <ul
      aria-hidden={copia || undefined}
      className="m-0 flex flex-none list-none items-center gap-[clamp(26px,5vw,64px)] p-0 md:w-full md:justify-center"
    >
      {FRASES.map((f) => (
        <li
          key={f.texto}
          className="flex flex-none items-center gap-2.5 text-[clamp(13px,1.5vw,15px)] font-medium whitespace-nowrap text-navy"
        >
          <Icono nombre={f.icono} />
          {f.texto}
        </li>
      ))}
    </ul>
  );
}

export default function CintaBeneficios() {
  return (
    <div className="overflow-hidden border-y border-navy/10 bg-ocre py-[clamp(12px,1.6vw,18px)]">
      {/* En celular la cinta se arrastra con el dedo además de moverse sola,
          que es la salida cuando la animación está apagada. */}
      <div className="overflow-x-auto px-[clamp(18px,4vw,40px)] [-ms-overflow-style:none] [scrollbar-width:none] md:overflow-x-hidden [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max items-center gap-[clamp(26px,5vw,64px)] motion-safe:animate-[cinta_26s_linear_infinite] md:w-full md:animate-none">
          <Lista />
          <span aria-hidden="true" className="md:hidden">
            <Lista copia />
          </span>
        </div>
      </div>
    </div>
  );
}
