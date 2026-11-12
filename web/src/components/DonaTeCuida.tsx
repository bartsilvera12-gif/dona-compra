import Icono from "@/components/Iconos";
import Revelar from "@/components/Revelar";
import { CUIDA, CUIDA_TITULO } from "@/lib/guia";
import { site } from "@/lib/site";
import { Wrap } from "@/components/ui";

/**
 * «Doña te cuida»: la franja de cuatro señales de seguridad.
 *
 * Es la sección que previene la estafa, así que está escrita para que sirva
 * de algo y no solo para tranquilizar. Por eso el número oficial va escrito
 * acá, completo: «tenemos un único número oficial» no ayuda a nadie si el
 * número no está a la vista para comparar.
 *
 * Va sobre fondo claro, como pide la guía. Una advertencia sobre fondo oscuro
 * y con candados rojos asusta; esto tiene que leerse como una regla de la
 * casa, no como una alarma.
 */

export default function DonaTeCuida() {
  return (
    <section className="border-y border-navy/10 bg-salvia/25">
      <Wrap className="py-[clamp(32px,4.5vw,56px)]">
        <Revelar>
          <div className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 text-center">
            <h2 className="m-0 text-[clamp(20px,2.6vw,28px)]">
              {CUIDA_TITULO}
            </h2>
            <p className="m-0 text-[15px] text-muted">
              Nuestro único número es el {site.phone}.
            </p>
          </div>
        </Revelar>

        <ul className="mt-8 grid list-none grid-cols-2 gap-x-5 gap-y-6 p-0 lg:grid-cols-4">
          {CUIDA.map((c, i) => (
            <Revelar
              as="li"
              key={c.texto}
              retardo={((i % 4) + 1) as 1 | 2 | 3 | 4}
              className="flex flex-col items-center gap-3 text-center"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-card text-navy">
                <Icono nombre={c.icono} tam={23} />
              </span>
              <span className="text-[14.5px] leading-snug font-medium text-navy">
                {c.texto}
              </span>
            </Revelar>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}
