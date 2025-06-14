CREATE TABLE "public.asignaciones" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehiculo_id" integer NOT NULL,
	"conductor_id" text NOT NULL,
	"status" text NOT NULL,
	"fecha_asignacion" timestamp with time zone DEFAULT now(),
	"motivo" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public.vehiculos" (
	"id" serial PRIMARY KEY NOT NULL,
	"patente" text NOT NULL,
	"marca" text NOT NULL,
	"modelo" text NOT NULL,
	"year" integer NOT NULL,
	"tipo" text NOT NULL,
	"proximo_mantenimiento" timestamp with time zone NOT NULL,
	CONSTRAINT "public.vehiculos_patente_unique" UNIQUE("patente")
);
--> statement-breakpoint
DROP TABLE "asignaciones" CASCADE;--> statement-breakpoint
DROP TABLE "vehiculos" CASCADE;--> statement-breakpoint
ALTER TABLE "public.asignaciones" ADD CONSTRAINT "public.asignaciones_vehiculo_id_public.vehiculos_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."public.vehiculos"("id") ON DELETE no action ON UPDATE no action;