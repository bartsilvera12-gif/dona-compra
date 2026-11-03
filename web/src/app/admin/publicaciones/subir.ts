"use server";

import { randomBytes } from "node:crypto";
import { put } from "@vercel/blob";
import { MAX_BYTES, nombreSeguro, procesarImagen } from "@/lib/imagenes";
import { exigirSesion } from "@/lib/sesion";

/**
 * Subida de imágenes para las publicaciones.
 *
 * Las imágenes van a Vercel Blob y no al disco del servidor: en una función
 * serverless el sistema de archivos es efímero y lo que se escriba se pierde
 * en el siguiente despliegue.
 *
 * Igual que el resto, es opcional: sin BLOB_READ_WRITE_TOKEN la subida avisa
 * y el formulario sigue aceptando una ruta o una URL a mano.
 */

const token = (process.env.BLOB_READ_WRITE_TOKEN ?? "").trim();
export const subidaDisponible = token.length > 0;

export type EstadoSubida = {
  ok?: boolean;
  url?: string;
  aviso?: string;
  detalle?: string;
};

export async function subirImagen(
  _anterior: EstadoSubida,
  formData: FormData,
): Promise<EstadoSubida> {
  // Primera sentencia, como en todas las acciones del panel.
  await exigirSesion(["admin"]);

  if (!subidaDisponible) {
    return {
      ok: false,
      aviso:
        "La subida de archivos no está configurada. Cargá la imagen por ruta o URL, o configurá BLOB_READ_WRITE_TOKEN.",
    };
  }

  const archivo = formData.get("archivo");
  if (!(archivo instanceof File) || archivo.size === 0) {
    return { ok: false, aviso: "Elegí un archivo." };
  }

  // Se corta por tamaño antes de leerlo entero en memoria.
  if (archivo.size > MAX_BYTES) {
    return {
      ok: false,
      aviso: `La imagen pesa más de ${Math.round(MAX_BYTES / 1024 / 1024)} MB.`,
    };
  }

  const procesada = await procesarImagen(await archivo.arrayBuffer());
  if (!procesada.ok) {
    return { ok: false, aviso: procesada.error };
  }

  try {
    const nombre = nombreSeguro(archivo.name, randomBytes(6).toString("hex"));

    const { url } = await put(`anuncios/${nombre}`, procesada.datos, {
      access: "public",
      contentType: "image/webp",
      // El nombre ya lleva su propio sufijo al azar; que Vercel no agregue
      // otro mantiene la URL predecible y legible.
      addRandomSuffix: false,
      token,
    });

    const ahorro = Math.round((1 - procesada.bytes / archivo.size) * 100);

    return {
      ok: true,
      url,
      aviso: "Imagen subida.",
      detalle:
        `${procesada.ancho}×${procesada.alto} px · ` +
        `${(procesada.bytes / 1024).toFixed(0)} kB en WebP` +
        (ahorro > 0 ? ` · ${ahorro} % menos que el original` : "") +
        " · metadatos eliminados",
    };
  } catch (err) {
    console.error("[subir] falló la subida:", err);
    return { ok: false, aviso: "No se pudo subir la imagen. Probá de nuevo." };
  }
}
