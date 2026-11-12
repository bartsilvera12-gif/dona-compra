import Revelar from "@/components/Revelar";
import { Rotulo } from "@/components/bloques";
import { Wrap } from "@/components/ui";

/**
 * «No somos un banco»: el párrafo a la izquierda y dos tarjetas a la derecha,
 * una con lo que Doña Compra es y otra con lo que no es.
 *
 * Es la sección que la guía del cliente pone primero después de la portada, y
 * tiene razón en ponerla ahí: la pregunta que trae todo el mundo es si esto es
 * un préstamo. Conviene contestarla antes de explicar nada más.
 *
 * Las dos tarjetas se distinguen por el ícono y por el texto, no por el color:
 * una lista verde y una lista roja, sin más, no le dicen nada a quien no
 * distingue esos dos colores —que es cerca de uno de cada doce varones—.
 */

const SOMOS = [
  "Una compradora de confianza",
  "Factura legal electrónica a tu nombre",
  "Acompañamiento en tu negocio",
];

const NO_SOMOS = ["Un banco", "Una financiera", "Un préstamo de plata"];

function Tilde() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M4 12.5l5 5L20 6.5"
        className="stroke-current"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Cruz() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        className="stroke-current"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Tarjeta({
  titulo,
  items,
  marca,
  tono,
}: {
  titulo: string;
  items: string[];
  marca: React.ReactNode;
  tono: "si" | "no";
}) {
  const esSi = tono === "si";
  return (
    <div
      className={`rounded-[var(--radius-card)] border p-[clamp(18px,2.4vw,26px)] ${
        esSi ? "border-salvia/50 bg-card" : "border-navy/12 bg-grad-start"
      }`}
    >
      <h3 className="m-0 text-[clamp(16px,1.9vw,19px)] text-navy">{titulo}</h3>
      <ul className="mt-4 grid list-none gap-2.5 p-0">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-2.5 text-[15px] text-ink">
            <span
              className={`mt-px flex-none ${esSi ? "text-navy-deep" : "text-muted"}`}
            >
              {marca}
            </span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function NoSomosBanco() {
  return (
    <section className="bg-card">
      <Wrap>
        <div className="grid items-start gap-[clamp(28px,4vw,64px)] lg:grid-cols-[minmax(0,40ch)_1fr]">
          <Revelar>
            <Rotulo>Antes que nada</Rotulo>
            <h2 className="mt-4 max-w-[14ch]">No somos un banco.</h2>
            <p className="mt-5 max-w-[46ch] text-ink">
              Doña Compra no es un banco. No te prestamos plata ni tenés que
              hacer trámites de banco. Compramos la mercadería que vos elegís,
              te la vendemos con factura legal y vos la pagás cuando ya la
              vendiste.
            </p>
          </Revelar>

          <Revelar retardo={1}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Tarjeta
                titulo="Lo que somos"
                items={SOMOS}
                marca={<Tilde />}
                tono="si"
              />
              <Tarjeta
                titulo="Lo que no somos"
                items={NO_SOMOS}
                marca={<Cruz />}
                tono="no"
              />
            </div>
          </Revelar>
        </div>
      </Wrap>
    </section>
  );
}
