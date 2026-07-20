CREATE TABLE `attribution` (
	`attribution_id` text PRIMARY KEY NOT NULL,
	`offre_id` text NOT NULL,
	`parrain_id` text NOT NULL,
	`lien_id` text,
	`token` text NOT NULL,
	`canal_source` text DEFAULT 'page_web' NOT NULL,
	`origine_detectee` text DEFAULT 'direct_autre' NOT NULL,
	`statut` text DEFAULT 'en_attente' NOT NULL,
	`session_id` text,
	`date_generation` integer NOT NULL,
	`date_redirection` integer,
	`referrer_redirection` text,
	`date_expiration` integer,
	`date_confirmation` integer,
	`delai_confirmation_j` integer,
	`mode_confirmation` text,
	`montant_commission` real,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`offre_id`) REFERENCES `offre`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`parrain_id`) REFERENCES `parrain`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`lien_id`) REFERENCES `lien_parrainage`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `attribution_token_unique` ON `attribution` (`token`);--> statement-breakpoint
CREATE INDEX `attribution_token_idx` ON `attribution` (`token`);--> statement-breakpoint
CREATE INDEX `attribution_offre_idx` ON `attribution` (`offre_id`);--> statement-breakpoint
CREATE TABLE `lien_parrainage` (
	`id` text PRIMARY KEY NOT NULL,
	`parrain_id` text NOT NULL,
	`offre_id` text NOT NULL,
	`url_parrainage` text NOT NULL,
	`code_parrainage` text,
	`quota_max` integer,
	`quota_utilise` integer DEFAULT 0 NOT NULL,
	`date_dernier_tour` integer,
	`date_reinitialisation` text,
	`statut` text DEFAULT 'actif' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`parrain_id`) REFERENCES `parrain`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`offre_id`) REFERENCES `offre`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lien_parrain_offre_unique` ON `lien_parrainage` (`parrain_id`,`offre_id`);--> statement-breakpoint
CREATE INDEX `lien_offre_idx` ON `lien_parrainage` (`offre_id`);--> statement-breakpoint
CREATE TABLE `offre` (
	`id` text PRIMARY KEY NOT NULL,
	`nom_programme` text NOT NULL,
	`categorie` text NOT NULL,
	`sous_categorie` text,
	`cible` text,
	`pays` text,
	`langue` text,
	`url_parrainage` text NOT NULL,
	`code_parrainage` text,
	`description_courte` text,
	`avantage_filleul` text,
	`avantage_parrain` text,
	`conditions` text,
	`statut` text DEFAULT 'en_attente_verification' NOT NULL,
	`priorite_affichage` integer DEFAULT 99 NOT NULL,
	`tags_mcp` text,
	`date_ajout` text,
	`date_verification` text,
	`source` text,
	`notes` text,
	`divulgation_affiliation` text,
	`mention_risque` text,
	`mention_non_affiliation` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `parrain` (
	`id` text PRIMARY KEY NOT NULL,
	`nom` text NOT NULL,
	`email` text,
	`statut` text DEFAULT 'actif' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `signalement` (
	`id` text PRIMARY KEY NOT NULL,
	`attribution_id` text,
	`offre_id` text,
	`session_id` text,
	`statut` text DEFAULT 'ouvert' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`attribution_id`) REFERENCES `attribution`(`attribution_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`offre_id`) REFERENCES `offre`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `signalement_attribution_idx` ON `signalement` (`attribution_id`);