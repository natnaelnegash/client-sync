import { db } from "@/db";
import { invoices, projects, clients } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, CheckCircle2, Clock, AlertCircle, Search } from "lucide-react";
import { format } from "date-fns";
import { CreateInvoiceModal } from "./components/CreateInvoiceModal";

export default async function InvoicesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Fetch all projects for the dropdown
  const userProjects = await db
    .select({
      id: projects.id,
      projectName: projects.projectName,
      clientName: clients.name,
    })
    .from(projects)
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .where(eq(projects.userId, session.user.id));

  // Fetch all invoices for the current user's projects
  const rawInvoices = await db
    .select({
      id: invoices.id,
      amount: invoices.amount,
      status: invoices.status,
      dueDate: invoices.dueDate,
      projectName: projects.projectName,
      clientName: clients.name,
    })
    .from(invoices)
    .innerJoin(projects, eq(invoices.projectId, projects.id))
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .where(eq(projects.userId, session.user.id))
    .orderBy(desc(invoices.createdAt));

  // We map the database invoices and mock some "INV-0XX" IDs for the UI since we use UUIDs internally
  const mappedInvoices = rawInvoices.map((inv, index) => {
    // Generate a faux INV-XXX ID based on index for the demo if we don't have a human readable one
    const fauxId = `INV-${String(rawInvoices.length - index + 25).padStart(3, '0')}`;
    
    // Determine if overdue: UNPAID and dueDate is in the past
    let displayStatus = inv.status;
    if (inv.status === 'UNPAID' && inv.dueDate && new Date(inv.dueDate) < new Date()) {
      displayStatus = 'OVERDUE';
    } else if (inv.status === 'UNPAID') {
      displayStatus = 'PENDING';
    }

    return {
      ...inv,
      displayId: fauxId,
      displayStatus,
    };
  });

  // Calculate KPIs
  const revenueCollected = mappedInvoices
    .filter(i => i.status === 'PAID')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingPayment = mappedInvoices
    .filter(i => i.displayStatus === 'PENDING')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const overdueAmount = mappedInvoices
    .filter(i => i.displayStatus === 'OVERDUE')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>
          <p className="text-slate-500 text-sm mt-1">{mappedInvoices.length} total invoices</p>
        </div>
        <CreateInvoiceModal projects={userProjects} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-sm font-medium text-slate-500">Revenue collected</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(revenueCollected)}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-sm font-medium text-slate-500">Pending payment</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(pendingPayment)}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-sm font-medium text-slate-500">Overdue amount</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(overdueAmount)}</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search invoices..." 
            className="pl-9 h-10 bg-white border-slate-200 focus-visible:ring-indigo-600 rounded-lg text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full whitespace-nowrap">All</button>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-full whitespace-nowrap transition-colors">Paid</button>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-full whitespace-nowrap transition-colors">Pending</button>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-full whitespace-nowrap transition-colors">Overdue</button>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-full whitespace-nowrap transition-colors">Draft</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Invoice</th>
                <th className="px-6 py-4 font-bold">Client</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Due Date</th>
                <th className="px-6 py-4 font-bold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mappedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No invoices found. Create a project to automatically generate one.
                  </td>
                </tr>
              ) : (
                mappedInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{inv.displayId}</p>
                      <p className="text-xs text-slate-500">{inv.projectName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{inv.clientName}</p>
                    </td>
                    <td className="px-6 py-4">
                      {inv.displayStatus === 'PAID' && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Paid
                        </div>
                      )}
                      {inv.displayStatus === 'PENDING' && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </div>
                      )}
                      {inv.displayStatus === 'OVERDUE' && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Overdue
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">
                        {inv.dueDate ? format(new Date(inv.dueDate), 'MMM d, yyyy') : 'Upon receipt'}
                      </p>
                      {inv.displayStatus === 'PAID' && (
                        <p className="text-xs text-emerald-600">Paid {format(new Date(), 'MMM d, yyyy')}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{formatCurrency(inv.amount)}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing 1-{Math.min(mappedInvoices.length, 6)} of {mappedInvoices.length}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-slate-600" disabled>
              <span className="sr-only">Previous</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white">
              1
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-600 hover:bg-slate-100">
              2
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-slate-600">
              <span className="sr-only">Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
