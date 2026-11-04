"use client";

import { useMemo, useState } from "react";
import {
  analisisAcumulado,
  calcular,
  NIVELES,
  NOMBRE_SERVICIO,
  PAGADOR_RAPIDO_DIAS,
  PAGADOR_RAPIDO_PEDIDOS,
  PLAZO_DIAS,
  type Servicios,
} from "@/lib/niveles";
import { precioGs } from "@/lib/formato";

/**
 * Calculadora de precio final.
 *
 * Sigue el artículo 6 de las CGV: costo mayorista + recargo del nivel + las
 * cinco tarifas fijas de servicios. Es una estimación, no una cotización: el
 * nivel y las condiciones los define la visita, y eso se dice en pantalla y no
 * solo en la letra chica.
 */

const soloDigitos = (v: string) => v.replace(/\D/g, "").slice(0, 12);
const conPuntos = (n: number) =>
  new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 }).format(n);
const pct = (t: number) => `${(t * 100).toFixed(0)} %`;

const CLAVES = Object.keys(NOMBRE_SERVICIO) as (keyof Servicios)[];

export default function Calculadora() {
  const [nivelIdx, setNivelIdx] = useState(0);
  const [texto, setTexto] = useState("125.000");
  const [rapido, setRapido] = useState(false);

  const nivel = NIVELES[nivelIdx];
  const mercaderia = Number(soloDigitos(texto)) || 0;
  const d = useMemo(
    () => calcular(mercaderia, nivel, rapido),
    [mercaderia, nivel, rapido],
  );
  const acumulado = analisisAcumulado(nivel);

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
                <span className="ml-1.5 font-mono text-[12px] opacity-70">
                  {pct(n.recargo)}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-6">
          <label
            htmlFor="calc-mercaderia"
            className="mb-1.5 block text-xs uppercase tracking-[0.08em] text-muted"
          >
            Costo de la mercadería en el mayorista
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
                const n = soloDigitos(e.target.value);
                setTexto(n ? conPuntos(Number(n)) : "");
              }}
              className="w-full border-0 bg-transparent py-3 font-mono text-[17px] text-ink outline-none"
            />
          </div>

          {d.bajoMinimo && (
            <p role="status" className="mt-2.5 text-[13.5px] text-terracotta-ink">
              El pedido mínimo en {nivel.nombre} es de {precioGs(nivel.minimo)}{" "}
              en costo mayorista.
            </p>
          )}
          {d.sobreCupo && (
            <p role="status" className="mt-2.5 text-[13.5px] text-terracotta-ink">
              Supera el cupo de {nivel.nombre}, que es de {precioGs(nivel.tope)}{" "}
              en compras comprometidas a la vez.
            </p>
          )}
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-[var(--radius-card)] border border-navy/12 bg-card p-4">
          <input
            type="checkbox"
            checked={rapido}
            onChange={(e) => setRapido(e.target.checked)}
            className="mt-0.5 h-4 w-4 flex-none accent-[var(--color-terracotta-ink)]"
          />
          <span>
            <span className="block text-[14.5px] font-medium text-navy">
              Tengo el estatus Pagador Rápido
            </span>
            <span className="mt-0.5 block text-[13px] text-muted">
              Un punto menos de recargo. Se obtiene con al menos{" "}
              {PAGADOR_RAPIDO_PEDIDOS} pedidos pagados por completo y un
              promedio de pago menor a {PAGADOR_RAPIDO_DIAS} días desde el
              retiro.
            </span>
          </span>
        </label>

        <div className="mt-5 rounded-[var(--radius-card)] border border-navy/12 bg-card p-5">
          <span className="block text-[11px] uppercase tracking-[0.15em] text-muted">
            Nivel {nivel.nombre}
          </span>
          <dl className="mt-3 grid gap-2 text-[14.5px]">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Cupo de compras</dt>
              <dd className="font-mono text-ink">{precioGs(nivel.tope)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Pedido mínimo</dt>
              <dd className="font-mono text-ink">{precioGs(nivel.minimo)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Recargo estándar</dt>
              <dd className="font-mono text-ink">{pct(nivel.recargo)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Análisis de ingreso</dt>
              <dd className="font-mono text-ink">
                {acumulado === null
                  ? "Solo por ascenso"
                  : precioGs(acumulado)}
              </dd>
            </div>
          </dl>
          <p className="mt-3 border-t border-navy/10 pt-3 text-[13px] text-muted">
            El cupo no es plata que se entrega: es el máximo de mercadería que
            se puede comprar para vos al mismo tiempo.
          </p>
        </div>
      </div>

      <div className="rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(18px,2.6vw,28px)]">
        <h3 className="mb-5">Cómo se arma el precio</h3>

        <dl className="grid gap-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-navy/10 py-3">
            <dt className="text-[15px] font-medium text-navy">
              Mercadería
              <span className="mt-0.5 block text-[12.5px] font-normal text-muted">
                Lo que cuesta en tu mayorista.
              </span>
            </dt>
            <dd className="font-mono text-[16px] text-ink">
              {precioGs(d.mercaderia)}
            </dd>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-navy/10 py-3">
            <dt className="text-[15px] font-medium text-navy">
              Recargo comercial
              <span className="mt-0.5 block text-[12.5px] font-normal text-muted">
                {pct(d.tasa)} sobre el costo mayorista en {nivel.nombre}
                {rapido && ` (${pct(nivel.recargo)} menos un punto)`}.
              </span>
            </dt>
            <dd className="font-mono text-[16px] text-ink">
              {precioGs(d.recargo)}
            </dd>
          </div>

          {CLAVES.map((c) => (
            <div
              key={c}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-navy/10 py-2.5"
            >
              <dt className="text-[14px] text-ink">{NOMBRE_SERVICIO[c]}</dt>
              <dd className="font-mono text-[15px] text-ink">
                {precioGs(nivel.servicios[c])}
              </dd>
            </div>
          ))}

          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-navy/10 py-3">
            <dt className="text-[15px] font-medium text-navy">
              Los cinco Servicios Doña Compra
              <span className="mt-0.5 block text-[12.5px] font-normal text-muted">
                Tarifa fija del nivel. El Pagador Rápido no los cambia.
              </span>
            </dt>
            <dd className="font-mono text-[16px] text-ink">
              {precioGs(d.totalServicios)}
            </dd>
          </div>

          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
            <dt className="font-heading text-[18px] font-bold text-navy">
              Total a pagar en {PLAZO_DIAS} días
            </dt>
            <dd className="font-mono text-[clamp(24px,3.4vw,32px)] font-bold text-terracotta-ink">
              {precioGs(d.total)}
            </dd>
          </div>
        </dl>

        <p className="mt-5 border-t border-navy/10 pt-4 text-xs leading-relaxed text-muted">
          Estimación orientativa. El nivel, el cupo y las condiciones constan en
          la cotización de cada pedido y en las Condiciones Generales firmadas.
          Los {PLAZO_DIAS} días corren desde el retiro efectivo de la mercadería
          en el mayorista, acreditado con el código de recepción. Un atraso
          suspende las compras nuevas al día siguiente del vencimiento.
        </p>
      </div>
    </div>
  );
}
