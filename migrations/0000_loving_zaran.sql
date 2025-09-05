CREATE TABLE `cabins` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`price` integer NOT NULL,
	`discount_percentage` integer DEFAULT 0,
	`max_capacity` integer NOT NULL,
	`description` text(1000),
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cabins_slug_unique` ON `cabins` (`slug`);