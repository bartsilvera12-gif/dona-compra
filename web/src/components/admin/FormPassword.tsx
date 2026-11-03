"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  cambiarMiPassword,
  type EstadoUsuarios,
} from "@/app/admin/usuarios/actions";

const INPUT =
  "w-full rounded-[var(--radius-button)] border border-navy/25 bg-card px-3.5 py-2.5 text-[15px] text-ink focus:border-terracotta";
const LABEL = "mb-1.5 block text-xs uppercase tracking-[0.08em] text-muted";

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p role="alert" className="mt-1.5 text-[13px] text-error-ink">
      {msg}
    </p>
  );
}

function Guardar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer rounded-[var(--radius-button)] bg-navy px-6 py-3 text-sm font-medium text-card hover:bg-navy-deep disabled:opacity-60"
    >
      {pending ? "Cambiando…" : "Cambiar contraseña"}
    </button>
  );
}

export default function FormPassword() {
  const [estado, accion] = useActionState(
    cambiarMiPassword,
    {} satisfies EstadoUsuarios,
  );
  const e = estado.errores ?? {};

  return (
    <form action={accion} className="grid gap-4">
      {estado.aviso && (
        <p
          role={estado.ok ? "status" : "alert"}
          className={`rounded-[var(--radius-card)] border px-4 py-3 text-[14.5px] text-ink ${
            estado.ok ? "border-ok/45 bg-ok/10" : "border-error/40 bg-error/10"
          }`}
        >
          {estado.aviso}
        </p>
      )}

      <div>
        <label htmlFor="actual" className={LABEL}>Contraseña actual *</label>
        <input
          id="actual"
          name="actual"
          type="password"
          autoComplete="current-password"
          className={INPUT}
        />
        <Err msg={e.actual} />
      </div>

      <div>
        <label htmlFor="nueva" className={LABEL}>Contraseña nueva *</label>
        <input
          id="nueva"
          name="nueva"
          type="password"
          autoComplete="new-password"
          className={INPUT}
        />
        <Err msg={e.nueva} />
        <p className="mt-1.5 text-xs text-muted">
          Al menos 12 caracteres. El largo aporta más que mezclar símbolos:
          una frase que recuerdes sirve mejor que algo corto y retorcido.
        </p>
      </div>

      <div>
        <label htmlFor="repetir" className={LABEL}>Repetir la nueva *</label>
        <input
          id="repetir"
          name="repetir"
          type="password"
          autoComplete="new-password"
          className={INPUT}
        />
        <Err msg={e.repetir} />
      </div>

      <div className="border-t border-navy/10 pt-4">
        <Guardar />
        <p className="mt-3 text-xs text-muted">
          Se cierran tus otras sesiones, no la de este navegador: si cambiás la
          contraseña por sospecha, quien la tuviera queda afuera y vos seguís
          trabajando.
        </p>
      </div>
    </form>
  );
}
