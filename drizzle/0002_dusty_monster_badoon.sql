ALTER TABLE "deliverable_type" RENAME TO "deliverable_types";--> statement-breakpoint
ALTER TABLE "project_type" RENAME TO "project_types";--> statement-breakpoint
ALTER TABLE "deliverable_types" DROP CONSTRAINT "deliverable_type_slug_unique";--> statement-breakpoint
ALTER TABLE "project_types" DROP CONSTRAINT "project_type_slug_unique";--> statement-breakpoint
ALTER TABLE "deliverables" DROP CONSTRAINT "deliverables_type_id_deliverable_type_id_fk";
--> statement-breakpoint
ALTER TABLE "project_templates" DROP CONSTRAINT "project_templates_type_id_project_type_id_fk";
--> statement-breakpoint
ALTER TABLE "project_types" DROP CONSTRAINT "project_type_created_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_type_id_project_type_id_fk";
--> statement-breakpoint
ALTER TABLE "template_deliverables" DROP CONSTRAINT "template_deliverables_type_id_deliverable_type_id_fk";
--> statement-breakpoint
ALTER TABLE "project_templates" ADD COLUMN "custom" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_type_id_deliverable_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."deliverable_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_templates" ADD CONSTRAINT "project_templates_type_id_project_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."project_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_types" ADD CONSTRAINT "project_types_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_type_id_project_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."project_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_deliverables" ADD CONSTRAINT "template_deliverables_type_id_deliverable_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."deliverable_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliverable_types" ADD CONSTRAINT "deliverable_types_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "project_types" ADD CONSTRAINT "project_types_slug_unique" UNIQUE("slug");--> statement-breakpoint
DROP TYPE "public"."deliverable_type";--> statement-breakpoint
DROP TYPE "public"."project_type";