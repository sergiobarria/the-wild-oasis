CREATE TABLE `cabins_amenities` (
	`cabin_id` text NOT NULL,
	`amenity_id` text NOT NULL,
	PRIMARY KEY(`cabin_id`, `amenity_id`),
	FOREIGN KEY (`cabin_id`) REFERENCES `cabins`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`amenity_id`) REFERENCES `amenities`(`id`) ON UPDATE no action ON DELETE cascade
);
