import { Button } from "@/components/ui/button";
import { Folder, PenTool, DollarSign, Upload, Plus, FileText, UploadCloud, TrendingUp } from "lucide-react";
import { DashboardChart } from "./components/DashboardChart";
import { auth } from "@/auth";
import { db } from "@/db";
import { projects, invoices, files } from "@/db/schema";
import { eq, and, ne, sum, count } from "drizzle-orm";
import { redirect } from "next/navigation";
import { CreateProjectModal } from "./components/CreateProjectModal";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const userId = session.user.id;

  // Active Projects Count
  const activeProjectsQuery = await db.select({ count: count() })
    .from(projects)
    .where(and(eq(projects.userId, userId), ne(projects.status, 'COMPLETED')));
  const activeProjectsCount = activeProjectsQuery[0].count;

  // Pending Signatures Count
  const pendingSignaturesQuery = await db.select({ count: count() })
    .from(projects)
    .where(and(eq(projects.userId, userId), eq(projects.status, 'AWAITING_SIGNATURE')));
  const pendingSignaturesCount = pendingSignaturesQuery[0].count;

  // Revenue (Total Paid)
  const revenueQuery = await db.select({ total: sum(invoices.amount) })
    .from(invoices)
    .innerJoin(projects, eq(invoices.projectId, projects.id))
    .where(and(eq(projects.userId, userId), eq(invoices.status, 'PAID')));
  const totalRevenue = revenueQuery[0].total ? Number(revenueQuery[0].total) / 100 : 0; // assuming cents

  // Assets Collected
  const assetsQuery = await db.select({ count: count() })
    .from(files)
    .innerJoin(projects, eq(files.projectId, projects.id))
    .where(eq(projects.userId, userId));
  const assetsCount = assetsQuery[0].count;

  const formattedRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(totalRevenue);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Good morning, {session.user.name?.split(' ')[0] || 'there'}</h1>
          <p className="text-slate-500">Here's what's happening across your workspace.</p>
        </div>
        <CreateProjectModal />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-500">Active Projects</span>
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Folder className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{activeProjectsCount}</div>
            <div className="text-sm font-medium text-emerald-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> Live
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-500">Pending Signatures</span>
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <PenTool className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{pendingSignaturesCount}</div>
            <div className="text-sm font-medium text-emerald-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> Awaiting response
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-500">Total Revenue</span>
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{formattedRevenue}</div>
            <div className="text-sm font-medium text-emerald-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> Lifetime
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-500">Assets Collected</span>
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{assetsCount}</div>
            <div className="text-sm font-medium text-emerald-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> Across workspace
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Revenue</h2>
              <p className="text-sm text-slate-500">Last 6 months</p>
            </div>
            <div className="text-sm font-medium text-emerald-500 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" /> +24% vs prior period
            </div>
          </div>
          
          <DashboardChart />
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
          <h2 className="text-base font-bold text-slate-900 mb-6">Quick actions</h2>
          
          <div className="space-y-6 flex-1">
            <CreateProjectModal triggerVariant="action" />

            <button className="w-full flex items-start gap-4 text-left group">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                <FileText className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">Send magic link</p>
                <p className="text-sm text-slate-500">Share portal with client</p>
              </div>
            </button>

            <button className="w-full flex items-start gap-4 text-left group">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                <DollarSign className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">Create invoice</p>
                <p className="text-sm text-slate-500">Bill for milestone</p>
              </div>
            </button>

            <button className="w-full flex items-start gap-4 text-left group">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                <UploadCloud className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">Request assets</p>
                <p className="text-sm text-slate-500">Nudge client to upload</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
