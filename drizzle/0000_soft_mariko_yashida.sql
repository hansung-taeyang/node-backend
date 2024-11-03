CREATE TABLE `images` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`image_id` varchar(256) NOT NULL,
	`create_at` timestamp DEFAULT (now()),
	`user_email_id` varchar(256),
	CONSTRAINT `images_id` PRIMARY KEY(`id`),
	CONSTRAINT `images_image_id_unique` UNIQUE(`image_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email_id` varchar(256) NOT NULL,
	`password` varchar(15) NOT NULL,
	`phone` varchar(11) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_id_unique` UNIQUE(`email_id`),
	CONSTRAINT `email_idx` UNIQUE(`email_id`)
);
--> statement-breakpoint
ALTER TABLE `images` ADD CONSTRAINT `images_user_email_id_users_email_id_fk` FOREIGN KEY (`user_email_id`) REFERENCES `users`(`email_id`) ON DELETE no action ON UPDATE no action;