import { auth } from "@/auth";
import { db } from "@/db";
import { teamMembers, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function InvitePage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    // If not logged in, they must log in first to accept the invite
    redirect("/login?callbackUrl=/invite");
  }

  // Check if they have a pending invite
  const [invite] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.email, session.user.email));

  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">No Invitation Found</h1>
          <p className="text-slate-500 mb-6">We couldn't find a pending invitation for {session.user.email}.</p>
          <Button asChild className="w-full">
            <a href="/dashboard">Go to Dashboard</a>
          </Button>
        </div>
      </div>
    );
  }

  if (invite.status === "Active") {
    redirect("/dashboard");
  }

  // Get the inviter's name
  const [owner] = await db
    .select()
    .from(users)
    .where(eq(users.id, invite.workspaceOwnerId));

  async function acceptInvite() {
    "use server";
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");
    
    await db.update(teamMembers)
      .set({ status: "Active" })
      .where(eq(teamMembers.email, session.user.email));
      
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full space-y-6">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">You've been invited!</h1>
          <p className="text-slate-500">
            <strong>{owner?.name || "Someone"}</strong> has invited you to join their workspace on ClientSync OS.
          </p>
        </div>

        <form action={acceptInvite}>
          <Button type="submit" className="w-full h-12 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm">
            Accept Invitation
          </Button>
        </form>
      </div>
    </div>
  );
}
