import { Resend } from "resend";
import { site } from "./site";

/**
 * Envío de correo con Resend.
 *
 * Igual que la base de datos, es opcional: sin RESEND_API_KEY no se envía
 * nada y se devuelve `enviado: false`. Quien llama decide qué hacer con eso
 * (en el formulario, ofrecer WhatsApp y mailto como alternativa).
 */

const apiKey = (process.env.RESEND_API_KEY ?? "").trim();
const remitente = (process.env.MAIL_FROM ?? "").trim();
const destino = (process.env.MAIL_TO ?? "").trim() || site.email;

export const mailDisponible = apiKey.length > 0 && remitente.length > 0;

const resend = mailDisponible ? new Resend(apiKey) : null;

type Resultado = { enviado: boolean; error?: string };

async function enviar(opts: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<Resultado> {
  if (!resend) return { enviado: false, error: "correo no configurado" };

  try {
    const { error } = await resend.emails.send({
      from: remitente,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      replyTo: opts.replyTo,
    });
    if (error) {
      console.error("[mail] Resend devolvió error:", error);
      return { enviado: false, error: error.message };
    }
    return { enviado: true };
  } catch (err) {
    console.error("[mail] fallo al enviar:", err);
    return { enviado: false, error: "fallo al enviar" };
  }
}

/** Avisa al equipo de una consulta nueva. */
export function avisarConsulta(datos: {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  asunto: string;
  mensaje: string;
  negocio?: string | null;
  ciudad?: string | null;
}): Promise<Resultado> {
  const lineas = [
    `Nombre: ${datos.nombre} ${datos.apellido}`,
    `Correo: ${datos.correo}`,
    `Teléfono: ${datos.telefono}`,
    `Asunto: ${datos.asunto}`,
    datos.negocio ? `Negocio: ${datos.negocio}` : null,
    datos.ciudad ? `Ciudad o zona: ${datos.ciudad}` : null,
    "",
    "Mensaje:",
    datos.mensaje,
  ].filter((l): l is string => l !== null);

  return enviar({
    to: destino,
    subject: `[Sitio web] ${datos.asunto} — ${datos.nombre} ${datos.apellido}`,
    text: lineas.join("\n"),
    // Responder en el cliente de correo contesta directo a la persona.
    replyTo: datos.correo,
  });
}

/** Acuse de recibo para quien escribió. */
export function acusarRecibo(datos: {
  correo: string;
  nombre: string;
}): Promise<Resultado> {
  return enviar({
    to: datos.correo,
    subject: "Recibimos tu consulta — Doña Compra",
    text: [
      `Hola ${datos.nombre},`,
      "",
      "Recibimos tu consulta y te vamos a responder a la brevedad.",
      site.plazo,
      "",
      `Si es urgente, escribinos por WhatsApp al ${site.phone}.`,
      "",
      "Doña Compra",
      site.zona,
    ].join("\n"),
  });
}

/** Correo de confirmación del boletín (doble opt-in). */
export function confirmarBoletin(datos: {
  correo: string;
  token: string;
}): Promise<Resultado> {
  const url = `${site.url}/boletin/confirmar?token=${encodeURIComponent(datos.token)}`;
  return enviar({
    to: datos.correo,
    subject: "Confirmá tu suscripción — Doña Compra",
    text: [
      "Alguien pidió suscribir esta dirección al boletín de Doña Compra.",
      "",
      "Si fuiste vos, confirmá desde este enlace:",
      url,
      "",
      "Si no fuiste vos, ignorá este mensaje: sin confirmar no te vamos a escribir.",
      "",
      "Doña Compra",
    ].join("\n"),
  });
}
