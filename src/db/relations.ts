import { relations } from "drizzle-orm";
import { projectTemplates, templateDeliverables, templateMilestones, templateTasks } from "./schema";

export const projectTemplateRelations = relations(
    projectTemplates, 
    ({many}) => ({
        milestones: many(templateMilestones)
    })
);

export const templateMilestonesRelations = relations(
    templateMilestones,
    ({one, many}) => ({
        template: one(projectTemplates, {
            fields: [templateMilestones.templateId],
            references: [projectTemplates.id]
        }),
        deliverables: many(templateDeliverables),
        tasks: many(templateTasks) // Added: Milestones can have tasks directly
    })
);

export const templateDeliverablesRelations = relations(
    templateDeliverables,
    ({one, many}) => ({
        milestone: one(templateMilestones, {
            fields: [templateDeliverables.milestoneId],
            references: [templateMilestones.id]
        }),
        tasks: many(templateTasks) 
    })
);

export const templateTasksRelations = relations(
    templateTasks,
    ({one}) => ({
        deliverable: one(templateDeliverables, {
            fields: [templateTasks.deliverableId],
            references: [templateDeliverables.id]
        }),
        milestone: one(templateMilestones, {
            fields: [templateTasks.milestoneId],
            references: [templateMilestones.id]
        })
    })
);