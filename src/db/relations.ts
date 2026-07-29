import { relations } from "drizzle-orm";
import {
  projects,
  milestones,
  deliverables,
  tasks,
  projectTemplates,
  templateDeliverables,
  templateMilestones,
  templateTasks,
} from "./schema";

// ═══════════════════════════════════════════
// LIVE EXECUTION TABLE RELATIONS
// ═══════════════════════════════════════════

export const projectRelations = relations(
  projects,
  ({ many }) => ({
    milestones: many(milestones),
    deliverables: many(deliverables),
    tasks: many(tasks),
  })
);

export const milestoneRelations = relations(
  milestones,
  ({ one, many }) => ({
    project: one(projects, {
      fields: [milestones.projectId],
      references: [projects.id],
    }),
    deliverables: many(deliverables),
    tasks: many(tasks),
  })
);

export const deliverableRelations = relations(
  deliverables,
  ({ one, many }) => ({
    project: one(projects, {
      fields: [deliverables.projectId],
      references: [projects.id],
    }),
    milestone: one(milestones, {
      fields: [deliverables.milestoneId],
      references: [milestones.id],
    }),
    tasks: many(tasks),
  })
);

export const taskRelations = relations(
  tasks,
  ({ one }) => ({
    project: one(projects, {
      fields: [tasks.projectId],
      references: [projects.id],
    }),
    milestone: one(milestones, {
      fields: [tasks.milestoneId],
      references: [milestones.id],
    }),
    deliverable: one(deliverables, {
      fields: [tasks.deliverableId],
      references: [deliverables.id],
    }),
  })
);

// ═══════════════════════════════════════════
// TEMPLATE TABLE RELATIONS
// ═══════════════════════════════════════════

export const projectTemplateRelations = relations(
  projectTemplates,
  ({ many }) => ({
    milestones: many(templateMilestones),
  })
);

export const templateMilestonesRelations = relations(
  templateMilestones,
  ({ one, many }) => ({
    template: one(projectTemplates, {
      fields: [templateMilestones.templateId],
      references: [projectTemplates.id],
    }),
    deliverables: many(templateDeliverables),
    tasks: many(templateTasks),
  })
);

export const templateDeliverablesRelations = relations(
  templateDeliverables,
  ({ one, many }) => ({
    milestone: one(templateMilestones, {
      fields: [templateDeliverables.milestoneId],
      references: [templateMilestones.id],
    }),
    tasks: many(templateTasks),
  })
);

export const templateTasksRelations = relations(
  templateTasks,
  ({ one }) => ({
    deliverable: one(templateDeliverables, {
      fields: [templateTasks.deliverableId],
      references: [templateDeliverables.id],
    }),
    milestone: one(templateMilestones, {
      fields: [templateTasks.milestoneId],
      references: [templateMilestones.id],
    }),
  })
);