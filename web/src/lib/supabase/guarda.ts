import "server-only";
import { redirect } from "next/navigation";
import { miembroActual, type Miembro } from "./servidor";

/**
 * Exige sesión y, si se piden roles, que el miembro tenga uno de ellos.
 *
 * La comparación es por pertenencia a una lista explícita, nunca por nivel:
 * así, agregar un rol nuevo no le concede permisos por accidente.
 *
 * Falla cerrada: sin Supabase, sin sesión o sin fila en `miembros`, redirige.
 * Nunca al revés.
 *
 * Es la primera barrera, no la única: las políticas RLS de la base vuelven a
 * comprobar todo. Si esta guarda tuviera un error, la base sigue negando.
 */
export async function exigirMiembro(roles?: Miembro["rol"][]): Promise<Miembro> {
  const miembro = await miembroActual();

  if (!miembro) redirect("/acceso?motivo=sesion");
  if (roles && !roles.includes(miembro.rol)) redirect("/acceso?motivo=permiso");

  return miembro;
}
