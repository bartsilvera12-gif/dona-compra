"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Revelar from "./Revelar";
import { Nota } from "./ui";

/**
 * Las ventajas se muestran con jerarquía: las dos primeras ocupan el doble y
 * llevan foto. Seis tarjetas idénticas no dicen cuál importa más.
 */
const DESTACADAS = [
  {
    t: "Tope de compra más alto",
    d: "Los miembros progresan de nivel antes y acceden a topes mayores sobre el mismo historial de compras.",
    foto: "/assets/rubro-ropa.jpg",
  },
  {
    t: "Ofertas reservadas",
    d: "Pedidos de mayoristas socios que se publican primero en el Club, antes de abrirse al resto.",
    foto: "/assets/rubro-regaleria.jpg",
  },
] as const;

const SECUNDARIAS = [
  ["Visita prioritaria", "La solicitud de un miembro se agenda antes que una solicitud nueva."],
  ["Acompañamiento", "Revisión del historial y sugerencias de reposición según tu rubro."],
  ["Temporadas", "Aviso anticipado de las compras fuertes: escolar, Día de la Madre, fin de año."],
  ["Sin costo adicional", "El Club está incluido en el Pack Doña Compra. No tiene cuota aparte."],
] as const;

const tab = (activa: boolean) =>
  `cursor-pointer rounded-[var(--radius-button)] border px-5 py-3 text-sm font-medium ${
    activa
      ? "border-navy bg-navy text-card"
      : "border-navy/25 bg-transparent text-ink hover:border-terracotta"
  }`;

export default function ClubTabs() {
  const [vista, setVista] = useState<"ventajas" | "acceso">("ventajas");

  return (
    <>
      <div
        role="tablist"
        aria-label="Secciones del Club"
        className="mb-9 flex flex-wrap gap-2"
      >
        <button
          type="button"
          role="tab"
          aria-selected={vista === "ventajas"}
          onClick={() => setVista("ventajas")}
          className={tab(vista === "ventajas")}
        >
          Ventajas
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={vista === "acceso"}
          onClick={() => setVista("acceso")}
          className={tab(vista === "acceso")}
        >
          Acceso de miembros
        </button>
      </div>

      {vista === "ventajas" ? (
        <div>
          <div className="grid gap-4 lg:grid-cols-2">
            {DESTACADAS.map((v, i) => (
              <Revelar key={v.t} retardo={(i + 1) as 1 | 2} as="article">
                <div className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-navy/12 bg-card">
                  <div className="relative aspect-[16/7] bg-grad-start">
                    <Image
                      src={v.foto}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-[clamp(18px,2.4vw,26px)]">
                    <h3 className="mb-2">{v.t}</h3>
                    <p className="text-ink">{v.d}</p>
                  </div>
                </div>
              </Revelar>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {SECUNDARIAS.map(([t, d], i) => (
              <Revelar key={t} retardo={((i % 2) + 1) as 1 | 2}>
                <div className="flex h-full gap-4 rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(16px,2.2vw,22px)]">
                  <span
                    aria-hidden="true"
                    className="w-0.5 flex-none self-stretch rounded bg-terracotta"
                  />
                  <div>
                    <h3 className="mb-1.5 text-[18px]">{t}</h3>
                    <p className="text-[15px] text-ink">{d}</p>
                  </div>
                </div>
              </Revelar>
            ))}
          </div>

          <Revelar>
            <Nota>
              El ingreso al Club y las ventajas descritas dependen del
              historial de compras y quedan sujetos a la evaluación de Doña
              Compra. No constituyen una oferta vinculante.
            </Nota>
            <div className="mt-7">
              <Link
                href="/contacto"
                className="inline-block rounded-[var(--radius-button)] bg-navy px-7 py-3.5 text-sm font-medium text-card hover:bg-navy-deep hover:text-card"
              >
                Quiero sumarme al Club
              </Link>
            </div>
          </Revelar>
        </div>
      ) : (
        <Revelar>
          <div className="max-w-[460px]">
            <h2>Acceso de miembros</h2>
            <p className="mt-4 text-ink">
              Si ya sos miembro, entrá con el correo y la clave que te dimos.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/acceso"
                className="inline-block rounded-[var(--radius-button)] bg-navy px-7 py-3.5 text-sm font-medium text-card hover:bg-navy-deep hover:text-card"
              >
                Entrar
              </Link>
              <Link
                href="/contacto"
                className="inline-block rounded-[var(--radius-button)] border border-navy px-7 py-3.5 text-sm font-medium text-navy"
              >
                No tengo acceso
              </Link>
            </div>
          </div>
        </Revelar>
      )}
    </>
  );
}
