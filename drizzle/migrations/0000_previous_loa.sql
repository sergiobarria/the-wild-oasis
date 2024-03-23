CREATE TABLE `cabins` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`max_capacity` integer DEFAULT 1 NOT NULL,
	`regular_price` numeric NOT NULL,
	`discount_price` numeric,
	`description` text,
	`image_url` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cabins_name_unique` ON `cabins` (`name`);