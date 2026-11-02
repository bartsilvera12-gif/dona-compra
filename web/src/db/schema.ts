import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  date,
  index,
  uniqueIndex,
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

/* ---------------------------------------------------------------------------
   Anuncios
   --------------------------------------------------------------------------- */

/** El pliego pide moderacion previa: nada se ve hasta aprobarse. */
export const estadoPublicacion = pgEnum("estado_publicacion", [
  "pendiente",
  "publicada",
  "rechazada",
  "archivada",
]);

export const tipoPublicacion = pgEnum("tipo_publicacion", ["foto", "video"]);

export const categoriaPublicacion = pgEnum("categoria_publicacion", [
  "Ofertas",
  "Novedades",
  "Comunidad",
]);

export const publicaciones = pgTable(
  "publicaciones",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    /** Parte final de la URL: /anuncios/<slug>. */
    slug: text("slug").notNull().unique(),

    titulo: text("titulo").notNull(),
    texto: text("texto").notNull(),
    tipo: tipoPublicacion("tipo").notNull().default("foto"),
    categoria: categoriaPublicacion("categoria").notNull(),
    ciudad: text("ciudad").notNull(),

    /** En guaranies. 0 = sin precio (una novedad, no una oferta). */
    precio: integer("precio").notNull().default(0),

    /** Quien publica: Dona Compra, un mayorista socio, un comerciante. */
    autor: text("autor").notNull(),

    /** Imagen de portada. En un video, el fotograma de presentacion. */
    imagen: text("imagen").notNull(),
    imagenAlt: text("imagen_alt"),

    /**
     * URL del reproductor externo (Cloudflare Stream, Vimeo o YouTube no
     * listado). Los videos no se alojan aca: solo se embeben.
     */
    videoUrl: text("video_url"),

    estado: estadoPublicacion("estado").notNull().default("pendiente"),

    /** Fecha que se muestra; puede diferir de cuando se cargo. */
    fecha: date("fecha").notNull(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .notNull()
      .defaultNow(),
    publicadoEn: timestamp("publicado_en", { withTimezone: true }),

    /** Nota interna de moderacion, no se muestra. */
    notaModeracion: text("nota_moderacion"),
  },
  (t) => [
    index("publicaciones_estado_fecha_idx").on(t.estado, t.fecha),
    index("publicaciones_categoria_idx").on(t.categoria),
    index("publicaciones_ciudad_idx").on(t.ciudad),
    index("publicaciones_precio_idx").on(t.precio),
  ],
);

/**
 * Me gusta.
 *
 * Sin cuentas todavia, cada visitante se identifica por un id opaco guardado
 * en una cookie propia. No permite saber quien es, solo evitar que la misma
 * persona sume el mismo me gusta dos veces.
 */
export const reacciones = pgTable(
  "reacciones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    publicacionId: uuid("publicacion_id")
      .notNull()
      .references(() => publicaciones.id, { onDelete: "cascade" }),
    visitante: text("visitante").notNull(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    // Una reaccion por visitante y publicacion.
    uniqueIndex("reacciones_unica_idx").on(t.publicacionId, t.visitante),
    index("reacciones_publicacion_idx").on(t.publicacionId),
  ],
);

export type Publicacion = typeof publicaciones.$inferSelect;
export type NuevaPublicacion = typeof publicaciones.$inferInsert;
