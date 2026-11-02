"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { enviarConsulta, type EstadoContacto } from "@/app/contacto/actions";
import { ASUNTOS, waLink } from "@/lib/site";

const INPUT =
  "w-full rounded-[var(--radius-button)] border border-navy/25 bg-card px-3.5 py-3 text-base text-ink focus:border-terracotta";
const LABEL =
  "mb-1.5 block text-xs uppercase tracking-[0.08em] text-muted";

function Error({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 text-[13px] text-error" role="alert">
      {msg}
    </p>
  );
}

function Enviar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer rounded-[var(--radius-button)] bg-navy px-6 py-3.5 text-sm font-medium tracking-[0.04em] text-card hover:bg-navy-deep disabled:opacity-60"
    >
      {pending ? "Enviando…" : "Enviar consulta"}
    </button>
  );
}

const inicial: EstadoContacto = { ok: false };

export default function ContactoForm() {
  const [estado, action] = useActionState(enviarConsulta, inicial);
  const [asunto, setAsunto] = useState("");
  const avisoRef = useRef<HTMLDivElement>(null);
  const tsRef = useRef<HTMLInputElement>(null);

  // Marca de tiempo de cuándo se dibujó el formulario: el servidor la usa para
  // descartar envíos completados en menos de 3 segundos. Se escribe sobre el
  // input (un sistema externo) en vez de guardarse en estado, porque en el
  // servidor no existe `Date.now()` del cliente y copiarlo a estado desde un
  // efecto dispara un render extra en cada montaje.
  useEffect(() => {
    if (tsRef.current) tsRef.current.value = String(Date.now());
  }, []);

  // Al terminar, llevar el foco al aviso para que un lector de pantalla lo lea.
  // No se resetea el formulario: cuando el envío sale bien se muestra la vista
  // de agradecimiento en su lugar.
  useEffect(() => {
    if (estado.aviso) avisoRef.current?.focus();
  }, [estado]);

  const err = estado.errores ?? {};
  const muestraNegocio = asunto === "Comerciante" || asunto === "Mayorista";

  if (estado.ok) {
    return (
      <div
        ref={avisoRef}
        tabIndex={-1}
        className="rounded-[var(--radius-card)] border border-ok/45 bg-card p-[clamp(16px,2.2vw,24px)]"
      >
        <h3 className="mb-2">Gracias por escribirnos</h3>
        <p className="mb-4 text-ink">{estado.aviso}</p>
        <div className="flex flex-wrap gap-2.5">
          {estado.sugerirWhatsapp && (
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-[var(--radius-button)] bg-navy px-6 py-3.5 text-sm font-medium text-card hover:bg-navy-deep hover:text-card"
            >
              Abrir WhatsApp
            </a>
          )}
          <a
            href="/contacto"
            className="inline-block rounded-[var(--radius-button)] border border-navy px-6 py-3.5 text-sm font-medium text-navy"
          >
            Escribir otra consulta
          </a>
        </div>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="grid gap-4.5">
      <input ref={tsRef} type="hidden" name="ts" defaultValue="" />

      {estado.aviso && (
        <div
          ref={avisoRef}
          tabIndex={-1}
          role="alert"
          className="rounded-[var(--radius-card)] border border-error/40 bg-error/10 px-4 py-3.5 text-[14.5px] text-ink"
        >
          {estado.aviso}
          {estado.sugerirWhatsapp && (
            <>
              {" "}
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-terracotta underline"
              >
                Abrir WhatsApp
              </a>
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(180px,100%),1fr))] gap-4.5">
        <div>
          <label htmlFor="nombre" className={LABEL}>Nombre *</label>
          <input id="nombre" name="nombre" type="text" autoComplete="given-name"
            aria-invalid={!!err.nombre} className={INPUT} />
          <Error msg={err.nombre} />
        </div>
        <div>
          <label htmlFor="apellido" className={LABEL}>Apellido *</label>
          <input id="apellido" name="apellido" type="text" autoComplete="family-name"
            aria-invalid={!!err.apellido} className={INPUT} />
          <Error msg={err.apellido} />
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(180px,100%),1fr))] gap-4.5">
        <div>
          <label htmlFor="correo" className={LABEL}>Correo *</label>
          <input id="correo" name="correo" type="email" autoComplete="email"
            aria-invalid={!!err.correo} className={INPUT} />
          <Error msg={err.correo} />
        </div>
        <div>
          <label htmlFor="telefono" className={LABEL}>Teléfono *</label>
          <input id="telefono" name="telefono" type="tel" autoComplete="tel"
            aria-invalid={!!err.telefono} className={INPUT} />
          <Error msg={err.telefono} />
        </div>
      </div>

      <div>
        <label htmlFor="asunto" className={LABEL}>Asunto *</label>
        <select id="asunto" name="asunto" value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
          aria-invalid={!!err.asunto} className={INPUT}>
          <option value="">Elegí una opción</option>
          {ASUNTOS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <Error msg={err.asunto} />
      </div>

      {muestraNegocio && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(180px,100%),1fr))] gap-4.5">
          <div>
            <label htmlFor="negocio" className={LABEL}>Nombre del negocio</label>
            <input id="negocio" name="negocio" type="text" className={INPUT} />
          </div>
          <div>
            <label htmlFor="ciudad" className={LABEL}>Ciudad o zona</label>
            <input id="ciudad" name="ciudad" type="text" className={INPUT} />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="mensaje" className={LABEL}>Mensaje *</label>
        <textarea id="mensaje" name="mensaje" rows={6}
          placeholder="Contanos en qué podemos ayudarte."
          aria-invalid={!!err.mensaje}
          className={`${INPUT} min-h-[140px] resize-y`} />
        <Error msg={err.mensaje} />
      </div>

      {/* Campo trampa: invisible para una persona, tentador para un bot. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="trampa">No completar</label>
        <input id="trampa" name="trampa" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
        <input type="checkbox" name="consent"
          className="mt-0.5 h-[18px] w-[18px] flex-none accent-terracotta" />
        <span>
          Acepto que Doña Compra trate mis datos para responder esta consulta,
          según la{" "}
          <a href="/juridica" className="text-terracotta underline">
            política de privacidad
          </a>
          . *
        </span>
      </label>
      <Error msg={err.consent} />

      <div>
        <Enviar />
        <p className="mt-3 text-xs text-muted">
          Los campos con * son obligatorios.
        </p>
      </div>
    </form>
  );
}
