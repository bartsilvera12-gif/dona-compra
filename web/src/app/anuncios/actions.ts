"use server";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { publicaciones, reacciones } from "@/db/schema";

const COOKIE = "dc-visitante";
const UN_ANIO = 60 * 60 * 24 * 365;

/**
 * Id opaco del visitante, en una cookie propia.
 *
 * No identifica a nadie ni se cruza con ningún otro dato: solo sirve para que
 * la misma persona no sume el mismo me gusta dos veces. Por eso no requiere
 * consentimiento de cookies: es estrictamente necesaria para la función que
 * la persona está pidiendo al hacer clic.
 */
async function idVisitante(): Promise<string> {
  const almacen = await cookies();
  const actual = almacen.get(COOKIE)?.value;
  if (actual) return actual;

  const nuevo = randomBytes(16).toString("base64url");
  almacen.set(COOKIE, nuevo, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: UN_ANIO,
    path: "/",
  });
  return nuevo;
}

export type EstadoReaccion = {
  meGusta: number;
  activo: boolean;
  error?: string;
};

/** Suma o quita el me gusta de este visitante. */
export async function alternarMeGusta(
  slug: string,
  _anterior: EstadoReaccion,
): Promise<EstadoReaccion> {
  if (!db) {
    return {
      ..._anterior,
      error: "Los me gusta se guardan cuando la base esté conectada.",
    };
  }

  try {
    const visitante = await idVisitante();

    const [pub] = await db
      .select({ id: publicaciones.id })
      .from(publicaciones)
      .where(
        and(eq(publicaciones.slug, slug), eq(publicaciones.estado, "publicada")),
      )
      .limit(1);

    if (!pub) return { ..._anterior, error: "La publicación no existe." };

    const [existente] = await db
      .select({ id: reacciones.id })
      .from(reacciones)
      .where(
        and(
          eq(reacciones.publicacionId, pub.id),
          eq(reacciones.visitante, visitante),
        ),
      )
      .limit(1);

    if (existente) {
      await db.delete(reacciones).where(eq(reacciones.id, existente.id));
    } else {
      await db
        .insert(reacciones)
        .values({ publicacionId: pub.id, visitante })
        // Si llegan dos clics a la vez, el índice único evita el duplicado.
        .onConflictDoNothing();
    }

    const [conteo] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(reacciones)
      .where(eq(reacciones.publicacionId, pub.id));

    revalidatePath(`/anuncios/${slug}`);
    revalidatePath("/anuncios");

    return { meGusta: conteo?.n ?? 0, activo: !existente };
  } catch (err) {
    console.error("[anuncios] me gusta fallido:", err);
    return { ..._anterior, error: "No pudimos registrar tu me gusta." };
  }
}

/** Dice si este visitante ya reaccionó, para dibujar el botón activo. */
export async function yaReacciono(publicacionId: string): Promise<boolean> {
  if (!db) return false;
  const almacen = await cookies();
  const visitante = almacen.get(COOKIE)?.value;
  if (!visitante) return false;

  const [fila] = await db
    .select({ id: reacciones.id })
    .from(reacciones)
    .where(
      and(
        eq(reacciones.publicacionId, publicacionId),
        eq(reacciones.visitante, visitante),
      ),
    )
    .limit(1);

  return !!fila;
}
