CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`cabin_id` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`num_nights` integer NOT NULL,
	`num_guests` integer NOT NULL,
	`cabin_price` integer NOT NULL,
	`extras_price` integer NOT NULL,
	`total_price` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`has_breakfast` integer DEFAULT false NOT NULL,
	`is_paid` integer DEFAULT false NOT NULL,
	`observations` text(1000),
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`cabin_id`) REFERENCES `cabins`(`id`) ON UPDATE no action ON DELETE cascade
);
