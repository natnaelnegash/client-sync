"use server";

import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addTask(
  projectId: string,
  milestoneId: string,
  title: string,
) {
  if (!title) throw new Error("Title is required");

  // Get current max order for this milestone's tasks
  const existing = await db
    .select()
    .from(tasks)
    .where(eq(tasks.milestoneId, milestoneId));

  const nextOrder = existing.length;

  await db.insert(tasks).values({
    projectId,
    milestoneId,
    title,
    order: nextOrder,
  });

  revalidatePath(`/projects`);
}

export async function toggleTask(id: string) {
  const [task] = await db
    .select()
    .from(tasks)
    .where(eq(tasks.id, id));

  if (!task) throw new Error("Task not found");

  await db
    .update(tasks)
    .set({ isCompleted: !task.isCompleted })
    .where(eq(tasks.id, id));

  revalidatePath(`/projects`);
}

export async function deleteTask(id: string) {
  await db.delete(tasks).where(eq(tasks.id, id));
  revalidatePath(`/projects`);
}
