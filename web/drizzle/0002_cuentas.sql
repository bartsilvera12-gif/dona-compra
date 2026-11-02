CREATE TYPE "public"."estado_usuario" AS ENUM('activo', 'suspendido');--> statement-breakpoint
CREATE TYPE "public"."rol_usuario" AS ENUM('admin', 'comerciante', 'mayorista', 'miembro');--> statement-breakpoint
CREATE TABLE "intentos_acceso" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"correo" text NOT NULL,
	"ip_hash" text,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sesiones" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"usuario_id" uuid NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"expira_en" timestamp with time zone NOT NULL,
	"ip_hash" text,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"correo" text NOT NULL,
	"nombre" text NOT NULL,
	"hash" text NOT NULL,
	"rol" "rol_usuario" DEFAULT 'comerciante' NOT NULL,
	"estado" "estado_usuario" DEFAULT 'activo' NOT NULL,
	"negocio" text,
	"ciudad" text,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"ultimo_acceso_en" timestamp with time zone,
	CONSTRAINT "usuarios_correo_unique" UNIQUE("correo")
);
--> statement-breakpoint
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "intentos_correo_idx" ON "intentos_acceso" USING btree ("correo","creado_en");--> statement-breakpoint
CREATE INDEX "intentos_ip_idx" ON "intentos_acceso" USING btree ("ip_hash","creado_en");--> statement-breakpoint
CREATE INDEX "sesiones_usuario_idx" ON "sesiones" USING btree ("usuario_id");--> statement-breakpoint
CREATE INDEX "sesiones_expira_idx" ON "sesiones" USING btree ("expira_en");--> statement-breakpoint
CREATE INDEX "usuarios_rol_idx" ON "usuarios" USING btree ("rol");--> statement-breakpoint
CREATE INDEX "usuarios_estado_idx" ON "usuarios" USING btree ("estado");