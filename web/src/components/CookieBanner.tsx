"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import {
  alReabrir,
  guardarConsentimiento,
  useConsentimiento,
} from "@/lib/consent";
import { site } from "@/lib/site";

export default function CookieBanner() {
  const consent = useConsentimiento();
  const [detalle, setDetalle] = useState(false);
  const [reabierto, setReabierto] = useState(false);

  // Suscripción a un sistema externo: no escribe estado derivado del render.
  useEffect(
    () =>
      alReabrir(() => {
        setReabierto(true);
        setDetalle(true);
      }),
    [],
  );

  // Se muestra si no hay decisión, o si pidieron reabrirlo desde el footer.
  const visible = consent === null || reabierto;

  const decidir = (v: "all" | "essential") => {
    guardarConsentimiento(v);
    setReabierto(false);
    setDetalle(false);
  };

  return (
    <>
      {/* Analítica: solo con consentimiento explícito y solo si hay ID. */}
      {consent === "all" && site.gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${site.gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {visible && (
        <div
          role="dialog"
          aria-label="Preferencias de cookies"
          className="fixed inset-x-0 bottom-0 z-110 border-t-2 border-terracotta bg-navy-dark px-[clamp(18px,4vw,40px)] py-[clamp(16px,2.5vw,24px)]"
        >
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-[clamp(14px,2.5vw,32px)]">
            <div className="min-w-[260px] flex-1">
              <h2 className="mb-1.5 font-heading text-[17px] font-semibold text-card">
                Privacidad
              </h2>
              {/* Registro neutro, ni vos ni usted: este aviso aparece en todas
                  las páginas, incluida Mayoristas, que va de usted. La hoja
                  pide redacción neutra y formal para las menciones jurídicas. */}
              <p className="m-0 max-w-[70ch] text-sm text-card/75">
                Este sitio usa cookies necesarias para funcionar. Las cookies de
                medición, que sirven para saber qué páginas se visitan más, se
                agregan solo con autorización previa. La decisión puede
                cambiarse en cualquier momento.
              </p>

              {detalle && (
                <div className="mt-4 grid max-w-[70ch] gap-2.5">
                  <div className="rounded-[var(--radius-card)] bg-card/6 p-3.5">
                    <strong className="mb-1 block text-sm text-card">
                      Necesarias · siempre activas
                    </strong>
                    <span className="text-[13px] text-card/65">
                      Guardan únicamente tu decisión sobre este banner.
                    </span>
                  </div>
                  <div className="rounded-[var(--radius-card)] bg-card/6 p-3.5">
                    <strong className="mb-1 block text-sm text-card">
                      Medición · opcional
                    </strong>
                    <span className="text-[13px] text-card/65">
                      Google Analytics 4 con IP anonimizada. Si rechazás, el
                      script no se carga.
                    </span>
                  </div>
                  <Link
                    href="/juridica"
                    className="text-[13px] text-terracotta-soft hover:text-card"
                  >
                    Leer la política de cookies
                  </Link>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {!detalle && (
                <button
                  type="button"
                  onClick={() => setDetalle(true)}
                  className="cursor-pointer rounded-[var(--radius-button)] border border-card/40 px-5 py-3 text-[13.5px] text-card hover:border-terracotta"
                >
                  Personalizar
                </button>
              )}
              <button
                type="button"
                onClick={() => decidir("essential")}
                className="cursor-pointer rounded-[var(--radius-button)] border border-card/40 px-5 py-3 text-[13.5px] text-card hover:border-terracotta"
              >
                Rechazar opcionales
              </button>
              <button
                type="button"
                onClick={() => decidir("all")}
                className="cursor-pointer rounded-[var(--radius-button)] bg-terracotta-ink px-6 py-3 text-[13.5px] font-medium text-card hover:opacity-90"
              >
                Aceptar todo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
