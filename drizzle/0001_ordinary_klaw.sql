CREATE TYPE "public"."deliverable_type" AS ENUM('DESIGN', 'CODE', 'VIDEO', 'DOCUMENT', 'PRESENTATION');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('WEB', 'BRANDING', 'VIDEO', 'MARKETING', 'CUSTOM');--> statement-breakpoint
CREATE TABLE "deliverable_dependencies" (
	"dependent_id" uuid NOT NULL,
	"prerequisite_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deliverable_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"icon" text,
	"color" text,
	"is_system" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "deliverable_type_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "deliverables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"milestone_id" uuid,
	"invoice_id" uuid,
	"type_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'Pending' NOT NULL,
	"preview_url" text,
	"file_url" text,
	"requires_payment" boolean DEFAULT false NOT NULL,
	"client_status" text DEFAULT 'PENDING' NOT NULL,
	"client_feedback" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"sender" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"type_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"config" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"icon" text,
	"color" text,
	"is_system" boolean DEFAULT true NOT NULL,
	"config" jsonb,
	"created_by" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "project_type_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "task_dependencies" (
	"dependent_id" uuid NOT NULL,
	"prerequisite_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"milestone_id" uuid,
	"deliverable_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"is_completed" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_owner_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'Member' NOT NULL,
	"status" text DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "template_deliverables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"milestone_id" uuid NOT NULL,
	"type_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"title" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"milestone_id" uuid,
	"deliverable_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"agency_logo_url" text,
	"agency_name" text DEFAULT 'My Agency' NOT NULL,
	"agency_tagline" text,
	"brand_accent_color" text DEFAULT '#10B981' NOT NULL,
	"custom_subdomain" text,
	"show_agency_branding" boolean DEFAULT true NOT NULL,
	"allow_downloads" boolean DEFAULT true NOT NULL,
	"require_2fa" boolean DEFAULT true NOT NULL,
	"email_notifications" boolean DEFAULT false NOT NULL,
	"invoice_prefix" text DEFAULT 'INV-' NOT NULL,
	"default_payment_terms" text DEFAULT 'Net 30' NOT NULL,
	"default_invoice_notes" text,
	CONSTRAINT "workspace_settings_userId_unique" UNIQUE("userId"),
	CONSTRAINT "workspace_settings_custom_subdomain_unique" UNIQUE("custom_subdomain")
);
--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "title" text DEFAULT 'Project Invoice' NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "checkout_session_id" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "type_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "source_template_id" uuid;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "config" jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "portal_pin" text;--> statement-breakpoint
ALTER TABLE "deliverable_dependencies" ADD CONSTRAINT "deliverable_dependencies_dependent_id_deliverables_id_fk" FOREIGN KEY ("dependent_id") REFERENCES "public"."deliverables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliverable_dependencies" ADD CONSTRAINT "deliverable_dependencies_prerequisite_id_deliverables_id_fk" FOREIGN KEY ("prerequisite_id") REFERENCES "public"."deliverables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_milestone_id_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."milestones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_type_id_deliverable_type_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."deliverable_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_templates" ADD CONSTRAINT "project_templates_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_templates" ADD CONSTRAINT "project_templates_type_id_project_type_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."project_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_type" ADD CONSTRAINT "project_type_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_dependencies" ADD CONSTRAINT "task_dependencies_dependent_id_tasks_id_fk" FOREIGN KEY ("dependent_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_dependencies" ADD CONSTRAINT "task_dependencies_prerequisite_id_tasks_id_fk" FOREIGN KEY ("prerequisite_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_milestone_id_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."milestones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_deliverable_id_deliverables_id_fk" FOREIGN KEY ("deliverable_id") REFERENCES "public"."deliverables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_workspace_owner_id_user_id_fk" FOREIGN KEY ("workspace_owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_deliverables" ADD CONSTRAINT "template_deliverables_milestone_id_template_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."template_milestones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_deliverables" ADD CONSTRAINT "template_deliverables_type_id_deliverable_type_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."deliverable_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_milestones" ADD CONSTRAINT "template_milestones_template_id_project_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."project_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_tasks" ADD CONSTRAINT "template_tasks_milestone_id_template_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."template_milestones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_tasks" ADD CONSTRAINT "template_tasks_deliverable_id_template_deliverables_id_fk" FOREIGN KEY ("deliverable_id") REFERENCES "public"."template_deliverables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_settings" ADD CONSTRAINT "workspace_settings_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_type_id_project_type_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."project_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_source_template_id_project_templates_id_fk" FOREIGN KEY ("source_template_id") REFERENCES "public"."project_templates"("id") ON DELETE no action ON UPDATE no action;