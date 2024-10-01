CREATE TABLE `students` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(256),
	`year` int,
	CONSTRAINT `students_id` PRIMARY KEY(`id`),
	CONSTRAINT `name_idx` UNIQUE(`name`)
);
