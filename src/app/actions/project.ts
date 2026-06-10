"use server";

import { db } from "@/db";
import { projects, clients } from "@/db/schema";
import { sendUploadNotificationEmail } from "@/lib/mail";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

export async function createProject(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");
  
  const clientName = formData.get("clientName") as string;
  const projectName = formData.get("projectName") as string;
  const scopeOfWork = formData.get("scopeOfWork") as string;
  console.log(clientName, projectName, scopeOfWork);

  const slug = `${clientName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${nanoid(6)}`;

  let [client] = await db.select().from(clients).where(eq(clients.name, clientName));
  if (!client) {
    [client] = await db.insert(clients).values({
      userId,
      name: clientName,
    }).returning();
  }

  await db.insert(projects).values({
    userId,
    clientId: client.id,
    projectName,
    scopeOfWork,
    slug,
  });

  revalidatePath("/projects");
  revalidatePath("/dashboard");
}

export async function signProject(slug: string, formData: FormData) {
  const clientSignature = formData.get("clientSignature") as string;

  await db.update(projects)
    .set({
      clientSignature,
      status: "COLLECTING_ASSETS"
    })
    .where(eq(projects.slug, slug));

  revalidatePath(`/p/${slug}`);
}

export async function completeAssetCollection(slug: string) {
  try {
    await db.update(projects)
    .set({status: 'IN_PROGRESS'})
    .where(eq(projects.slug, slug))

    revalidatePath(`/p/${slug}`)
    revalidatePath('/dashboard')
  } catch (error) {
    console.error('Status update error', error)
    throw new Error('Failed to update status')
  }
}

export async function notifyUploadAction(slug: string) {
  try {
    const [project] = await db
      .select({
        projectName: projects.projectName,
        clientName: clients.name
      })
      .from(projects)
      .innerJoin(clients, eq(projects.clientId, clients.id))
      .where(eq(projects.slug, slug))

    if (project) {
      await sendUploadNotificationEmail(project.clientName, project.projectName)
    }
    revalidatePath(`/p/${slug}`)
  } catch (error) {
    console.error('Notification error', error)
    throw new Error('Failed to send notification')
  }
}