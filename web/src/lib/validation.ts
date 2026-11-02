import { z } from "zod";
import { ASUNTOS } from "./site";

/**
 * Validación del formulario de contacto.
 *
 * Corre en el servidor: lo que valide el navegador es comodidad para la
 * persona, no una garantía. Cualquiera puede enviar un POST a mano.
 */

const texto = (min: number, max: number, campo: string) =>
  z
    .string()
    .trim()
    .min(min, `Completá ${campo}.`)
    .max(max, `${campo} es demasiado largo.`);

export const contactoSchema = z.object({
  nombre: texto(2, 80, "tu nombre"),
  apellido: texto(2, 80, "tu apellido"),

  correo: z
    .string()
    .trim()
    .max(254, "El correo es demasiado largo.")
    .pipe(z.email("Revisá la dirección de correo.")),

  telefono: z
    .string()
    .trim()
    .transform((v) => v.replace(/[^\d+]/g, ""))
    .refine(
      (v) => {
        const d = v.replace(/\D/g, "");
        return d.length >= 9 && d.length <= 12;
      },
      "El teléfono tiene que tener entre 9 y 12 dígitos.",
    ),

  asunto: z.enum(ASUNTOS, { message: "Elegí un asunto." }),

  mensaje: texto(10, 4000, "el mensaje"),

  // Solo tienen sentido para comerciantes y mayoristas.
  negocio: z.string().trim().max(120).optional().or(z.literal("")),
  ciudad: z.string().trim().max(120).optional().or(z.literal("")),

  consent: z
    .union([z.literal("on"), z.literal("true"), z.boolean()])
    .refine((v) => v === "on" || v === "true" || v === true, {
      message: "Necesitamos tu autorización para tratar los datos.",
    }),

  // Campo trampa: invisible en pantalla, así que una persona lo deja vacío.
  trampa: z.string().max(0, "Envío rechazado.").optional().or(z.literal("")),

  // Marca de tiempo de cuándo se dibujó el formulario, para medir qué tan
  // rápido se completó.
  ts: z.string().optional(),
});

export type ContactoInput = z.input<typeof contactoSchema>;
export type ContactoData = z.output<typeof contactoSchema>;

export const boletinSchema = z.object({
  correo: z
    .string()
    .trim()
    .max(254, "El correo es demasiado largo.")
    .pipe(z.email("Revisá la dirección de correo.")),
  trampa: z.string().max(0).optional().or(z.literal("")),
  consent: z
    .union([z.literal("on"), z.literal("true"), z.boolean()])
    .refine((v) => v === "on" || v === "true" || v === true, {
      message: "Necesitamos tu autorización para escribirte.",
    }),
});

/** Convierte los errores de Zod en un mapa campo → primer mensaje. */
export function erroresPorCampo(
  error: z.ZodError<unknown>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const campo = String(issue.path[0] ?? "_");
    if (!out[campo]) out[campo] = issue.message;
  }
  return out;
}
