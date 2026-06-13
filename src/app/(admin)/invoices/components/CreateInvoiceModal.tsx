"use client";

import { useState } from "react";
import { Plus, Receipt, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createInvoice } from "@/app/actions/invoice";

type Project = {
  id: string;
  projectName: string;
  clientName: string;
};

export function CreateInvoiceModal({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm h-10 px-4 rounded-lg font-medium">
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] !rounded-2xl">
        <form
          action={async (data) => {
            setLoading(true);
            try {
              await createInvoice(data);
              setOpen(false);
            } catch (err) {
              console.error(err);
            } finally {
              setLoading(false);
            }
          }}
          className="flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-start gap-4 shrink-0 bg-white">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 mt-1">
              <Receipt className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">Create New Invoice</DialogTitle>
              <DialogDescription className="text-slate-500 mt-1 text-sm">
                Issue a new invoice for an active project.
              </DialogDescription>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 bg-white">
            {/* Project Selection */}
            <div className="space-y-3">
              <Label htmlFor="projectId" className="text-base font-bold text-slate-900">
                Project <span className="text-red-500">*</span>
              </Label>
              <select 
                id="projectId"
                name="projectId"
                required
                className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%20%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%221.66667%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_16px_center] bg-no-repeat pr-10 shadow-sm"
              >
                <option value="" disabled selected>Select a project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectName} ({p.clientName})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount & Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="amount" className="text-base font-bold text-slate-900">
                  Amount <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <Input 
                    id="amount"
                    name="amount"
                    placeholder="0.00" 
                    required
                    step="0.01"
                    min="0"
                    type="number" 
                    className="h-12 pl-8 rounded-xl border-slate-200 shadow-sm focus-visible:ring-indigo-600" 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="dueDate" className="text-base font-bold text-slate-900">
                  Due date
                </Label>
                <Input 
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  className="h-12 rounded-xl border-slate-200 shadow-sm focus-visible:ring-indigo-600 text-slate-600 block" 
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-end gap-3 shrink-0">
            <Button type="button" variant="outline" className="h-11 px-6 rounded-xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50 w-full sm:w-auto shadow-sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full sm:w-auto shadow-sm" disabled={loading}>
              <Receipt className="w-4 h-4 mr-2" />
              {loading ? "Creating..." : "Create Invoice"}
              {!loading && <ChevronRight className="w-4 h-4 ml-1 opacity-70" />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
