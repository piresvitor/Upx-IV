CREATE TABLE "places" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"place_id" text NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"types" text[] DEFAULT '{}' NOT NULL,
	"rating" double precision,
	"user_ratings_total" double precision,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "places_place_id_unique" UNIQUE("place_id")
);
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "place_id" uuid;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;