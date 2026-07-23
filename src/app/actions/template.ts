"use server";

import { db } from "@/db";
import { projectTemplates, templateMilestones, templateDeliverables, templateTasks, workspaceSettings, projectTypes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { getWorkspaceOwnerId } from "@/utils/workspace";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

export async function createTemplate(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const ownerId = await getWorkspaceOwnerId(session.user.id, session.user.email);
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as any;

  console.log('Template type');
  

  const [projectType] = await db.select().from(projectTypes).where(eq(projectTypes.name, type))
  if (!projectType) throw new Error("Project type not found");

  const typeId = projectType.id

  const [newTemplate] = await db.insert(projectTemplates).values({
    userId: ownerId,
    name,
    description,
    typeId,
  }).returning();
  
  // Create default milestone
  await db.insert(templateMilestones).values({
    templateId: newTemplate.id,
    title: "Phase 1: Discovery",
    order: 0,
  });
  
  revalidatePath("/templates");
  return { id: newTemplate.id };
}

export async function updateTemplate(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as any;

  const [projectType] = await db.select().from(projectTypes).where(eq(projectTypes.name, type))
  if (!projectType) throw new Error("Project type not found");

  const typeId = projectType.id
  
  await db.update(projectTemplates)
    .set({ name, description, typeId })
    .where(eq(projectTemplates.id, id));
    
  revalidatePath(`/templates/${id}`);
}

export async function deleteTemplate(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  await db.delete(projectTemplates).where(eq(projectTemplates.id, id));
  revalidatePath("/templates");
}

export async function createTemplateMilestone(templateId: string, title: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  await db.insert(templateMilestones).values({
    templateId,
    title,
  });
  revalidatePath(`/templates/${templateId}`);
}

export async function deleteTemplateMilestone(id: string, templateId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  await db.delete(templateMilestones).where(eq(templateMilestones.id, id));
  revalidatePath(`/templates/${templateId}`);
}

export async function createTemplateDeliverable(milestoneId: string, title: string, typeId: any, templateId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  await db.insert(templateDeliverables).values({
    milestoneId,
    title,
    typeId,
  });
  revalidatePath(`/templates/${templateId}`);
}

export async function deleteTemplateDeliverable(id: string, templateId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  await db.delete(templateDeliverables).where(eq(templateDeliverables.id, id));
  revalidatePath(`/templates/${templateId}`);
}

export async function createTemplateTask(milestoneId: string | null, deliverableId: string | null, title: string, templateId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  await db.insert(templateTasks).values({
    milestoneId,
    deliverableId,
    title,
  });
  revalidatePath(`/templates/${templateId}`);
}

export async function deleteTemplateTask(id: string, templateId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  await db.delete(templateTasks).where(eq(templateTasks.id, id));
  revalidatePath(`/templates/${templateId}`);
}

export async function getTemplates() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];
  
  const systemTemplates = await db
      .select()
      .from(projectTemplates)
      .where(eq(projectTemplates.type, "SYSTEM"))
      .orderBy(desc(projectTemplates.createdAt));
  
    const customTemplates = await db
      .select()
      .from(projectTemplates)
      .where(eq(projectTemplates.userId, userId))
      .orderBy(desc(projectTemplates.createdAt));
  
    return [...systemTemplates, ...customTemplates];
}

export async function getTemplatesById(tempId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];
  
  const systemTemplates = await db
      .select()
      .from(projectTemplates)
      .where(eq(projectTemplates.type, "SYSTEM"))
      .orderBy(desc(projectTemplates.createdAt));
  
  const customTemplates = await db
    .select()
    .from(projectTemplates)
    .where(eq(projectTemplates.userId, userId))
    .orderBy(desc(projectTemplates.createdAt));

    const allTemplates = [...systemTemplates, ...customTemplates]

    const template = allTemplates.filter((temp) => temp.id === tempId)
    if (template) {
      return template
    } else {
      notFound()
    }
     
}