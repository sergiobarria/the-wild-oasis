CREATE TABLE `cabins` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`max_capacity` integer NOT NULL,
	`price` integer NOT NULL,
	`discount_price` integer,
	`description` text,
	`image` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cabins_name_unique` ON `cabins` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `cabins_slug_unique` ON `cabins` (`slug`);