"use server";

import { db } from "@/db";
import { deliverables } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function submitDeliverableFeedback(
  id: string, 
  status: "APPROVED" | "REVISIONS_REQUESTED", 
  feedback?: string
) {
  await db.update(deliverables)
    .set({
      clientStatus: status,
      clientFeedback: feedback || null,
    })
    .where(eq(deliverables.id, id));

  revalidatePath(`/projects`);
}
