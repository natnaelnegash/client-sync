"use server";

import { db } from "@/db";
import { clients } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export async function createClient(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const company = formData.get("company") as string;
  const phone = formData.get("phone") as string;

  if (!name) {
    throw new Error("Name is required");
  }

  await db.insert(clients).values({
    userId,
    name,
    email: email || null,
    company: company || null,
    phone: phone || null,
  });

  revalidatePath("/clients");
}

export async function getClients() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];
  
  return await db.select().from(clients).where(eq(clients.userId, userId));
}

export async function updateClient(clientId: string, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const company = formData.get("company") as string;
  const phone = formData.get("phone") as string;

  if (!name) {
    throw new Error("Name is required");
  }

  // Ensure this client belongs to the user
  const [existingClient] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, clientId));

  if (!existingClient || existingClient.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await db.update(clients).set({
    name,
    email: email || null,
    company: company || null,
    phone: phone || null,
  }).where(eq(clients.id, clientId));

  revalidatePath("/clients");
}
