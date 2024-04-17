CREATE TABLE `cabins` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cabins_name_unique` ON `cabins` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `cabins_slug_unique` ON `cabins` (`slug`);