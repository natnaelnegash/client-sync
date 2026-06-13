import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarNav } from "@/components/SidebarNav";
import { 
  ExternalLink,
  Search,
  Moon,
  Bell,
  ChevronDown
} from "lucide-react";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let previewUrl = "#";
  
  if (session?.user?.id) {
    const latestProject = await db.select()
      .from(projects)
      .where(eq(projects.userId, session.user.id))
      .orderBy(desc(projects.createdAt))
      .limit(1);
    
    if (latestProject.length > 0) {
      previewUrl = `/p/${latestProject[0].slug}`;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl tracking-tight">ClientSync OS</span>
          </Link>

          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white justify-center gap-2 mb-6 h-11">
            <span className="text-lg leading-none mb-0.5">+</span> New Project
          </Button>

          <SidebarNav />

          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3 px-3">
              Quick Access
            </p>
            <Link 
              href={previewUrl} 
              target={previewUrl !== "#" ? "_blank" : undefined}
              className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Preview Client Portal
            </Link>
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-slate-200">
          <button className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                AL
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-none mb-1">Alex Lawson</p>
                <p className="text-xs text-slate-500 leading-none">Northlight Studio</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        {/* Top Navigation */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10">
          <div className="w-full max-w-md relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Search projects, clients..." 
              className="pl-9 pr-12 h-10 bg-slate-50 border-slate-200 focus-visible:ring-indigo-600 rounded-lg text-sm w-full"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <span className="text-[10px] border border-slate-200 bg-white text-slate-400 px-1.5 py-0.5 rounded shadow-sm font-mono">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-slate-700 transition-colors">
              <Moon className="w-5 h-5" />
            </button>
            <button className="text-slate-500 hover:text-slate-700 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs ml-2 cursor-pointer">
              AL
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
