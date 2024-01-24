CREATE TABLE IF NOT EXISTS "guests" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255),
	"nationality" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "guests_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"min_booking_length" integer DEFAULT 1,
	"max_booking_length" integer DEFAULT 1,
	"max_guests_per_booking" integer DEFAULT 1,
	"breakfast_price" numeric(10, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "cabins" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "cabins" ADD COLUMN "updated_at" timestamp DEFAULT now();