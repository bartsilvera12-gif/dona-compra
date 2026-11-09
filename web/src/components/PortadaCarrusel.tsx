"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Portada de tres pantallas que rotan, como la referencia que pasó el
 * cliente: el recorrido contado de a un paso por pantalla.
 *
 * Tres decisiones que no se ven pero importan:
 *
 * 1. Las tres pantallas están siempre en el DOM y se funden con opacidad. La
 *    alternativa —montar y desmontar— deja a un lector de pantalla leyendo
 *    texto que aparece y desaparece solo. Las que no se ven llevan `inert`,
 *    así que no reciben foco ni se leen.
 * 2. El giro automático se detiene al pasar el mouse o al entrar el foco con
 *    el teclado, y no arranca nunca si hay `prefers-reduced-motion`. Una
 *    portada que cambia sola mientras alguien lee es una trampa.
 * 3. Los puntos son botones de verdad, con su etiqueta y su `aria-current`,
 *    no divs con onClick.
 */

export type Pantalla = {
  titulo: React.ReactNode;
  /** Texto para el lector de pantalla y para el aviso de cambio. */
  tituloPlano: string;
  bajada: string;
  foto: { src: string; alt: string };
};

const INTERVALO = 7000;

export default function PortadaCarrusel({
  rotulo,
  pantallas,
  acciones,
}: {
  rotulo: string;
  pantallas: Pantalla[];
  acciones?: React.ReactNode;
}) {
  const [actual, setActual] = useState(0);
  const [quieto, setQuieto] = useState(false);
  const region = useRef<HTMLElement>(null);

  const ir = useCallback(
    (i: number) => setActual((i + pantallas.length) % pantallas.length),
    [pantallas.length],
  );

  useEffect(() => {
    if (quieto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(
      () => setActual((i) => (i + 1) % pantallas.length),
      INTERVALO,
    );
    return () => clearInterval(t);
  }, [quieto, pantallas.length]);

  // Flechas del teclado, solo cuando el foco está dentro de la portada.
  const alPulsar = (ev: React.KeyboardEvent) => {
    if (ev.key === "ArrowRight") {
      ev.preventDefault();
      ir(actual + 1);
    } else if (ev.key === "ArrowLeft") {
      ev.preventDefault();
      ir(actual - 1);
    }
  };

  return (
    <section
      ref={region}
      aria-roledescription="carrusel"
      aria-label="Cómo funciona Doña Compra"
      onMouseEnter={() => setQuieto(true)}
      onMouseLeave={() => setQuieto(false)}
      onFocusCapture={() => setQuieto(true)}
      onBlurCapture={() => setQuieto(false)}
      onKeyDown={alPulsar}
      className="relative overflow-hidden bg-navy text-card"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #f7f5ee 1px, transparent 1.2px)",
          backgroundSize: "26px 26px",
        }}
      />

      {pantallas.map((p, i) => {
        const visible = i === actual;
        return (
          <div
            key={p.tituloPlano}
            // `inert` saca del foco y del lector lo que no se ve. React 19 lo
            // pasa como atributo booleano.
            inert={!visible}
            aria-hidden={!visible}
            className={`transition-opacity duration-700 motion-reduce:transition-none ${
              visible
                ? "relative z-10 opacity-100"
                : "pointer-events-none absolute inset-0 opacity-0"
            }`}
          >
            <div className="mx-auto grid max-w-[1400px] lg:grid-cols-[1.05fr_1fr]">
              <div className="order-2 flex flex-col justify-center px-[clamp(18px,5vw,72px)] py-[clamp(36px,6vw,88px)] lg:order-1">
                <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-terracotta-soft">
                  <span
                    aria-hidden="true"
                    className="h-px w-8 bg-terracotta-soft"
                  />
                  {rotulo}
                </span>
                {i === 0 ? (
                  <h1 className="mt-5 max-w-[14ch] text-[clamp(36px,5.6vw,72px)] leading-[1.02] text-card">
                    {p.titulo}
                  </h1>
                ) : (
                  <p className="mt-5 max-w-[14ch] font-heading text-[clamp(32px,4.8vw,60px)] leading-[1.04] font-semibold text-card">
                    {p.titulo}
                  </p>
                )}
                <p className="mt-6 max-w-[48ch] text-[clamp(16px,1.8vw,19px)] text-card/75">
                  {p.bajada}
                </p>
                {acciones && (
                  <div className="mt-9 flex flex-wrap gap-3">{acciones}</div>
                )}
              </div>

              <div className="relative order-1 min-h-[clamp(260px,52vw,420px)] lg:order-2 lg:min-h-[560px]">
                <Image
                  src={p.foto.src}
                  alt={p.foto.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-[50%_30%]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-navy lg:via-navy/20 lg:to-transparent"
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* Los puntos, sobre la pantalla visible. */}
      <div className="absolute inset-x-0 bottom-5 z-30 flex justify-center gap-2.5 lg:bottom-8 lg:left-[clamp(18px,5vw,72px)] lg:justify-start">
        {pantallas.map((p, i) => (
          <button
            key={p.tituloPlano}
            type="button"
            onClick={() => ir(i)}
            aria-label={`Pantalla ${i + 1} de ${pantallas.length}: ${p.tituloPlano}`}
            aria-current={i === actual ? "true" : undefined}
            className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 motion-reduce:transition-none ${
              i === actual
                ? "w-8 bg-ocre"
                : "w-2.5 bg-card/45 hover:bg-card/75"
            }`}
          />
        ))}
      </div>

      {/* Aviso del cambio para quien no ve la pantalla. */}
      <p aria-live="polite" className="sr-only">
        {pantallas[actual].tituloPlano}
      </p>
    </section>
  );
}
