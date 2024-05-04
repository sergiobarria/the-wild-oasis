CREATE TABLE `cabins` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL,
	`slug` text(100) NOT NULL,
	`max_capacity` integer DEFAULT 1 NOT NULL,
	`price` integer DEFAULT 0 NOT NULL,
	`discount_price` integer DEFAULT 0,
	`description` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cabins_name_unique` ON `cabins` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `cabins_slug_unique` ON `cabins` (`slug`);