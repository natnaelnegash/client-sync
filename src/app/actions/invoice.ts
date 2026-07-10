"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export async function createInvoice(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const projectId = formData.get("projectId") as string;
  const title = formData.get("title") as string;
  const amountStr = formData.get("amount") as string;
  const dueDateStr = formData.get("dueDate") as string;

  if (!projectId || !amountStr || !title) {
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
    title,
    amount: amountCents,
    dueDate,
    status: "UNPAID",
  });

  revalidatePath("/invoices");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
}

export async function deleteInvoice(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.delete(invoices).where(eq(invoices.id, id));
  revalidatePath("/dashboard");
}
