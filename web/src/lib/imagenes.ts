import sharp from "sharp";

// Sin "server-only" a proposito: esto es computo puro, no toca secretos ni el
// contexto de la peticion, y poder importarlo desde una prueba vale mas que
// la marca. Quien si la lleva es la accion que lo usa.

/**
 * Validación y reprocesado de imágenes subidas.
 *
 * El nombre del archivo y el tipo que declara el navegador son datos que
 * manda quien sube: no se usan para decidir nada. Lo que vale son los bytes.
 *
 * Y sobre todo, la imagen se vuelve a codificar siempre. Eso:
 *
 *  - Borra los metadatos, incluida la ubicación GPS que muchas cámaras de
 *    teléfono dejan en la foto. Publicar la dirección del local de alguien
 *    sin querer es un problema de privacidad real.
 *  - Neutraliza los archivos políglotas, que son imágenes válidas con otra
 *    cosa escondida adentro: lo que se guarda es la salida de nuestro propio
 *    codificador, no los bytes que llegaron.
 */

export const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
export const MAX_LADO = 1600; // px del lado mayor
const CALIDAD = 82;

/** Formatos aceptados, por los bytes del encabezado. */
type Formato = "jpeg" | "png" | "webp" | "avif" | "gif";

function detectarFormato(b: Buffer): Formato | null {
  if (b.length < 12) return null;

  // JPEG: FF D8 FF
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpeg";

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
    b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a
  ) {
    return "png";
  }

  // WebP: "RIFF" .... "WEBP"
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    return "webp";
  }

  // GIF: "GIF87a" o "GIF89a"
  const gif = b.toString("ascii", 0, 6);
  if (gif === "GIF87a" || gif === "GIF89a") return "gif";

  // AVIF / HEIF: caja "ftyp" con marca avif o avis
  if (b.toString("ascii", 4, 8) === "ftyp") {
    const marca = b.toString("ascii", 8, 12);
    if (marca === "avif" || marca === "avis") return "avif";
  }

  return null;
}

export type ResultadoImagen =
  | { ok: true; datos: Buffer; ancho: number; alto: number; bytes: number }
  | { ok: false; error: string };

/**
 * Comprueba y reprocesa. Devuelve WebP, que es lo que pedía el pliego para
 * el rendimiento y además pesa bastante menos que el JPEG original.
 */
export async function procesarImagen(
  entrada: ArrayBuffer | Buffer,
): Promise<ResultadoImagen> {
  const bruto = Buffer.isBuffer(entrada) ? entrada : Buffer.from(entrada);

  if (bruto.length === 0) return { ok: false, error: "El archivo está vacío." };
  if (bruto.length > MAX_BYTES) {
    return {
      ok: false,
      error: `La imagen pesa más de ${Math.round(MAX_BYTES / 1024 / 1024)} MB.`,
    };
  }

  const formato = detectarFormato(bruto);
  if (!formato) {
    // Mensaje deliberadamente concreto: el caso frecuente es que alguien
    // arrastre un PDF o un SVG creyendo que es una imagen cualquiera.
    return {
      ok: false,
      error:
        "El archivo no es una imagen JPEG, PNG, WebP, AVIF o GIF. Los SVG no se aceptan porque pueden contener código.",
    };
  }

  try {
    // failOn "error" hace que sharp rechace archivos corruptos en vez de
    // intentar interpretarlos a medias.
    const img = sharp(bruto, { failOn: "error", limitInputPixels: 50_000_000 });
    const meta = await img.metadata();

    if (!meta.width || !meta.height) {
      return { ok: false, error: "No se pudo leer el tamaño de la imagen." };
    }

    const datos = await img
      .rotate() // aplica la orientación EXIF antes de descartarla
      .resize({
        width: MAX_LADO,
        height: MAX_LADO,
        fit: "inside",
        withoutEnlargement: true,
      })
      // Sin keepMetadata ni keepExif: todo lo que no sea píxeles se descarta,
      // incluida la ubicación GPS.
      .webp({ quality: CALIDAD })
      .toBuffer({ resolveWithObject: true });

    return {
      ok: true,
      datos: datos.data,
      ancho: datos.info.width,
      alto: datos.info.height,
      bytes: datos.data.length,
    };
  } catch (err) {
    console.error("[imagenes] no se pudo procesar:", err);
    return {
      ok: false,
      error: "No se pudo procesar la imagen. Probá con otro archivo.",
    };
  }
}

/**
 * Nombre de archivo propio.
 *
 * El que viene del navegador se descarta entero: puede traer `../`, caracteres
 * de control o un largo absurdo. Se conserva un resto legible solo para que
 * el listado del almacenamiento se pueda leer.
 */
export function nombreSeguro(original: string, sufijo: string): string {
  const base = original
    .replace(/\.[^.]*$/, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  return `${base || "imagen"}-${sufijo}.webp`;
}
