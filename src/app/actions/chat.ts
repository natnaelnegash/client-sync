"use server";

import { db } from "@/db";
import { messages } from "@/db/schema";
import { pusherServer } from "@/lib/pusher-server";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function sendMessage(projectId: string, sender: "AGENCY" | "CLIENT", content: string) {
  if (!content.trim()) return;

  const [newMessage] = await db.insert(messages).values({
    projectId,
    sender,
    content,
  }).returning();

  try {
    await pusherServer.trigger(
      `project-${projectId}`,
      'new-message',
      newMessage
    );
  } catch (error) {
    console.error("Pusher error:", error);
    // Ignore pusher error if keys are not set, it's just for demo
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/p/${projectId}`);
  
  return newMessage;
}

export async function getProjectMessages(projectId: string) {
  return await db.query.messages.findMany({
    where: eq(messages.projectId, projectId),
    orderBy: [asc(messages.createdAt)],
  });
}
