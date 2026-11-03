"use client";

import { useMemo, useState } from "react";
import { calcular, MARGEN, NIVELES } from "@/lib/niveles";
import { precioGs } from "@/lib/formato";

/**
 * Calculadora de precio final.
 *
 * Es una estimación, no una cotización: el nivel y las condiciones los define
 * la visita. El texto lo dice en pantalla, no solo en la letra chica.
 */

const soloDigitos = (v: string) => v.replace(/\D/g, "").slice(0, 12);
const conPuntos = (n: number) =>
  new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 }).format(n);

export default function Calculadora() {
  const [nivelIdx, setNivelIdx] = useState(0);
  const [texto, setTexto] = useState("125.000");

  const nivel = NIVELES[nivelIdx];
  const mercaderia = Number(soloDigitos(texto)) || 0;
  const d = useMemo(() => calcular(mercaderia, nivel), [mercaderia, nivel]);

  const filas = [
    ["Mercadería", d.mercaderia, "Lo que cuesta en tu proveedor."],
    ["Margen comercial", d.margen, `${(MARGEN * 100).toFixed(0)} % sobre la mercadería, igual en todos los niveles.`],
    ["Seguro", d.seguro, "Fijo por pedido."],
    ["Análisis", d.analisis, "Fijo por pedido."],
    ["Pack Doña Compra", d.pack, `Depende del nivel. En ${nivel.nombre}: ${precioGs(nivel.pack)}.`],
  ] as const;

  return (
    <div className="grid gap-[clamp(20px,3vw,40px)] lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <fieldset className="border-0 p-0">
          <legend className="mb-3 block text-xs uppercase tracking-[0.08em] text-muted">
            Tu nivel
          </legend>
          <div className="flex flex-wrap gap-2">
            {NIVELES.map((n, i) => (
              <button
                key={n.nombre}
                type="button"
                onClick={() => setNivelIdx(i)}
                aria-pressed={i === nivelIdx}
                className={`cursor-pointer rounded-[var(--radius-button)] border px-4 py-2 text-[13.5px] font-medium ${
                  i === nivelIdx
                    ? "border-navy bg-navy text-card"
                    : "border-navy/25 text-ink hover:border-terracotta"
                }`}
              >
                {n.nombre}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-6">
          <label
            htmlFor="calc-mercaderia"
            className="mb-1.5 block text-xs uppercase tracking-[0.08em] text-muted"
          >
            Precio de compra de la mercadería
          </label>
          <div className="flex items-center gap-2 rounded-[var(--radius-button)] border border-navy/25 bg-card px-3.5 focus-within:border-terracotta">
            <span aria-hidden="true" className="font-mono text-[15px] text-muted">
              Gs.
            </span>
            <input
              id="calc-mercaderia"
              type="text"
              inputMode="numeric"
              value={texto}
              onChange={(e) => {
                const d = soloDigitos(e.target.value);
                setTexto(d ? conPuntos(Number(d)) : "");
              }}
              className="w-full border-0 bg-transparent py-3 font-mono text-[17px] text-ink outline-none"
            />
          </div>

          {d.bajoMinimo && (
            <p role="status" className="mt-2.5 text-[13.5px] text-terracotta-ink">
              El pedido mínimo en {nivel.nombre} es de {precioGs(nivel.minimo)} en
              precio de compra.
            </p>
          )}
        </div>

        <div className="mt-6 rounded-[var(--radius-card)] border border-navy/12 bg-card p-5">
          <span className="block text-[11px] uppercase tracking-[0.15em] text-muted">
            Nivel {nivel.nombre}
          </span>
          <dl className="mt-3 grid gap-2 text-[14.5px]">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Tope acumulado</dt>
              <dd className="font-mono text-ink">{precioGs(nivel.tope)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Pedido mínimo</dt>
              <dd className="font-mono text-ink">{precioGs(nivel.minimo)}</dd>
            </div>
          </dl>
          <p className="mt-3 border-t border-navy/10 pt-3 text-[13.5px] text-ink">
            {nivel.nota}
          </p>
        </div>
      </div>

      <div className="rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(18px,2.6vw,28px)]">
        <h3 className="mb-5">Cómo se arma el precio</h3>

        <dl className="grid gap-0">
          {filas.map(([etiqueta, valor, nota]) => (
            <div
              key={etiqueta}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-navy/10 py-3"
            >
              <dt className="text-[15px] font-medium text-navy">
                {etiqueta}
                <span className="mt-0.5 block text-[12.5px] font-normal text-muted">
                  {nota}
                </span>
              </dt>
              <dd className="font-mono text-[16px] text-ink">{precioGs(valor)}</dd>
            </div>
          ))}

          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-navy/10 py-3">
            <dt className="text-[15px] font-medium text-navy">
              Servicios del pedido
              <span className="mt-0.5 block text-[12.5px] font-normal text-muted">
                Seguro, análisis y Pack, sumados.
              </span>
            </dt>
            <dd className="font-mono text-[16px] text-ink">
              {precioGs(d.servicios)}
            </dd>
          </div>

          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
            <dt className="font-heading text-[18px] font-bold text-navy">
              Total a pagar en 30 días
            </dt>
            <dd className="font-mono text-[clamp(24px,3.4vw,32px)] font-bold text-terracotta-ink">
              {precioGs(d.total)}
            </dd>
          </div>
        </dl>

        <p className="mt-5 border-t border-navy/10 pt-4 text-xs leading-relaxed text-muted">
          Estimación orientativa. El nivel inicial, el tope y las condiciones de
          pago se definen en la visita y constan en el acuerdo firmado. No
          aplicamos multas ni intereses por atraso.
        </p>
      </div>
    </div>
  );
}
