"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { requireDb } from "@/db";
import { publicaciones } from "@/db/schema";
import { exigirSesion } from "@/lib/sesion";

/** Convierte un título en slug: minúsculas, sin tildes, con guiones. */
function aSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const schema = z.object({
  id: z.union([z.uuid(), z.literal("")]).optional(),
  titulo: z.string().trim().min(4, "El título es muy corto.").max(140),
  texto: z.string().trim().min(10, "El texto es muy corto.").max(2000),
  tipo: z.enum(["foto", "video"]),
  categoria: z.enum(["Ofertas", "Novedades", "Comunidad"]),
  ciudad: z.string().trim().min(2, "Indicá la ciudad.").max(80),
  autor: z.string().trim().min(2, "Indicá quién publica.").max(80),
  precio: z
    .string()
    .trim()
    .transform((v) => Number(v.replace(/\D/g, "")) || 0)
    .refine((n) => n >= 0 && n <= 999_999_999, "Precio fuera de rango."),
  // Se acepta una ruta de /assets o una URL completa.
  imagen: z
    .string()
    .trim()
    .min(1, "Indicá la imagen.")
    .refine(
      (v) => v.startsWith("/assets/") || /^https?:\/\//.test(v),
      "La imagen debe ser una ruta /assets/… o una URL http(s).",
    ),
  imagenAlt: z.string().trim().max(200).optional().or(z.literal("")),
  videoUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || /^https:\/\//.test(v),
      "El video debe ser una URL https del reproductor externo.",
    ),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida."),
  estado: z.enum(["pendiente", "publicada", "rechazada", "archivada"]),
  notaModeracion: z.string().trim().max(500).optional().or(z.literal("")),
});

export type EstadoForm = {
  ok?: boolean;
  aviso?: string;
  errores?: Record<string, string>;
};

export async function guardarPublicacion(
  _anterior: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  // Se vuelve a exigir el rol: una acción se puede invocar sin pasar por su
  // página.
  await exigirSesion(["admin"]);

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errores: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const campo = String(i.path[0] ?? "_");
      if (!errores[campo]) errores[campo] = i.message;
    }
    return { ok: false, aviso: "Revisá los campos marcados.", errores };
  }

  const d = parsed.data;
  const db = requireDb();

  const valores = {
    titulo: d.titulo,
    texto: d.texto,
    tipo: d.tipo,
    categoria: d.categoria,
    ciudad: d.ciudad,
    autor: d.autor,
    precio: d.precio,
    imagen: d.imagen,
    imagenAlt: d.imagenAlt || null,
    videoUrl: d.videoUrl || null,
    fecha: d.fecha,
    estado: d.estado,
    notaModeracion: d.notaModeracion || null,
    ...(d.estado === "publicada" ? { publicadoEn: new Date() } : {}),
  };

  try {
    if (d.id) {
      await db
        .update(publicaciones)
        .set(valores)
        .where(eq(publicaciones.id, d.id));
    } else {
      // El slug sale del título, con sufijo si ya existe otro igual.
      const base = aSlug(d.titulo) || "publicacion";
      let slug = base;
      for (let i = 2; i < 50; i++) {
        const [choque] = await db
          .select({ id: publicaciones.id })
          .from(publicaciones)
          .where(eq(publicaciones.slug, slug))
          .limit(1);
        if (!choque) break;
        slug = `${base}-${i}`;
      }
      await db.insert(publicaciones).values({ ...valores, slug });
    }
  } catch (err) {
    console.error("[admin] no se pudo guardar la publicación:", err);
    return { ok: false, aviso: "No se pudo guardar. Probá de nuevo." };
  }

  revalidatePath("/admin/publicaciones");
  revalidatePath("/admin");
  revalidatePath("/anuncios");
  redirect("/admin/publicaciones?guardada=1");
}

export async function eliminarPublicacion(formData: FormData) {
  await exigirSesion(["admin"]);
  const id = z.uuid().parse(formData.get("id"));

  const db = requireDb();
  await db.delete(publicaciones).where(eq(publicaciones.id, id));

  revalidatePath("/admin/publicaciones");
  revalidatePath("/admin");
  revalidatePath("/anuncios");
}

/** Comprueba que un slug esté libre, para avisar antes de guardar. */
export async function slugLibre(slug: string, excepto?: string) {
  await exigirSesion(["admin"]);
  const db = requireDb();
  const [fila] = await db
    .select({ id: publicaciones.id })
    .from(publicaciones)
    .where(
      excepto
        ? and(eq(publicaciones.slug, slug), ne(publicaciones.id, excepto))
        : eq(publicaciones.slug, slug),
    )
    .limit(1);
  return !fila;
}
