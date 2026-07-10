"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function verifyPortalPin(slug: string, pin: string) {
  const [project] = await db
    .select({ portalPin: projects.portalPin })
    .from(projects)
    .where(eq(projects.slug, slug));

  if (!project) {
    throw new Error("Project not found");
  }

  // If there's no PIN required for this project, just succeed
  if (!project.portalPin) {
    return { success: true };
  }

  if (project.portalPin !== pin) {
    throw new Error("Incorrect PIN");
  }

  // Set the authentication cookie
  const cookieStore = await cookies();
  cookieStore.set(`client_portal_auth_${slug}`, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: `/p/${slug}`,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return { success: true };
}
