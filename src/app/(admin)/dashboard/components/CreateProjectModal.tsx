"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createProject } from "@/app/actions/project";

export function CreateProjectModal({ triggerVariant = "default" }: { triggerVariant?: "default" | "action" }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerVariant === "default" ? (
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-6 rounded-lg shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        ) : (
          <button className="w-full flex items-start gap-4 text-left group">
            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
              <Plus className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">Create new project</p>
              <p className="text-sm text-slate-500">Set up scope & proposal</p>
            </div>
          </button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Client Project</DialogTitle>
          <DialogDescription>
            Enter the details to generate a new project and client portal.
          </DialogDescription>
        </DialogHeader>
        
        <form
          action={async (data) => {
            setLoading(true);
            try {
              await createProject(data);
              setOpen(false); // Close modal on success
            } catch (err) {
              console.error(err);
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-4 pt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              name="clientName"
              placeholder="Acme Corp"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              name="projectName"
              placeholder="Website Redesign"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scopeOfWork">Scope of Work</Label>
            <Textarea
              id="scopeOfWork"
              name="scopeOfWork"
              placeholder="1. Wireframes 2. High fidelity designs..."
              required
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
