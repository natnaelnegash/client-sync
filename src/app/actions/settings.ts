"use server";

import { db } from "@/db";
import { workspaceSettings } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function updateWhiteLabeling(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const agencyName = formData.get("agencyName") as string;
  const agencyTagline = formData.get("agencyTagline") as string;
  const brandAccentColor = formData.get("brandAccentColor") as string;

  await db.insert(workspaceSettings)
    .values({
      userId,
      agencyName,
      agencyTagline,
      brandAccentColor,
    })
    .onConflictDoUpdate({
      target: workspaceSettings.userId,
      set: {
        agencyName,
        agencyTagline,
        brandAccentColor,
      },
    });

  revalidatePath("/settings");
}

export async function updateClientPortal(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const customSubdomain = formData.get("customSubdomain") as string;
  const showAgencyBranding = formData.get("showAgencyBranding") === "true";
  const allowDownloads = formData.get("allowDownloads") === "true";
  const require2fa = formData.get("require2fa") === "true";
  const emailNotifications = formData.get("emailNotifications") === "true";

  await db.insert(workspaceSettings)
    .values({
      userId,
      customSubdomain,
      showAgencyBranding,
      allowDownloads,
      require2fa,
      emailNotifications,
    })
    .onConflictDoUpdate({
      target: workspaceSettings.userId,
      set: {
        customSubdomain,
        showAgencyBranding,
        allowDownloads,
        require2fa,
        emailNotifications,
      },
    });

  revalidatePath("/settings");
}

export async function updatePayments(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const invoicePrefix = formData.get("invoicePrefix") as string;
  const defaultPaymentTerms = formData.get("defaultPaymentTerms") as string;
  const defaultInvoiceNotes = formData.get("defaultInvoiceNotes") as string;

  await db.insert(workspaceSettings)
    .values({
      userId,
      invoicePrefix,
      defaultPaymentTerms,
      defaultInvoiceNotes,
    })
    .onConflictDoUpdate({
      target: workspaceSettings.userId,
      set: {
        invoicePrefix,
        defaultPaymentTerms,
        defaultInvoiceNotes,
      },
    });

  revalidatePath("/settings");
}
