"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, GripVertical, Save, CheckCircle2, FileText, CheckSquare, Layers } from "lucide-react";
import { 
  updateTemplate, 
  deleteTemplate, 
  createTemplateMilestone,
  deleteTemplateMilestone,
  createTemplateDeliverable,
  deleteTemplateDeliverable,
  createTemplateTask,
  deleteTemplateTask
} from "@/app/actions/template";
import { useRouter } from "next/navigation";

export function TemplateBuilder({
  template,
  milestones,
  deliverables,
  tasks
}: {
  template: any;
  milestones: any[];
  deliverables: any[];
  tasks: any[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleUpdateMeta(formData: FormData) {
    setLoading(true);
    await updateTemplate(template.id, formData);
    setLoading(false);
  }

  async function handleDeleteTemplate() {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    setLoading(true);
    await deleteTemplate(template.id);
    router.push("/templates");
  }

  async function handleAddMilestone() {
    const title = prompt("Milestone Title:");
    if (!title) return;
    setLoading(true);
    await createTemplateMilestone(template.id, title);
    setLoading(false);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Meta Edit Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Template Settings
          </h2>
          <Button variant="destructive" size="sm" onClick={handleDeleteTemplate} disabled={loading}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Template
          </Button>
        </div>
        <form action={handleUpdateMeta} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Template Name</label>
              <Input name="name" defaultValue={template.name} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Project Type</label>
              <select
                name="type"
                defaultValue={template.type}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
              >
                <option value="WEB">Web Development</option>
                <option value="BRANDING">Branding & Identity</option>
                <option value="VIDEO">Video Production</option>
                <option value="MARKETING">Marketing Campaign</option>
                <option value="CUSTOM">Custom Project</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <Textarea name="description" defaultValue={template.description || ""} />
          </div>
          <div className="flex justify-end mt-2">
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Blueprint Structure */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Blueprint Structure</h2>
            <p className="text-sm text-slate-500">Define the milestones, deliverables, and tasks.</p>
          </div>
          <Button onClick={handleAddMilestone} disabled={loading} variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
            <Plus className="w-4 h-4 mr-2" />
            Add Milestone
          </Button>
        </div>

        <div className="space-y-6">
          {milestones.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
              <p className="text-slate-500">No milestones defined yet.</p>
            </div>
          ) : (
            milestones.map((milestone) => (
              <MilestoneCard 
                key={milestone.id}
                milestone={milestone}
                templateId={template.id}
                deliverables={deliverables.filter(d => d.milestoneId === milestone.id)}
                tasks={tasks.filter(t => t.milestoneId === milestone.id && !t.deliverableId)}
                allTasks={tasks}
                loading={loading}
                setLoading={setLoading}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function MilestoneCard({ milestone, templateId, deliverables, tasks, allTasks, loading, setLoading }: any) {
  
  async function handleDelete() {
    if (!confirm("Delete milestone?")) return;
    setLoading(true);
    await deleteTemplateMilestone(milestone.id, templateId);
    setLoading(false);
  }

  async function handleAddDeliverable() {
    const title = prompt("Deliverable Title:");
    if (!title) return;
    setLoading(true);
    await createTemplateDeliverable(milestone.id, title, "DOCUMENT", templateId);
    setLoading(false);
  }

  async function handleAddTask() {
    const title = prompt("Milestone Task Title:");
    if (!title) return;
    setLoading(true);
    await createTemplateTask(milestone.id, null, title, templateId);
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GripVertical className="w-5 h-5 text-slate-300 cursor-grab" />
          <h3 className="font-bold text-slate-900">{milestone.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleAddDeliverable} className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
            + Deliverable
          </Button>
          <Button variant="ghost" size="sm" onClick={handleAddTask} className="text-slate-600 hover:bg-slate-100">
            + Task
          </Button>
          <button onClick={handleDelete} className="text-slate-400 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Milestone Tasks */}
        {tasks.length > 0 && (
          <div className="space-y-2 mb-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Milestone Checklist</h4>
            {tasks.map((task: any) => (
              <TaskRow key={task.id} task={task} templateId={templateId} setLoading={setLoading} />
            ))}
          </div>
        )}

        {/* Deliverables */}
        <div className="space-y-3">
          {deliverables.length === 0 && tasks.length === 0 ? (
            <p className="text-sm text-slate-400 italic">Empty milestone.</p>
          ) : (
            deliverables.map((del: any) => (
              <DeliverableItem 
                key={del.id}
                deliverable={del}
                templateId={templateId}
                tasks={allTasks.filter((t: any) => t.deliverableId === del.id)}
                setLoading={setLoading}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function DeliverableItem({ deliverable, templateId, tasks, setLoading }: any) {
  async function handleDelete() {
    if (!confirm("Delete deliverable?")) return;
    setLoading(true);
    await deleteTemplateDeliverable(deliverable.id, templateId);
    setLoading(false);
  }

  async function handleAddTask() {
    const title = prompt("Deliverable Task Title:");
    if (!title) return;
    setLoading(true);
    await createTemplateTask(deliverable.milestoneId, deliverable.id, title, templateId);
    setLoading(false);
  }

  return (
    <div className="border border-slate-200 rounded-lg p-3 bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-indigo-50 flex items-center justify-center">
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{deliverable.title}</p>
            <p className="text-xs text-slate-500">{deliverable.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleAddTask} className="h-8 px-2 text-xs font-medium text-slate-600">
            + Task
          </Button>
          <button onClick={handleDelete} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="pl-11 pr-2 space-y-1.5 mt-2">
          {tasks.map((task: any) => (
            <TaskRow key={task.id} task={task} templateId={templateId} setLoading={setLoading} />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, templateId, setLoading }: any) {
  async function handleDelete() {
    setLoading(true);
    await deleteTemplateTask(task.id, templateId);
    setLoading(false);
  }

  return (
    <div className="group flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 rounded-md transition-colors border border-transparent hover:border-slate-200">
      <div className="flex items-center gap-2">
        <CheckSquare className="w-4 h-4 text-slate-300" />
        <span className="text-sm text-slate-700">{task.title}</span>
      </div>
      <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 rounded">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
