CREATE TABLE `cabins` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`price_per_night` real NOT NULL,
	`discount_percentage` real,
	`summary` text NOT NULL,
	`max_guests` integer NOT NULL,
	`beds` integer NOT NULL,
	`baths` integer NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cabins_slug_unique` ON `cabins` (`slug`);