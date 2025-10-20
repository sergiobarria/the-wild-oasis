CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`cabin_id` text NOT NULL,
	`user_id` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text NOT NULL,
	`author_name` text NOT NULL,
	FOREIGN KEY (`cabin_id`) REFERENCES `cabins`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
