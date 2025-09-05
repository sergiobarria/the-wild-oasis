CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`min_booking_length` integer NOT NULL,
	`max_booking_length` integer NOT NULL,
	`max_guests` integer NOT NULL,
	`breakfast_price` integer NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer
);
