"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireDb } from "@/db";
import { mensajes, publicaciones } from "@/db/schema";
import { exigirSesion } from "@/lib/sesion";

/**
 * Cada acción vuelve a exigir rol admin.
 *
 * Que el layout ya lo haga no alcanza: una acción de servidor se puede
 * invocar directamente, sin pasar por la página que la contiene.
 */

const estadoMensajeSchema = z.enum(["nuevo", "leido", "respondido", "spam"]);
const estadoPublicacionSchema = z.enum([
  "pendiente",
  "publicada",
  "rechazada",
  "archivada",
]);

export async function cambiarEstadoMensaje(formData: FormData) {
  await exigirSesion(["admin"]);

  const id = z.uuid().parse(formData.get("id"));
  const estado = estadoMensajeSchema.parse(formData.get("estado"));

  const db = requireDb();
  await db.update(mensajes).set({ estado }).where(eq(mensajes.id, id));

  revalidatePath("/admin/mensajes");
  revalidatePath("/admin");
}

export async function moderarPublicacion(formData: FormData) {
  await exigirSesion(["admin"]);

  const id = z.uuid().parse(formData.get("id"));
  const estado = estadoPublicacionSchema.parse(formData.get("estado"));
  const nota = (formData.get("nota") as string | null)?.slice(0, 500) || null;

  const db = requireDb();
  await db
    .update(publicaciones)
    .set({
      estado,
      notaModeracion: nota,
      // Se sella la fecha de publicación la primera vez que se aprueba.
      ...(estado === "publicada" ? { publicadoEn: new Date() } : {}),
    })
    .where(eq(publicaciones.id, id));

  revalidatePath("/admin/publicaciones");
  revalidatePath("/admin");
  // El feed público cambia, así que también se regenera.
  revalidatePath("/anuncios");
}
