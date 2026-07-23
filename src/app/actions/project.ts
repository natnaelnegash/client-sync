"use server";

import { db } from "@/db";
import {
  projects,
  clients,
  deliverables,
  invoices,
  projectTypes,
  projectTemplates,
  templateMilestones,
  templateDeliverables,
  templateTasks,
  milestones,
  tasks,
} from "@/db/schema";
import {
  sendUploadNotificationEmail,
  sendProjectWelcomeEmail,
  sendReminderEmail,
  sendWelcomingEmailToClient,
} from "@/lib/mail";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { getTemplatesById } from "./template";

export async function createProject(formData: FormData, sourceTemplateId: string | null) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const clientName = formData.get("clientName") as string;
  const projectName = formData.get("projectName") as string;
  const scopeOfWork = formData.get("scopeOfWork") as string;
  const projectValue = Number(formData.get("projectInvoiceAmount"));
  const projectType = formData.get("projectType") as string;

  const slug = `${clientName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${nanoid(6)}`;
  // Generate a random 4-digit PIN
  const portalPin = Math.floor(1000 + Math.random() * 9000).toString();

  let [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.name, clientName));
  if (!client) {
    [client] = await db
      .insert(clients)
      .values({
        userId,
        name: clientName,
      })
      .returning();
  }

  if (sourceTemplateId !== null) {
    const sourceTemplate = await db.query.projectTemplates.findFirst({
      where: eq(projectTemplates.id, sourceTemplateId),
      with: {
        milestones: {
          with: {
            deliverables: {
              with: {
                tasks: true,
              },
            },
          },
        },
      },
    });
    if (sourceTemplate) {
      await db.transaction(async (tx) => {
        const [liveProject] = await tx
          .insert(projects)
          .values({
            userId,
            typeId: sourceTemplate.typeId,
            clientId: client.id,
            projectName,
            scopeOfWork,
            slug,
            sourceTemplateId: sourceTemplate?.id,
            portalPin,
          })
          .returning();

        for (const templateMilestone of sourceTemplate?.milestones) {
          const [liveMilestone] = await tx
            .insert(milestones)
            .values({
              projectId: liveProject.id,
              title: templateMilestone.title,
              order: templateMilestone.order,
            })
            .returning();

          for (const templateDeliverable of templateMilestone.deliverables) {
            const [liveDeliverable] = await tx
              .insert(deliverables)
              .values({
                projectId: liveProject.id,
                title: templateDeliverable.title,
                milestoneId: liveMilestone.id,
                typeId: templateDeliverable.typeId,
              })
              .returning();
            for (const templateTask of templateDeliverable.tasks) {
              await tx.insert(tasks).values({
                projectId: liveProject.id,
                milestoneId: liveMilestone.id,
                deliverableId: liveDeliverable.id,
                title: templateTask.title,
              });
            }
          }
        }
        // Create mock invoice
        await tx.insert(invoices).values({
          projectId: liveProject.id,
          amount: projectValue, // $6,200.00
          status: "UNPAID",
        });

        await sendWelcomingEmailToClient(client, slug, liveProject, portalPin);

        revalidatePath("/projects");
        revalidatePath("/dashboard");
      });
    }
  } else {
    const typeId = await getProjectTypeId(projectType);
    const [project] = await db
      .insert(projects)
      .values({
        userId,
        typeId,
        clientId: client.id,
        projectName,
        scopeOfWork,
        slug,
        portalPin,
      })
      .returning();

    // Create mock invoice
    await db.insert(invoices).values({
      projectId: project.id,
      amount: projectValue, // $6,200.00
      status: "UNPAID",
    });

    await sendWelcomingEmailToClient(client, slug, project, portalPin);

    revalidatePath("/projects");
    revalidatePath("/dashboard");
  }
}

export async function signProject(slug: string, formData: FormData) {
  const clientSignature = formData.get("clientSignature") as string;

  await db
    .update(projects)
    .set({
      clientSignature,
      status: "COLLECTING_ASSETS",
    })
    .where(eq(projects.slug, slug));

  revalidatePath(`/p/${slug}`);
}

export async function completeAssetCollection(slug: string) {
  try {
    await db
      .update(projects)
      .set({ status: "IN_PROGRESS" })
      .where(eq(projects.slug, slug));

    revalidatePath(`/p/${slug}`);
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Status update error", error);
    throw new Error("Failed to update status");
  }
}

export async function notifyUploadAction(slug: string) {
  try {
    const [project] = await db
      .select({
        projectName: projects.projectName,
        clientName: clients.name,
      })
      .from(projects)
      .innerJoin(clients, eq(projects.clientId, clients.id))
      .where(eq(projects.slug, slug));

    if (project) {
      await sendUploadNotificationEmail(
        project.clientName,
        project.projectName,
      );
    }
    revalidatePath(`/p/${slug}`);
  } catch (error) {
    console.error("Notification error", error);
    throw new Error("Failed to send notification");
  }
}

export async function sendReminderAction(slug: string) {
  try {
    const [project] = await db
      .select({
        projectName: projects.projectName,
        clientName: clients.name,
        clientEmail: clients.email,
      })
      .from(projects)
      .innerJoin(clients, eq(projects.clientId, clients.id))
      .where(eq(projects.slug, slug));

    if (project && project.clientEmail) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const magicLink = `${appUrl}/p/${slug}`;
      await sendReminderEmail(
        project.clientEmail,
        project.clientName,
        project.projectName,
        magicLink,
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Reminder email error", error);
    throw new Error("Failed to send reminder email");
  }
}

export async function updateProjectStatus(
  slug: string,
  status:
    | "AWAITING_SIGNATURE"
    | "COLLECTING_ASSETS"
    | "IN_PROGRESS"
    | "IN_REVIEW"
    | "DELIVERY"
    | "COMPLETED",
) {
  await db.update(projects).set({ status }).where(eq(projects.slug, slug));

  revalidatePath(`/projects`);
  revalidatePath(`/p/${slug}`);
  revalidatePath(`/dashboard`);
}

export async function updateProjectScope(slug: string, scopeOfWork: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.update(projects).set({ scopeOfWork }).where(eq(projects.slug, slug));

  revalidatePath(`/projects/${slug}`);
  revalidatePath(`/p/${slug}`);
}
export async function getProjectTypeId(projectType: string){
  const [type] = await db
        .select()
        .from(projectTypes)
        .where(eq(projectTypes.name, projectType));
  if (!type) throw new Error("Project type not found");
  return type.id
}
