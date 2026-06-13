import { SettingsNav } from "./components/SettingsNav";
import { TabWhiteLabeling } from "./components/TabWhiteLabeling";
import { TabClientPortal } from "./components/TabClientPortal";
import { TabPayments } from "./components/TabPayments";
import { TabTeam } from "./components/TabTeam";
import { TabSecurity } from "./components/TabSecurity";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { workspaceSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const resolvedParams = await searchParams;
  const tab = resolvedParams.tab || "white-labeling";

  // Fetch settings
  const settingsRecords = await db
    .select()
    .from(workspaceSettings)
    .where(eq(workspaceSettings.userId, session.user.id));
  
  const settings = settingsRecords.length > 0 ? settingsRecords[0] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your workspace preferences and white-labeling.</p>
      </div>

      <div className="flex gap-8 lg:gap-12 items-start">
        {/* Secondary Sidebar Navigation */}
        <aside className="w-64 shrink-0 top-6 sticky">
          <SettingsNav />
        </aside>

        {/* Tab Content */}
        <div className="flex-1 w-full min-w-0">
          {tab === "white-labeling" && <TabWhiteLabeling settings={settings} />}
          {tab === "client-portal" && <TabClientPortal settings={settings} />}
          {tab === "payments" && <TabPayments settings={settings} />}
          {tab === "team" && <TabTeam />}
          {tab === "security" && <TabSecurity />}
          {tab === "notifications" && (
            <div className="p-8 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl">
              Notifications settings coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
