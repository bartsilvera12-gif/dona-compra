"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { suscriptores } from "@/db/schema";
import { boletinSchema, erroresPorCampo } from "@/lib/validation";
import { ipHash, nuevoToken } from "@/lib/antispam";
import { confirmarBoletin } from "@/lib/mail";

export type EstadoBoletin = {
  ok: boolean;
  aviso?: string;
  errores?: Record<string, string>;
};

/**
 * Alta al boletín con doble opt-in: la dirección queda registrada pero no
 * recibe nada hasta que se confirma desde el correo. Es lo que el RGPD
 * espera como prueba del consentimiento.
 */
export async function suscribir(
  _anterior: EstadoBoletin,
  formData: FormData,
): Promise<EstadoBoletin> {
  const parsed = boletinSchema.safeParse(
    Object.fromEntries(formData) as Record<string, string>,
  );
  if (!parsed.success) {
    return {
      ok: false,
      aviso: "Revisá los datos.",
      errores: erroresPorCampo(parsed.error),
    };
  }
  if (parsed.data.trampa) {
    return { ok: false, aviso: "No pudimos procesar el envío." };
  }

  const correo = parsed.data.correo.toLowerCase();

  if (!db) {
    return {
      ok: false,
      aviso: "El boletín todavía no está disponible. Volvé a intentar pronto.",
    };
  }

  // La respuesta es la misma exista o no la dirección: decir "ya estás
  // suscrito" le confirmaría a un tercero que ese correo está en la lista.
  const generico =
    "Si la dirección es válida, te enviamos un correo para confirmar la suscripción.";

  try {
    const [existente] = await db
      .select()
      .from(suscriptores)
      .where(eq(suscriptores.correo, correo))
      .limit(1);

    if (existente?.confirmadoEn && !existente.bajaEn) {
      return { ok: true, aviso: generico };
    }

    const token = nuevoToken();

    if (existente) {
      // Re-alta o reintento: token nuevo y se limpia una baja previa.
      await db
        .update(suscriptores)
        .set({ token, bajaEn: null, creadoEn: new Date() })
        .where(eq(suscriptores.correo, correo));
    } else {
      await db.insert(suscriptores).values({
        correo,
        token,
        ipHash: await ipHash(),
      });
    }

    await confirmarBoletin({ correo, token });
    return { ok: true, aviso: generico };
  } catch (err) {
    console.error("[boletin] alta fallida:", err);
    return {
      ok: false,
      aviso: "No pudimos registrar tu correo. Probá de nuevo en un momento.",
    };
  }
}
