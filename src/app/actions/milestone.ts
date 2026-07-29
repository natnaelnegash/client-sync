"use server";

import { db } from "@/db";
import { milestones } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addMilestone(projectId: string, title: string) {
  if (!title) throw new Error("Title is required");

  // Get current max order for this project's milestones
  const existing = await db
    .select()
    .from(milestones)
    .where(eq(milestones.projectId, projectId));

  const nextOrder = existing.length;

  await db.insert(milestones).values({
    projectId,
    title,
    order: nextOrder,
  });

  revalidatePath(`/projects`);
}

export async function updateMilestoneStatus(
  id: string,
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED",
) {
  await db
    .update(milestones)
    .set({ status })
    .where(eq(milestones.id, id));

  revalidatePath(`/projects`);
}

export async function deleteMilestone(id: string) {
  await db.delete(milestones).where(eq(milestones.id, id));
  revalidatePath(`/projects`);
}
