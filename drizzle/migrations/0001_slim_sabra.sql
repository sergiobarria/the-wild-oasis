CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY NOT NULL,
	`guest_id` integer NOT NULL,
	`cabin_id` integer NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`num_nights` integer NOT NULL,
	`num_guests` integer NOT NULL,
	`cabin_price` real NOT NULL,
	`extras_price` real NOT NULL,
	`total_price` real NOT NULL,
	`status` text NOT NULL,
	`has_breakfast` integer NOT NULL,
	`is_paid` integer NOT NULL,
	`observations` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `guests` (
	`id` integer PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`nationality` text,
	`national_id` text,
	`country_flag` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`min_booking_length` integer NOT NULL,
	`max_booking_length` integer NOT NULL,
	`max_guests` integer NOT NULL,
	`breakfast_price` real NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE cabins ADD `max_capacity` integer NOT NULL;--> statement-breakpoint
ALTER TABLE cabins ADD `regular_price` real NOT NULL;--> statement-breakpoint
ALTER TABLE cabins ADD `discount_price` real;--> statement-breakpoint
ALTER TABLE cabins ADD `description` text NOT NULL;--> statement-breakpoint
ALTER TABLE cabins ADD `image` text;--> statement-breakpoint
CREATE UNIQUE INDEX `guests_email_unique` ON `guests` (`email`);