CREATE TABLE IF NOT EXISTS "cabins" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"price" numeric(10, 2),
	"max_capacity" integer DEFAULT 1,
	"description" text
);
