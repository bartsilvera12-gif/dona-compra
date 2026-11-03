import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SCHEMA, supabaseAnonKey, supabaseUrl } from "./config";

/**
 * Cliente de Supabase para el servidor.
 *
 * Lee y escribe la sesión en las cookies de la petición, así que todas las
 * consultas salen con la identidad de quien está navegando. Eso es lo que hace
 * que RLS funcione: la base decide los permisos en cada consulta, en vez de
 * confiar en que el código se acuerde de filtrar.
 */
export async function clienteServidor() {
  const almacen = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    db: { schema: SCHEMA },
    cookies: {
      getAll() {
        return almacen.getAll();
      },
      setAll(aGuardar) {
        try {
          for (const { name, value, options } of aGuardar) {
            almacen.set(name, value, options);
          }
        } catch {
          // Desde un componente de servidor no se pueden escribir cookies.
          // No es un problema: el middleware ya refrescó la sesión.
        }
      },
    },
  });
}

/** Usuario autenticado, o null. */
export async function usuarioActual() {
  const sb = await clienteServidor();
  // getUser valida el token contra el servidor de auth. getSession solo lee la
  // cookie, que es manipulable: para decidir permisos no alcanza.
  const { data, error } = await sb.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

export type Miembro = {
  user_id: string;
  rol: "admin" | "comerciante" | "mayorista" | "miembro";
  nombre: string;
  negocio: string | null;
  ciudad: string | null;
};

/** Usuario junto con su rol dentro de la aplicación, o null. */
export async function miembroActual(): Promise<Miembro | null> {
  const usuario = await usuarioActual();
  if (!usuario) return null;

  const sb = await clienteServidor();
  const { data } = await sb
    .from("miembros")
    .select("user_id, rol, nombre, negocio, ciudad")
    .eq("user_id", usuario.id)
    .maybeSingle();

  // Un usuario de Supabase sin fila en `miembros` no tiene ningún permiso.
  // El acceso se concede, no se hereda de existir en Auth.
  return (data as Miembro | null) ?? null;
}
