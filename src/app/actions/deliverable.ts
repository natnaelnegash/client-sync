"use server";

import { db } from "@/db";
import { deliverables } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addDeliverable(projectId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const invoiceId = formData.get("invoiceId") as string | null;
  const requiresPayment = formData.get("requiresPayment") === "true";
  
  if (!title) throw new Error("Title is required");

  await db.insert(deliverables).values({
    projectId,
    title,
    description: description || null,
    invoiceId: invoiceId || null,
    requiresPayment,
  });

  revalidatePath(`/projects`);
}

export async function updateDeliverableStatus(id: string, status: "Pending" | "In progress..." | "Complete", fileUrl?: string, previewUrl?: string) {
  await db.update(deliverables)
    .set({ 
      status,
      ...(fileUrl !== undefined && { fileUrl }),
      ...(previewUrl !== undefined && { previewUrl }),
    })
    .where(eq(deliverables.id, id));

  revalidatePath(`/projects`);
}

export async function updateDeliverableUrls(id: string, fileUrl?: string, previewUrl?: string) {
  await db.update(deliverables)
    .set({
      ...(fileUrl !== undefined && { fileUrl }),
      ...(previewUrl !== undefined && { previewUrl }),
      status: "Complete"
    })
    .where(eq(deliverables.id, id));

  revalidatePath(`/projects`);
}

export async function deleteDeliverable(id: string) {
  await db.delete(deliverables).where(eq(deliverables.id, id));
  revalidatePath(`/projects`);
}
