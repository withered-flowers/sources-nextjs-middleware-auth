CREATE TABLE `table_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`superadmin` integer,
	`original_name` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `table_users_email_unique` ON `table_users` (`email`);