"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createInvoice(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const projectId = formData.get("projectId") as string;
  const amountStr = formData.get("amount") as string;
  const dueDateStr = formData.get("dueDate") as string;

  if (!projectId || !amountStr) {
    throw new Error("Missing required fields");
  }

  // Convert amount from dollars to cents
  const amountCents = Math.round(parseFloat(amountStr) * 100);

  // Parse due date if provided
  let dueDate: Date | null = null;
  if (dueDateStr) {
    dueDate = new Date(dueDateStr);
  }

  await db.insert(invoices).values({
    projectId,
    amount: amountCents,
    dueDate,
    status: "UNPAID",
  });

  revalidatePath("/invoices");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
}
