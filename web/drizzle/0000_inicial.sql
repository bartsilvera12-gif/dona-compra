CREATE TYPE "public"."asunto_mensaje" AS ENUM('Comerciante', 'Mayorista', 'Prensa', 'Otro');--> statement-breakpoint
CREATE TYPE "public"."estado_mensaje" AS ENUM('nuevo', 'leido', 'respondido', 'spam');--> statement-breakpoint
CREATE TABLE "mensajes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"nombre" text NOT NULL,
	"apellido" text NOT NULL,
	"correo" text NOT NULL,
	"telefono" text NOT NULL,
	"asunto" "asunto_mensaje" NOT NULL,
	"mensaje" text NOT NULL,
	"negocio" text,
	"ciudad" text,
	"estado" "estado_mensaje" DEFAULT 'nuevo' NOT NULL,
	"ip_hash" text,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "suscriptores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"correo" text NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"confirmado_en" timestamp with time zone,
	"baja_en" timestamp with time zone,
	"token" text NOT NULL,
	"ip_hash" text,
	CONSTRAINT "suscriptores_correo_unique" UNIQUE("correo")
);
--> statement-breakpoint
CREATE INDEX "mensajes_creado_en_idx" ON "mensajes" USING btree ("creado_en");--> statement-breakpoint
CREATE INDEX "mensajes_estado_idx" ON "mensajes" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "mensajes_ip_hash_idx" ON "mensajes" USING btree ("ip_hash");--> statement-breakpoint
CREATE INDEX "suscriptores_token_idx" ON "suscriptores" USING btree ("token");--> statement-breakpoint
CREATE INDEX "suscriptores_creado_en_idx" ON "suscriptores" USING btree ("creado_en");