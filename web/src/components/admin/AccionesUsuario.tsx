"use client";

import { useActionState } from "react";
import {
  cambiarEstadoUsuario,
  cambiarRol,
  cerrarSesionesDe,
  eliminarUsuario,
  restablecerPassword,
  type EstadoUsuarios,
} from "@/app/admin/usuarios/actions";
import type { Rol } from "@/db/schema";
import PasswordUnaVez from "./PasswordUnaVez";

const ROLES: { v: Rol; label: string }[] = [
  { v: "admin", label: "Administración" },
  { v: "comerciante", label: "Comerciante" },
  { v: "mayorista", label: "Mayorista" },
  { v: "marca", label: "Marca" },
];

const boton =
  "cursor-pointer rounded-[var(--radius-button)] border border-navy/20 px-3.5 py-2 text-[13px] text-ink hover:border-terracotta";

export default function AccionesUsuario({
  id,
  correo,
  rol,
  estado,
  esYo,
  esUltimoAdmin,
}: {
  id: string;
  correo: string;
  rol: Rol;
  estado: "activo" | "suspendido";
  /** La propia cuenta de quien está mirando. */
  esYo: boolean;
  /** Único admin activo: no se lo puede bajar, suspender ni borrar. */
  esUltimoAdmin: boolean;
}) {
  const [reset, accionReset] = useActionState(
    restablecerPassword,
    {} satisfies EstadoUsuarios,
  );

  // Las guardas también están en el servidor; acá se desactivan los botones
  // para no ofrecer algo que va a ser rechazado.
  const bloqueado = esYo || esUltimoAdmin;

  return (
    <div className="grid gap-3">
      {reset.passwordNueva && (
        <PasswordUnaVez password={reset.passwordNueva} correo={correo} />
      )}
      {reset.aviso && !reset.passwordNueva && (
        <p role="status" className="text-[13px] text-error-ink">
          {reset.aviso}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-navy/10 pt-3">
        {/* Rol */}
        <form action={cambiarRol} className="flex items-center gap-2">
          <input type="hidden" name="id" value={id} />
          <label htmlFor={`rol-${id}`} className="sr-only">
            Rol de {correo}
          </label>
          <select
            id={`rol-${id}`}
            name="rol"
            defaultValue={rol}
            disabled={bloqueado}
            className="rounded-[var(--radius-button)] border border-navy/25 bg-card px-3 py-2 text-[13px] text-ink disabled:opacity-50"
          >
            {ROLES.map((r) => (
              <option key={r.v} value={r.v}>
                {r.label}
              </option>
            ))}
          </select>
          <button type="submit" disabled={bloqueado} className={`${boton} disabled:opacity-50`}>
            Cambiar rol
          </button>
        </form>

        {/* Suspender o reactivar */}
        <form action={cambiarEstadoUsuario}>
          <input type="hidden" name="id" value={id} />
          <input
            type="hidden"
            name="estado"
            value={estado === "activo" ? "suspendido" : "activo"}
          />
          <button
            type="submit"
            disabled={estado === "activo" && bloqueado}
            className={`${boton} disabled:opacity-50`}
          >
            {estado === "activo" ? "Suspender" : "Reactivar"}
          </button>
        </form>

        {/* Restablecer contraseña. Sobre la propia cuenta no se ofrece:
            cerraría la sesión en curso y la contraseña generada se perdería
            antes de poder leerla. Para eso está Mi cuenta. */}
        <form action={accionReset}>
          <input type="hidden" name="id" value={id} />
          <button type="submit" disabled={esYo} className={`${boton} disabled:opacity-40`}>
            Restablecer contraseña
          </button>
        </form>

        {/* Cerrar sesiones */}
        <form action={cerrarSesionesDe}>
          <input type="hidden" name="id" value={id} />
          <button type="submit" disabled={esYo} className={`${boton} disabled:opacity-40`}>
            Cerrar sus sesiones
          </button>
        </form>

        {/* Eliminar */}
        <form action={eliminarUsuario}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            disabled={bloqueado}
            className="cursor-pointer rounded-[var(--radius-button)] border border-error/45 px-3.5 py-2 text-[13px] text-error-ink hover:bg-error/8 disabled:opacity-40"
          >
            Eliminar
          </button>
        </form>
      </div>

      {esYo && (
        <p className="text-xs text-muted">
          Es tu propia cuenta: no podés cambiarte el rol, suspenderte ni
          borrarte, ni restablecerte la contraseña desde acá. Para cambiarla
          andá a Mi cuenta, que conserva la sesión de este navegador.
        </p>
      )}
      {!esYo && esUltimoAdmin && (
        <p className="text-xs text-terracotta-ink">
          Es el único administrador activo. Para cambiarlo, primero creá o
          activá otra cuenta de administración.
        </p>
      )}
    </div>
  );
}
