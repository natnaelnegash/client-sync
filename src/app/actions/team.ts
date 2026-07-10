"use server";

import { db } from "@/db";
import { teamMembers, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { sendTeamInviteEmail } from "@/lib/mail";
import { getWorkspaceOwnerId } from "@/utils/workspace";

export async function inviteMember(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const ownerId = await getWorkspaceOwnerId(session.user.id, session.user.email);

  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  if (!email || !role) {
    throw new Error("Missing required fields");
  }

  // Check if they are already invited
  const existing = await db.select().from(teamMembers).where(and(eq(teamMembers.workspaceOwnerId, ownerId), eq(teamMembers.email, email)));
  if (existing.length > 0) {
    throw new Error("User is already invited");
  }

  // Insert invite
  await db.insert(teamMembers).values({
    workspaceOwnerId: ownerId,
    email,
    role,
    status: "Pending",
  });

  // Get workspace owner's name
  const [owner] = await db.select().from(users).where(eq(users.id, ownerId));
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const inviteLink = `${appUrl}/login?callbackUrl=/invite`;

  await sendTeamInviteEmail(email, owner?.name || "A workspace owner", inviteLink);

  revalidatePath("/settings");
}

export async function updateMemberRole(memberId: string, role: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const ownerId = await getWorkspaceOwnerId(session.user.id, session.user.email);

  await db.update(teamMembers)
    .set({ role })
    .where(and(eq(teamMembers.id, memberId), eq(teamMembers.workspaceOwnerId, ownerId)));

  revalidatePath("/settings");
}

export async function removeMember(memberId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const ownerId = await getWorkspaceOwnerId(session.user.id, session.user.email);

  await db.delete(teamMembers)
    .where(and(eq(teamMembers.id, memberId), eq(teamMembers.workspaceOwnerId, ownerId)));

  revalidatePath("/settings");
}
