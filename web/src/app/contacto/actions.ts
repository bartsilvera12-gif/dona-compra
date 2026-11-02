"use server";

import { db } from "@/db";
import { mensajes } from "@/db/schema";
import { contactoSchema, erroresPorCampo } from "@/lib/validation";
import {
  demasiadoRapido,
  ipHash,
  superaLimite,
  userAgent,
} from "@/lib/antispam";
import { acusarRecibo, avisarConsulta, mailDisponible } from "@/lib/mail";

export type EstadoContacto = {
  ok: boolean;
  /** Mensaje general para mostrar arriba del formulario. */
  aviso?: string;
  /** Errores por campo, para marcar cada input. */
  errores?: Record<string, string>;
  /**
   * Si quedó registrada pero no pudimos enviar el correo, la interfaz ofrece
   * WhatsApp como alternativa en vez de dar la consulta por perdida.
   */
  sugerirWhatsapp?: boolean;
};

export async function enviarConsulta(
  _anterior: EstadoContacto,
  formData: FormData,
): Promise<EstadoContacto> {
  const crudo = Object.fromEntries(formData) as Record<string, string>;

  // 1. Forma de los datos.
  const parsed = contactoSchema.safeParse(crudo);
  if (!parsed.success) {
    return {
      ok: false,
      aviso: "Revisá los campos marcados.",
      errores: erroresPorCampo(parsed.error),
    };
  }
  const datos = parsed.data;

  // 2. Campo trampa y tiempo de llenado. Respuesta deliberadamente vaga:
  //    no le explicamos al bot qué lo delató.
  if (datos.trampa) {
    return { ok: false, aviso: "No pudimos procesar el envío." };
  }
  if (demasiadoRapido(datos.ts)) {
    return {
      ok: false,
      aviso: "El envío llegó demasiado rápido. Probá de nuevo.",
    };
  }

  // 3. Límite por origen.
  const hash = await ipHash();
  if (await superaLimite(hash)) {
    return {
      ok: false,
      aviso:
        "Recibimos varias consultas desde esta conexión. Probá más tarde o escribinos por WhatsApp.",
      sugerirWhatsapp: true,
    };
  }

  // 4. Guardar. Si no hay base configurada seguimos igual: el correo es lo
  //    que realmente hace llegar la consulta.
  let guardado = false;
  if (db) {
    try {
      await db.insert(mensajes).values({
        nombre: datos.nombre,
        apellido: datos.apellido,
        correo: datos.correo,
        telefono: datos.telefono,
        asunto: datos.asunto,
        mensaje: datos.mensaje,
        negocio: datos.negocio || null,
        ciudad: datos.ciudad || null,
        ipHash: hash,
        userAgent: await userAgent(),
      });
      guardado = true;
    } catch (err) {
      console.error("[contacto] no se pudo guardar:", err);
    }
  }

  // 5. Avisar al equipo y acusar recibo.
  const aviso = await avisarConsulta(datos);
  if (aviso.enviado) {
    // Que falle el acuse no invalida la consulta: ya llegó a destino.
    void acusarRecibo({ correo: datos.correo, nombre: datos.nombre });
  }

  if (!aviso.enviado && !guardado) {
    return {
      ok: false,
      aviso: mailDisponible
        ? "No pudimos enviar tu consulta. Escribinos por WhatsApp."
        : "El envío por correo todavía no está configurado. Escribinos por WhatsApp.",
      sugerirWhatsapp: true,
    };
  }

  return {
    ok: true,
    aviso: aviso.enviado
      ? "Recibimos tu consulta. Te respondemos a la brevedad."
      : "Registramos tu consulta. Si es urgente, escribinos por WhatsApp.",
    sugerirWhatsapp: !aviso.enviado,
  };
}
