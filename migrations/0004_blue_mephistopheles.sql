CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text(500) NOT NULL,
	`filename` text(255) NOT NULL,
	`content_type` text(100),
	`size` integer,
	`resource_type` text(50) NOT NULL,
	`resource_id` text(50) NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_key_unique` ON `media` (`key`);--> statement-breakpoint
CREATE INDEX `idx_media_resource` ON `media` (`resource_type`,`resource_id`);--> statement-breakpoint
CREATE INDEX `idx_media_key` ON `media` (`key`);