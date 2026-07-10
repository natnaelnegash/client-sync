"use client";

import { useState } from "react";
import { Edit2, ChevronRight, MoreHorizontal } from "lucide-react";
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
import { updateClient } from "@/app/actions/client";
import { ClientData } from "../ClientListUI";

export function EditClientModal({ client }: { client: ClientData }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 rounded-full">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] !rounded-2xl">
        <form
          action={async (data) => {
            setLoading(true);
            try {
              await updateClient(client.id, data);
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
              <Edit2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">Edit Client</DialogTitle>
              <DialogDescription className="text-slate-500 mt-1 text-sm">
                Update client details.
              </DialogDescription>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 bg-white">
            {/* Name */}
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base font-bold text-slate-900">
                Contact name <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="name"
                name="name"
                defaultValue={client.name}
                placeholder="Jane Doe" 
                required
                className="h-12 rounded-xl border-slate-200 shadow-sm focus-visible:ring-indigo-600" 
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-bold text-slate-900">
                  Email
                </Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={client.email || ""}
                  placeholder="jane@example.com" 
                  className="h-12 rounded-xl border-slate-200 shadow-sm focus-visible:ring-indigo-600" 
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-base font-bold text-slate-900">
                  Phone
                </Label>
                <Input 
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={client.phone || ""}
                  placeholder="+1 (555) 000-0000"
                  className="h-12 rounded-xl border-slate-200 shadow-sm focus-visible:ring-indigo-600" 
                />
              </div>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <Label htmlFor="company" className="text-base font-bold text-slate-900">
                Company name
              </Label>
              <Input 
                id="company"
                name="company"
                defaultValue={client.company || ""}
                placeholder="Acme Corp" 
                className="h-12 rounded-xl border-slate-200 shadow-sm focus-visible:ring-indigo-600" 
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-end gap-3 shrink-0">
            <Button type="button" variant="outline" className="h-11 px-6 rounded-xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50 w-full sm:w-auto shadow-sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full sm:w-auto shadow-sm" disabled={loading}>
              <Edit2 className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
              {!loading && <ChevronRight className="w-4 h-4 ml-1 opacity-70" />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
