"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  crearUsuario,
  type EstadoUsuarios,
} from "@/app/admin/usuarios/actions";
import PasswordUnaVez from "./PasswordUnaVez";

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

function Crear() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer rounded-[var(--radius-button)] bg-navy px-6 py-3 text-sm font-medium text-card hover:bg-navy-deep disabled:opacity-60"
    >
      {pending ? "Creando…" : "Crear cuenta"}
    </button>
  );
}

export default function FormUsuario() {
  const [estado, accion] = useActionState(
    crearUsuario,
    {} satisfies EstadoUsuarios,
  );
  const [rol, setRol] = useState("comerciante");
  const [correo, setCorreo] = useState("");

  const e = estado.errores ?? {};
  // Negocio y ciudad solo tienen sentido para estos dos roles.
  const pideNegocio = rol === "comerciante" || rol === "mayorista";

  return (
    <div className="grid gap-5">
      {estado.passwordNueva && (
        <PasswordUnaVez password={estado.passwordNueva} correo={correo} />
      )}

      {estado.aviso && !estado.passwordNueva && (
        <p
          role="alert"
          className={`rounded-[var(--radius-card)] border px-4 py-3 text-[14.5px] text-ink ${
            estado.ok
              ? "border-ok/45 bg-ok/10"
              : "border-error/40 bg-error/10"
          }`}
        >
          {estado.aviso}
        </p>
      )}

      <form action={accion} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="u-correo" className={LABEL}>Correo *</label>
            <input
              id="u-correo"
              name="correo"
              type="email"
              autoComplete="off"
              value={correo}
              onChange={(ev) => setCorreo(ev.target.value)}
              className={INPUT}
            />
            <Err msg={e.correo} />
          </div>
          <div>
            <label htmlFor="u-nombre" className={LABEL}>Nombre *</label>
            <input id="u-nombre" name="nombre" autoComplete="off" className={INPUT} />
            <Err msg={e.nombre} />
          </div>
        </div>

        <div>
          <label htmlFor="u-rol" className={LABEL}>Rol *</label>
          <select
            id="u-rol"
            name="rol"
            value={rol}
            onChange={(ev) => setRol(ev.target.value)}
            className={INPUT}
          >
            <option value="comerciante">Comerciante</option>
            <option value="mayorista">Mayorista</option>
            <option value="miembro">Miembro del Club</option>
            <option value="admin">Administración</option>
          </select>
          {rol === "admin" && (
            <p className="mt-1.5 text-[13px] text-terracotta-ink">
              Administración ve y cambia todo el panel, incluidas las cuentas.
            </p>
          )}
        </div>

        {pideNegocio && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="u-negocio" className={LABEL}>Negocio</label>
              <input id="u-negocio" name="negocio" className={INPUT} />
            </div>
            <div>
              <label htmlFor="u-ciudad" className={LABEL}>Ciudad</label>
              <input id="u-ciudad" name="ciudad" className={INPUT} />
            </div>
          </div>
        )}

        <div className="border-t border-navy/10 pt-4">
          <Crear />
          <p className="mt-3 text-xs text-muted">
            La contraseña se genera sola y se muestra una vez al crear la
            cuenta. No se envía por correo.
          </p>
        </div>
      </form>
    </div>
  );
}
