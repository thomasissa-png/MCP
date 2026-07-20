CREATE TABLE `magic_link_token` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`return_to` text,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`consumed_at` integer
);
--> statement-breakpoint
CREATE INDEX `magic_link_email_idx` ON `magic_link_token` (`email`);--> statement-breakpoint
CREATE TABLE `session` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `session_email_idx` ON `session` (`email`);