import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";

/** Estado de una consulta dentro del back-office. */
export const estadoMensaje = pgEnum("estado_mensaje", [
  "nuevo",
  "leido",
  "respondido",
  "spam",
]);

export const asuntoMensaje = pgEnum("asunto_mensaje", [
  "Comerciante",
  "Mayorista",
  "Prensa",
  "Otro",
]);

/**
 * Consultas enviadas desde el formulario de contacto.
 *
 * `ipHash` guarda un hash con sal de la IP, no la IP: alcanza para limitar
 * envíos abusivos sin conservar un dato personal identificable.
 */
export const mensajes = pgTable(
  "mensajes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .notNull()
      .defaultNow(),

    nombre: text("nombre").notNull(),
    apellido: text("apellido").notNull(),
    correo: text("correo").notNull(),
    telefono: text("telefono").notNull(),
    asunto: asuntoMensaje("asunto").notNull(),
    mensaje: text("mensaje").notNull(),

    // Solo para asunto Comerciante o Mayorista.
    negocio: text("negocio"),
    ciudad: text("ciudad"),

    estado: estadoMensaje("estado").notNull().default("nuevo"),
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
  },
  (t) => [
    index("mensajes_creado_en_idx").on(t.creadoEn),
    index("mensajes_estado_idx").on(t.estado),
    index("mensajes_ip_hash_idx").on(t.ipHash),
  ],
);

/**
 * Suscriptores del boletín, con doble opt-in.
 *
 * Una dirección no recibe nada hasta que confirma desde el correo:
 * es lo que el RGPD espera como prueba del consentimiento.
 */
export const suscriptores = pgTable(
  "suscriptores",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    correo: text("correo").notNull().unique(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .notNull()
      .defaultNow(),

    // Null mientras no haya confirmado el enlace que le mandamos.
    confirmadoEn: timestamp("confirmado_en", { withTimezone: true }),
    bajaEn: timestamp("baja_en", { withTimezone: true }),

    // Sirve para confirmar y para dar de baja.
    token: text("token").notNull(),
    ipHash: text("ip_hash"),
  },
  (t) => [
    index("suscriptores_token_idx").on(t.token),
    index("suscriptores_creado_en_idx").on(t.creadoEn),
  ],
);

export type Mensaje = typeof mensajes.$inferSelect;
export type NuevoMensaje = typeof mensajes.$inferInsert;
export type Suscriptor = typeof suscriptores.$inferSelect;
