CREATE TABLE IF NOT EXISTS "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"num_nights" integer,
	"num_guests" integer,
	"cabin_price" numeric(10, 2),
	"extras_price" numeric(10, 2),
	"total_price" numeric(10, 2),
	"has_breakfast" boolean DEFAULT false,
	"status" varchar(255),
	"is_paid" boolean DEFAULT false,
	"observations" text,
	"cabin_id" integer,
	"guest_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
