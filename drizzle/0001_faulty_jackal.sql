CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`emailId` varchar(256),
	`password` varchar(15),
	`phone` varchar(11),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_idx` UNIQUE(`emailId`)
);
