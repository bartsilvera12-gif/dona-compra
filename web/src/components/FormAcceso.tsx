"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { entrar, type EstadoAcceso } from "@/app/acceso/actions";

const INPUT =
  "w-full rounded-[var(--radius-button)] border border-navy/25 bg-card px-3.5 py-3 text-base text-ink focus:border-terracotta";
const LABEL = "mb-1.5 block text-xs uppercase tracking-[0.08em] text-muted";

function Boton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full cursor-pointer rounded-[var(--radius-button)] bg-navy px-6 py-3.5 text-sm font-medium text-card hover:bg-navy-deep disabled:opacity-60"
    >
      {pending ? "Entrando…" : "Entrar"}
    </button>
  );
}

export default function FormAcceso({ aviso }: { aviso?: string }) {
  const [estado, accion] = useActionState(entrar, {} satisfies EstadoAcceso);

  return (
    <div className="rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(20px,3vw,28px)]">
      {aviso && (
        <p className="mb-5 rounded-[var(--radius-card)] border border-terracotta/35 bg-terracotta/8 px-4 py-3 text-sm text-ink">
          {aviso}
        </p>
      )}

      <form action={accion} className="grid gap-4">
        <div>
          <label htmlFor="correo" className={LABEL}>
            Correo
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            autoComplete="username"
            required
            className={INPUT}
          />
        </div>

        <div>
          <label htmlFor="password" className={LABEL}>
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={INPUT}
          />
        </div>

        {estado.error && (
          <p role="alert" className="rounded-[var(--radius-card)] border border-error/40 bg-error/10 px-4 py-3 text-sm text-ink">
            {estado.error}
          </p>
        )}

        <Boton />
      </form>

      <p className="mt-5 text-xs text-muted">
        El alta de cuentas la hace el equipo de Doña Compra. Si necesitás
        acceso, escribinos.
      </p>
    </div>
  );
}
