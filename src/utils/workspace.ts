import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkspaceOwnerId(userId: string, userEmail: string | null | undefined): Promise<string> {
  if (!userEmail) return userId;
  
  const [member] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.email, userEmail));
    
  if (member && member.status === "Active") {
    return member.workspaceOwnerId;
  }
  
  return userId;
}
