import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SCHEMA, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

/**
 * Refresca la sesión de Supabase en cada petición.
 *
 * Los tokens de acceso vencen a los pocos minutos. Sin esto, la sesión se
 * caería sola en medio del trabajo y habría que volver a entrar.
 *
 * El middleware NO decide permisos: de eso se ocupan la guarda del layout y,
 * sobre todo, las políticas RLS de la base. Un middleware que autoriza es
 * frágil, porque basta con que una ruta quede fuera del matcher para que el
 * control desaparezca sin que nadie lo note.
 */
export async function middleware(request: NextRequest) {
  const respuesta = NextResponse.next({ request });

  if (!supabaseAnonKey) return respuesta;

  const sb = createServerClient(supabaseUrl, supabaseAnonKey, {
    db: { schema: SCHEMA },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(aGuardar) {
        for (const { name, value, options } of aGuardar) {
          respuesta.cookies.set(name, value, options);
        }
      },
    },
  });

  // Llamarlo es lo que dispara el refresco; el resultado no se usa acá.
  await sb.auth.getUser();

  return respuesta;
}

export const config = {
  matcher: [
    // Todo menos los archivos estáticos y las imágenes optimizadas.
    "/((?!_next/static|_next/image|favicon.ico|assets/|.*\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
