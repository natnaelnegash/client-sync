"use server";

import { db } from "@/db";
import { projects, clients, deliverables, invoices } from "@/db/schema";
import { sendUploadNotificationEmail, sendProjectWelcomeEmail, sendReminderEmail } from "@/lib/mail";
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
  const projectValue = Number(formData.get("projectInvoiceAmount"));
  console.log(clientName, projectName, scopeOfWork);

  const slug = `${clientName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${nanoid(6)}`;
  
  // Generate a random 4-digit PIN
  const portalPin = Math.floor(1000 + Math.random() * 9000).toString();

  let [client] = await db.select().from(clients).where(eq(clients.name, clientName));
  if (!client) {
    [client] = await db.insert(clients).values({
      userId,
      name: clientName,
    }).returning();
  }

  const [project] = await db.insert(projects).values({
    userId,
    clientId: client.id,
    projectName,
    scopeOfWork,
    slug,
    portalPin,
  }).returning();

  // Create mock deliverables for the demo
  await db.insert(deliverables).values([
    { projectId: project.id, title: "Brand Strategy Document", status: "Complete" },
    { projectId: project.id, title: "Logo System (All Variants)", status: "In progress..." },
    { projectId: project.id, title: "Brand Guidelines PDF", status: "In progress..." },
    { projectId: project.id, title: "Social Media Templates", status: "Pending" },
  ]);

  // Create mock invoice
  await db.insert(invoices).values({
    projectId: project.id,
    amount: projectValue, // $6,200.00
    status: "UNPAID",
  });

  // Attempt to send the welcome email asynchronously
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const magicLink = `${appUrl}/p/${slug}`;
    if (client.email) {
      await sendProjectWelcomeEmail(client.email, client.name, project.projectName, magicLink, portalPin);
    } 
  } catch (emailError) {
    console.error("Failed to send welcome email:", emailError);
  }

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

export async function sendReminderAction(slug: string) {
  try {
    const [project] = await db
      .select({
        projectName: projects.projectName,
        clientName: clients.name,
        clientEmail: clients.email
      })
      .from(projects)
      .innerJoin(clients, eq(projects.clientId, clients.id))
      .where(eq(projects.slug, slug))

    if (project && project.clientEmail) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const magicLink = `${appUrl}/p/${slug}`;
      await sendReminderEmail(project.clientEmail, project.clientName, project.projectName, magicLink);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Reminder email error', error)
    throw new Error('Failed to send reminder email')
  }
}

export async function updateProjectStatus(slug: string, status: "AWAITING_SIGNATURE" | "COLLECTING_ASSETS" | "IN_PROGRESS" | "IN_REVIEW" | "DELIVERY" | "COMPLETED") {
  await db.update(projects)
    .set({ status })
    .where(eq(projects.slug, slug));
  
  revalidatePath(`/projects`);
  revalidatePath(`/p/${slug}`);
  revalidatePath(`/dashboard`);
}

export async function updateProjectScope(slug: string, scopeOfWork: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  await db.update(projects)
    .set({ scopeOfWork })
    .where(eq(projects.slug, slug));
    
  revalidatePath(`/projects/${slug}`);
  revalidatePath(`/p/${slug}`);
}