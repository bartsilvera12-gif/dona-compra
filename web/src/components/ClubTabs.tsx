"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, Nota } from "@/components/ui";

const VENTAJAS = [
  ["Tope de compra más alto", "Los miembros progresan de nivel antes y acceden a topes mayores sobre el mismo historial."],
  ["Ofertas reservadas", "Pedidos de mayoristas socios que se publican primero en el Club antes de abrirse al resto."],
  ["Visita prioritaria", "La solicitud de visita de un miembro se agenda antes que una solicitud nueva."],
  ["Acompañamiento", "Revisión del historial de compras y sugerencias de reposición según tu rubro."],
  ["Temporadas", "Aviso anticipado de las compras fuertes: escolar, Día de la Madre, fin de año."],
  ["Sin costo adicional", "El Club está incluido en el Pack Doña Compra. No tiene cuota aparte."],
] as const;

const tab = (activa: boolean) =>
  `cursor-pointer rounded-[var(--radius-button)] border border-navy/25 px-5 py-3 text-sm font-medium ${
    activa ? "bg-navy text-card" : "bg-transparent text-ink hover:border-terracotta"
  }`;

export default function ClubTabs() {
  const [vista, setVista] = useState<"ventajas" | "acceso">("ventajas");

  return (
    <>
      <div role="tablist" aria-label="Secciones del Club" className="mb-8 flex flex-wrap gap-2">
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
          <h2>Ventajas exclusivas</h2>
          <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4">
            {VENTAJAS.map(([t, d]) => (
              <Card key={t}>
                <h3 className="mb-2">{t}</h3>
                <p className="text-ink">{d}</p>
              </Card>
            ))}
          </div>
          <Nota>
            El ingreso al Club y las ventajas descritas dependen del historial
            de compras y quedan sujetos a la evaluación de Doña Compra. No
            constituyen una oferta vinculante.
          </Nota>
        </div>
      ) : (
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
          <p className="mt-5 text-xs text-muted">
            ¿Todavía no sos miembro?{" "}
            <Link href="/contacto" className="font-medium text-terracotta-ink">
              Pedí tu visita
            </Link>{" "}
            y evaluamos tu ingreso.
          </p>
        </div>
      )}
    </>
  );
}
