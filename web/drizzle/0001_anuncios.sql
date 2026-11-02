CREATE TYPE "public"."categoria_publicacion" AS ENUM('Ofertas', 'Novedades', 'Comunidad');--> statement-breakpoint
CREATE TYPE "public"."estado_publicacion" AS ENUM('pendiente', 'publicada', 'rechazada', 'archivada');--> statement-breakpoint
CREATE TYPE "public"."tipo_publicacion" AS ENUM('foto', 'video');--> statement-breakpoint
CREATE TABLE "publicaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"titulo" text NOT NULL,
	"texto" text NOT NULL,
	"tipo" "tipo_publicacion" DEFAULT 'foto' NOT NULL,
	"categoria" "categoria_publicacion" NOT NULL,
	"ciudad" text NOT NULL,
	"precio" integer DEFAULT 0 NOT NULL,
	"autor" text NOT NULL,
	"imagen" text NOT NULL,
	"imagen_alt" text,
	"video_url" text,
	"estado" "estado_publicacion" DEFAULT 'pendiente' NOT NULL,
	"fecha" date NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"publicado_en" timestamp with time zone,
	"nota_moderacion" text,
	CONSTRAINT "publicaciones_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "reacciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"publicacion_id" uuid NOT NULL,
	"visitante" text NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reacciones" ADD CONSTRAINT "reacciones_publicacion_id_publicaciones_id_fk" FOREIGN KEY ("publicacion_id") REFERENCES "public"."publicaciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "publicaciones_estado_fecha_idx" ON "publicaciones" USING btree ("estado","fecha");--> statement-breakpoint
CREATE INDEX "publicaciones_categoria_idx" ON "publicaciones" USING btree ("categoria");--> statement-breakpoint
CREATE INDEX "publicaciones_ciudad_idx" ON "publicaciones" USING btree ("ciudad");--> statement-breakpoint
CREATE INDEX "publicaciones_precio_idx" ON "publicaciones" USING btree ("precio");--> statement-breakpoint
CREATE UNIQUE INDEX "reacciones_unica_idx" ON "reacciones" USING btree ("publicacion_id","visitante");--> statement-breakpoint
CREATE INDEX "reacciones_publicacion_idx" ON "reacciones" USING btree ("publicacion_id");