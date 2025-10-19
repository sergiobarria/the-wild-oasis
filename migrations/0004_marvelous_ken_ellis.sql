CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`user_id` text NOT NULL,
	`cabin_id` text NOT NULL,
	`check_in` text NOT NULL,
	`check_out` text NOT NULL,
	`guests` integer NOT NULL,
	`nights` integer NOT NULL,
	`subtotal` real NOT NULL,
	`discount` real DEFAULT 0,
	`cleaning_fee` real DEFAULT 0,
	`service_fee` real DEFAULT 0,
	`booking_fee` real DEFAULT 0,
	`tax` real NOT NULL,
	`total_price` real NOT NULL,
	`stripe_session_id` text,
	`stripe_payment_intent_id` text,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`cabin_id`) REFERENCES `cabins`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_stripe_session_id_unique` ON `bookings` (`stripe_session_id`);