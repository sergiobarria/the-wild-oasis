CREATE TABLE `bookings` (
	`id` text(25) PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`check_in` integer NOT NULL,
	`check_out` integer NOT NULL,
	`number_of_nights` integer NOT NULL,
	`number_of_guests` integer NOT NULL,
	`cabin_price` integer NOT NULL,
	`extras_price` integer NOT NULL,
	`total_price` integer NOT NULL,
	`status` text NOT NULL,
	`has_breakfast` integer NOT NULL,
	`is_paid` integer NOT NULL,
	`observations` text,
	`cabin_id` text(25),
	`guest_id` text(25),
	FOREIGN KEY (`cabin_id`) REFERENCES `cabins`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `cabins` (
	`id` text(25) PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`name` text(255) NOT NULL,
	`max_capacity` integer NOT NULL,
	`regular_price` integer NOT NULL,
	`discount` integer,
	`description` text,
	`image` text
);
--> statement-breakpoint
CREATE TABLE `guests` (
	`id` text(25) PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`first_name` text(255) NOT NULL,
	`last_name` text(255) NOT NULL,
	`email` text(255) NOT NULL,
	`national_id` text(255) NOT NULL,
	`national` text(255),
	`country_flag` text(255)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` text(25) PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`min_booking_length` integer NOT NULL,
	`max_booking_length` integer NOT NULL,
	`max_guests` integer NOT NULL,
	`breakfast_price` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guests_email_unique` ON `guests` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `guests_national_id_unique` ON `guests` (`national_id`);