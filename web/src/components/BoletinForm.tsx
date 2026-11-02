"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { suscribir, type EstadoBoletin } from "@/app/boletin/actions";

const inicial: EstadoBoletin = { ok: false };

function Boton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer rounded-[var(--radius-button)] bg-navy px-6 py-3 text-sm font-medium text-card hover:bg-navy-deep disabled:opacity-60"
    >
      {pending ? "Enviando…" : "Suscribirme"}
    </button>
  );
}

export default function BoletinForm() {
  const [estado, action] = useActionState(suscribir, inicial);
  const formRef = useRef<HTMLFormElement>(null);
  const avisoRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (estado.aviso) avisoRef.current?.focus();
    if (estado.ok) formRef.current?.reset();
  }, [estado]);

  return (
    <div>
      <form ref={formRef} action={action} noValidate className="grid gap-3">
        <div className="flex flex-wrap gap-2.5">
          <label htmlFor="boletin-correo" className="sr-only">
            Tu correo
          </label>
          <input
            id="boletin-correo"
            name="correo"
            type="email"
            placeholder="tucorreo@ejemplo.com"
            aria-invalid={!!estado.errores?.correo}
            className="min-w-[220px] flex-1 rounded-[var(--radius-button)] border border-navy/25 bg-card px-3.5 py-3 text-base text-ink focus:border-terracotta"
          />
          <Boton />
        </div>

        {/* Campo trampa contra bots. */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor="boletin-trampa">No completar</label>
          <input id="boletin-trampa" name="trampa" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-[13px] text-muted">
          <input
            type="checkbox"
            name="consent"
            className="mt-0.5 h-4 w-4 flex-none accent-terracotta"
          />
          <span>
            Acepto recibir el boletín y la{" "}
            <a href="/juridica" className="text-terracotta-ink underline">
              política de privacidad
            </a>
            . Podés darte de baja desde cualquier correo.
          </span>
        </label>
        {estado.errores?.consent && (
          <p className="text-[13px] text-error-ink" role="alert">
            {estado.errores.consent}
          </p>
        )}
      </form>

      {estado.aviso && (
        <p
          ref={avisoRef}
          tabIndex={-1}
          role="status"
          className={`mt-4 rounded-[var(--radius-card)] border px-4 py-3.5 text-[14.5px] text-ink ${
            estado.ok
              ? "border-ok/40 bg-ok/10"
              : "border-error/40 bg-error/10"
          }`}
        >
          {estado.aviso}
        </p>
      )}
    </div>
  );
}
