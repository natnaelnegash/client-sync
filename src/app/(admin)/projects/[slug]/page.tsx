import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Copy, Send, MoreHorizontal, CheckCircle2, CircleDot, Circle } from "lucide-react";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/db";
import { projects, clients, invoices, files } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { format } from "date-fns";

export default async function ProjectAdminDetailPage({ params }: { params: { slug: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Fetch project and client
  const projectQuery = await db.select()
    .from(projects)
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .where(and(eq(projects.slug, params.slug), eq(projects.userId, session.user.id)));
  
  if (!projectQuery.length) notFound();
  
  const project = projectQuery[0].projects;
  const client = projectQuery[0].clients;

  // Fetch invoices to calculate value
  const projectInvoices = await db.select()
    .from(invoices)
    .where(eq(invoices.projectId, project.id));
  
  const totalValue = projectInvoices.reduce((acc, inv) => acc + inv.amount, 0);
  const totalPaid = projectInvoices.filter(i => i.status === 'PAID').reduce((acc, inv) => acc + inv.amount, 0);
  const balance = totalValue - totalPaid;

  // Fetch files count
  const projectFilesQuery = await db.select()
    .from(files)
    .where(eq(files.projectId, project.id));
  const fileCount = projectFilesQuery.length;

  const valueFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalValue / 100);
  const paidFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalPaid / 100);
  const balanceFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(balance / 100);

  const formatStatus = (s: string) => {
    return s.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  }

  // Progress logic
  const statuses = [
    "AWAITING_SIGNATURE",
    "COLLECTING_ASSETS",
    "IN_PROGRESS",
    "IN_REVIEW",
    "DELIVERY",
    "COMPLETED"
  ];
  const currentIndex = statuses.indexOf(project.status);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm font-medium text-slate-500 mb-2">
        <Link href="/projects" className="flex items-center hover:text-slate-900 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Projects
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{project.projectName}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{project.projectName}</h1>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
              {formatStatus(project.status)}
            </span>
          </div>
          <p className="text-slate-500">
            {client.name} · {client.company || 'No company'} · Value: {valueFormatted}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 border-slate-200 text-slate-700 font-medium hover:bg-slate-50">
            <Copy className="w-4 h-4 mr-2" />
            Copy Magic Link
          </Button>
          <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
            <Send className="w-4 h-4 mr-2" />
            Send Reminder
          </Button>
          <Button variant="outline" className="h-10 w-10 p-0 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 flex items-center justify-center shrink-0">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 mt-8">
        <button className="pb-3 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm">
          Overview
        </button>
        <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors">
          Scope Of Work
        </button>
        <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors">
          Uploaded Assets ({fileCount})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Progress */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-6">Project Progress</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-0.5">
                  {currentIndex >= 1 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : currentIndex === 0 ? <CircleDot className="w-5 h-5 text-indigo-600" /> : <Circle className="w-5 h-5 text-slate-200" />}
                </div>
                <div>
                  <p className={`text-sm ${currentIndex >= 1 ? 'text-slate-500 line-through' : currentIndex === 0 ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>
                    Contract signed
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-0.5">
                  {currentIndex >= 2 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : currentIndex === 1 ? <CircleDot className="w-5 h-5 text-indigo-600" /> : <Circle className="w-5 h-5 text-slate-200" />}
                </div>
                <div>
                  <p className={`text-sm ${currentIndex >= 2 ? 'text-slate-500 line-through' : currentIndex === 1 ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>
                    Assets collected
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-0.5">
                  {currentIndex >= 4 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : (currentIndex === 2 || currentIndex === 3) ? <CircleDot className="w-5 h-5 text-indigo-600" /> : <Circle className="w-5 h-5 text-slate-200" />}
                </div>
                <div>
                  <p className={`text-sm ${currentIndex >= 4 ? 'text-slate-500 line-through' : (currentIndex === 2 || currentIndex === 3) ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>
                    Design execution
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-0.5">
                  {currentIndex >= 5 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : currentIndex === 4 ? <CircleDot className="w-5 h-5 text-indigo-600" /> : <Circle className="w-5 h-5 text-slate-200" />}
                </div>
                <div>
                  <p className={`text-sm ${currentIndex >= 5 ? 'text-slate-500 line-through' : currentIndex === 4 ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>
                    Final delivery
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scope Of Work */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-6">Scope of Work</h2>
            <div className="whitespace-pre-wrap text-sm text-slate-600 leading-relaxed">
              {project.scopeOfWork}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Client Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Client</h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#0099FF] flex items-center justify-center text-white font-bold shrink-0">
                {client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-900">{client.name}</p>
                <p className="text-sm text-slate-500">{client.company}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-4">
                <span className="text-slate-500">Email</span>
                <span className="font-medium text-slate-900">{client.email || '—'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Portal status</span>
                <span className="font-medium text-blue-600">Active</span>
              </div>
            </div>
          </div>

          {/* Project Value Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Project Value</h3>
            
            <div className="text-3xl font-bold text-slate-900 mb-6">
              {valueFormatted}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-4">
                <span className="text-slate-500">Paid</span>
                <span className="font-medium text-emerald-600">{paidFormatted}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Balance</span>
                <span className="font-medium text-slate-900">{balanceFormatted} due</span>
              </div>
            </div>
          </div>

          {/* Dates Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Dates</h3>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Start date</span>
              <span className="font-medium text-slate-900">
                {project.createdAt ? format(new Date(project.createdAt), 'MMMM d, yyyy') : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
