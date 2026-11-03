/**
 * Si la subida de archivos está configurada.
 *
 * Vive acá y no junto a la acción porque un archivo con "use server" solo
 * puede exportar funciones asíncronas: exportar una constante desde ahí
 * rompe el build.
 */
export const subidaDisponible =
  (process.env.BLOB_READ_WRITE_TOKEN ?? "").trim().length > 0;
