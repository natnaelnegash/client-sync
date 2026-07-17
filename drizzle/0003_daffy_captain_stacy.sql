CREATE TYPE "public"."template_type" AS ENUM('CUSTOM', 'SYSTEM');--> statement-breakpoint
ALTER TABLE "project_templates" RENAME COLUMN "custom" TO "type";