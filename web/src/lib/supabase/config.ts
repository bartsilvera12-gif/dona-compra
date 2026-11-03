/**
 * Configuración de Supabase.
 *
 * El anon key es público por diseño: viaja en el navegador y está pensado para
 * eso. Lo que protege los datos no es que esté oculto, sino las políticas RLS
 * del schema (ver supabase/01-schema.sql). Si alguien toma este key, lo único
 * que puede hacer es lo que las políticas permitan a `anon`: enviar una
 * consulta de contacto, suscribirse al boletín y leer los anuncios aprobados.
 *
 * El service_role key NO se usa en este proyecto. Ese sí saltea RLS por
 * completo, y no hace falta: todo lo del panel pasa por la sesión del usuario
 * administrador, así que la base comprueba los permisos en cada consulta en
 * vez de confiar en que el código del servidor se acuerde de hacerlo.
 */

const env = (clave: string, porDefecto = "") =>
  (process.env[clave] ?? "").trim() || porDefecto;

export const supabaseUrl = env(
  "NEXT_PUBLIC_SUPABASE_URL",
  "https://api.neura.com.py",
);

export const supabaseAnonKey = env("NEXT_PUBLIC_SUPABASE_ANON_KEY");

/** Schema propio de la aplicación. No se toca `public` ni ningún otro. */
export const SCHEMA = env("NEXT_PUBLIC_SUPABASE_SCHEMA", "donacompraweb");

/** Bucket de imágenes. */
export const BUCKET = env("NEXT_PUBLIC_SUPABASE_BUCKET", "donacompraweb");

/**
 * Sin anon key no hay Supabase. Igual que con la base anterior, el sitio
 * levanta igual y las partes que dependen de datos lo avisan en pantalla, en
 * vez de romperse en producción.
 */
export const supabaseDisponible =
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

/** URL pública de un archivo del bucket. */
export function urlImagen(ruta: string): string {
  if (!ruta) return "";
  // Una ruta que ya es una URL completa se deja como está: así conviven las
  // imágenes subidas con las que vienen de /assets.
  if (/^https?:\/\//.test(ruta) || ruta.startsWith("/")) return ruta;
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${ruta}`;
}
