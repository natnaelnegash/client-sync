"use client";

import { useState } from "react";
import {
  CheckCircle2,
  CircleDot,
  Circle,
  Download,
  FileText,
  Plus,
  Trash2,
  Loader2,
  ArrowRight,
  Edit2,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  Square,
  Milestone as MilestoneIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import { Textarea } from "@/components/ui/textarea";
import { updateProjectStatus, updateProjectScope } from "@/app/actions/project";
import {
  addDeliverable,
  updateDeliverableStatus,
  deleteDeliverable,
  updateDeliverableInvoice,
} from "@/app/actions/deliverable";
import {
  addMilestone,
  updateMilestoneStatus,
  deleteMilestone,
} from "@/app/actions/milestone";
import { addTask, toggleTask, deleteTask } from "@/app/actions/task";
import { createInvoice, deleteInvoice } from "@/app/actions/invoice";
import { ProjectChat } from "@/components/ProjectChat";

type TabType =
  | "timeline"
  | "scope"
  | "deliverables"
  | "assets"
  | "invoices"
  | "chat";

// Type for milestones with nested data
type MilestoneWithNested = {
  id: string;
  projectId: string;
  title: string;
  status: string;
  order: number;
  createdAt: Date | null;
  deliverables: any[];
  tasks: any[];
};

export function ProjectTabs({
  project,
  currentIndex,
  scopeOfWork,
  uploadedFiles,
  milestones,
  invoices,
  initialMessages,
  deliverableTypes,
}: {
  project: any;
  currentIndex: number;
  scopeOfWork: string;
  uploadedFiles: any[];
  milestones: MilestoneWithNested[];
  invoices: any[];
  initialMessages: any[];
  deliverableTypes: any[];
}) {
  const [activeTab, setActiveTab] = useState<TabType>("timeline");
  const [loading, setLoading] = useState(false);

  // Expanded milestones state
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(
    new Set(milestones.map((m) => m.id))
  );

  // Add Milestone State
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");

  // Add Task State
  const [addingTaskForMilestone, setAddingTaskForMilestone] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Add Deliverable State
  const [addingDelivForMilestone, setAddingDelivForMilestone] = useState<string | null>(null);

  // New Invoice State
  const [newInvTitle, setNewInvTitle] = useState("");
  const [newInvAmount, setNewInvAmount] = useState("");
  const [newInvDate, setNewInvDate] = useState("");
  const [showAddInv, setShowAddInv] = useState(false);

  // Scope Edit State
  const [isEditingScope, setIsEditingScope] = useState(false);
  const [editedScope, setEditedScope] = useState(scopeOfWork);

  const toggleMilestoneExpanded = (id: string) => {
    setExpandedMilestones((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSaveScope = async () => {
    setLoading(true);
    await updateProjectScope(project.slug, editedScope);
    setIsEditingScope(false);
    setLoading(false);
  };

  const handleCreateMilestone = async () => {
    if (!newMilestoneTitle.trim()) return;
    setLoading(true);
    await addMilestone(project.id, newMilestoneTitle);
    setNewMilestoneTitle("");
    setShowAddMilestone(false);
    setLoading(false);
  };

  const handleCreateTask = async (milestoneId: string) => {
    if (!newTaskTitle.trim()) return;
    setLoading(true);
    await addTask(project.id, milestoneId, newTaskTitle);
    setNewTaskTitle("");
    setAddingTaskForMilestone(null);
    setLoading(false);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append("projectId", project.id);
    fd.append("title", newInvTitle);
    fd.append("amount", newInvAmount);
    if (newInvDate) fd.append("dueDate", newInvDate);
    await createInvoice(fd);
    setNewInvTitle("");
    setNewInvAmount("");
    setNewInvDate("");
    setShowAddInv(false);
    setLoading(false);
  };

  // Calculate milestone progress
  const getMilestoneProgress = (ms: MilestoneWithNested) => {
    if (ms.tasks.length === 0) return 0;
    const completed = ms.tasks.filter((t: any) => t.isCompleted).length;
    return Math.round((completed / ms.tasks.length) * 100);
  };

  // Total deliverable count across all milestones
  const totalDeliverables = milestones.reduce(
    (acc, ms) => acc + ms.deliverables.length,
    0
  );

  return (
    <>
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-6 border-b border-slate-200 mt-8">
        <button
          onClick={() => setActiveTab("chat")}
          className={`pb-3 border-b-2 font-semibold text-sm transition-colors ${activeTab === "chat" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab("timeline")}
          className={`pb-3 border-b-2 font-semibold text-sm transition-colors ${activeTab === "timeline" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Milestones ({milestones.length})
        </button>
        <button
          onClick={() => setActiveTab("deliverables")}
          className={`pb-3 border-b-2 font-semibold text-sm transition-colors ${activeTab === "deliverables" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Deliverables ({totalDeliverables})
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          className={`pb-3 border-b-2 font-semibold text-sm transition-colors ${activeTab === "invoices" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab("assets")}
          className={`pb-3 border-b-2 font-semibold text-sm transition-colors ${activeTab === "assets" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Assets ({uploadedFiles.length})
        </button>
        <button
          onClick={() => setActiveTab("scope")}
          className={`pb-3 border-b-2 font-semibold text-sm transition-colors ${activeTab === "scope" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Scope
        </button>
      </div>

      <div className="pt-4">
        <div className="space-y-6">
          {/* CHAT TAB */}
          {activeTab === "chat" && (
            <div className="max-w-3xl mx-auto">
              <ProjectChat
                projectId={project.id}
                initialMessages={initialMessages}
                currentRole="AGENCY"
              />
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* MILESTONES / TIMELINE TAB                  */}
          {/* ═══════════════════════════════════════════ */}
          {activeTab === "timeline" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">
                  Project Milestones
                </h2>
                <Button
                  onClick={() => setShowAddMilestone(!showAddMilestone)}
                  variant="outline"
                  size="sm"
                  className="font-bold"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Milestone
                </Button>
              </div>

              {/* Add Milestone Form */}
              {showAddMilestone && (
                <div className="p-4 border border-indigo-100 bg-indigo-50/30 rounded-xl flex items-end gap-3">
                  <div className="flex-1">
                    <Label className="text-xs font-bold text-slate-700">
                      Milestone Title
                    </Label>
                    <Input
                      value={newMilestoneTitle}
                      onChange={(e) => setNewMilestoneTitle(e.target.value)}
                      placeholder="e.g. Discovery Phase"
                      className="mt-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCreateMilestone();
                        }
                      }}
                    />
                  </div>
                  <Button
                    onClick={handleCreateMilestone}
                    disabled={loading || !newMilestoneTitle.trim()}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 font-bold text-white"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
                  </Button>
                </div>
              )}

              {/* Milestone Cards */}
              {milestones.map((ms) => {
                const isExpanded = expandedMilestones.has(ms.id);
                const progress = getMilestoneProgress(ms);
                const completedTasks = ms.tasks.filter((t: any) => t.isCompleted).length;

                const statusColor =
                  ms.status === "COMPLETED"
                    ? "bg-emerald-100 text-emerald-700"
                    : ms.status === "IN_PROGRESS"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-600";

                return (
                  <div
                    key={ms.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                  >
                    {/* Milestone Header */}
                    <div
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
                      onClick={() => toggleMilestoneExpanded(ms.id)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <div className="flex items-center gap-3 min-w-0">
                          {ms.status === "COMPLETED" ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          ) : ms.status === "IN_PROGRESS" ? (
                            <CircleDot className="w-5 h-5 text-blue-500 shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                          )}
                          <h3 className="font-bold text-slate-900 truncate">
                            {ms.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                          {ms.status.replace("_", " ")}
                        </span>
                        {ms.tasks.length > 0 && (
                          <span className="text-xs text-slate-400 font-medium">
                            {completedTasks}/{ms.tasks.length} tasks
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {ms.tasks.length > 0 && (
                      <div className="px-5 pb-0">
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div
                            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-4 space-y-4 border-t border-slate-100 mt-3">
                        {/* Tasks Section */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Tasks
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAddingTaskForMilestone(
                                  addingTaskForMilestone === ms.id ? null : ms.id
                                );
                                setNewTaskTitle("");
                              }}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> Add Task
                            </button>
                          </div>

                          {/* Add Task Inline */}
                          {addingTaskForMilestone === ms.id && (
                            <div className="flex items-center gap-2 mb-3">
                              <Input
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="Task name..."
                                className="h-9 text-sm flex-1"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleCreateTask(ms.id);
                                  }
                                  if (e.key === "Escape") {
                                    setAddingTaskForMilestone(null);
                                  }
                                }}
                              />
                              <Button
                                onClick={() => handleCreateTask(ms.id)}
                                disabled={loading || !newTaskTitle.trim()}
                                size="sm"
                                className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                              >
                                Add
                              </Button>
                            </div>
                          )}

                          {/* Task List */}
                          <div className="space-y-1">
                            {ms.tasks.map((task: any) => (
                              <div
                                key={task.id}
                                className="flex items-center justify-between group px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <button
                                    onClick={() => toggleTask(task.id)}
                                    className="shrink-0"
                                  >
                                    {task.isCompleted ? (
                                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                                    ) : (
                                      <Square className="w-4 h-4 text-slate-300 hover:text-indigo-400" />
                                    )}
                                  </button>
                                  <span
                                    className={`text-sm truncate ${
                                      task.isCompleted
                                        ? "text-slate-400 line-through"
                                        : "text-slate-700"
                                    }`}
                                  >
                                    {task.title}
                                  </span>
                                </div>
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="p-1 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            {ms.tasks.length === 0 && (
                              <p className="text-xs text-slate-400 italic px-3 py-2">
                                No tasks yet.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Deliverables Count */}
                        {ms.deliverables.length > 0 && (
                          <div className="pt-2 border-t border-slate-100">
                            <p className="text-xs text-slate-400">
                              <span className="font-bold text-slate-500">
                                {ms.deliverables.length}
                              </span>{" "}
                              deliverable{ms.deliverables.length !== 1 ? "s" : ""} attached
                              — view in Deliverables tab
                            </p>
                          </div>
                        )}

                        {/* Milestone Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <select
                            value={ms.status}
                            onChange={(e) =>
                              updateMilestoneStatus(ms.id, e.target.value as any)
                            }
                            className="text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-600 outline-none"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Delete this milestone and all its tasks/deliverables?")) {
                                deleteMilestone(ms.id);
                              }
                            }}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {milestones.length === 0 && !showAddMilestone && (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                  <MilestoneIcon className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                  <p className="text-sm text-slate-500 font-medium">
                    No milestones yet. Add one to start tracking progress.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* DELIVERABLES TAB (Grouped by Milestone)    */}
          {/* ═══════════════════════════════════════════ */}
          {activeTab === "deliverables" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {milestones.map((ms) => (
                <div
                  key={ms.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900">
                        {ms.title}
                      </h2>
                      <span className="text-xs text-slate-400 font-medium">
                        ({ms.deliverables.length} items)
                      </span>
                    </div>
                    <Button
                      onClick={() =>
                        setAddingDelivForMilestone(
                          addingDelivForMilestone === ms.id ? null : ms.id
                        )
                      }
                      variant="outline"
                      size="sm"
                      className="font-bold text-xs"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Add
                    </Button>
                  </div>

                  {/* Add Deliverable Form */}
                  {addingDelivForMilestone === ms.id && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setLoading(true);
                        const fd = new FormData(e.currentTarget);
                        fd.append("milestoneId", ms.id);
                        await addDeliverable(project.id, fd);
                        setAddingDelivForMilestone(null);
                        setLoading(false);
                      }}
                      className="mb-5 p-4 border border-indigo-100 bg-indigo-50/30 rounded-xl space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs font-bold text-slate-700">
                            Title
                          </Label>
                          <Input
                            name="title"
                            placeholder="e.g. Final 4K Video Edit"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-bold text-slate-700">
                            Type
                          </Label>
                          <select
                            name="typeId"
                            required
                            className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                          >
                            {deliverableTypes.map((dt: any) => (
                              <option key={dt.id} value={dt.id}>
                                {dt.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label className="text-xs font-bold text-slate-700">
                            Description
                          </Label>
                          <Input
                            name="description"
                            placeholder="Optional details..."
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-bold text-slate-700">
                            Link to Invoice
                          </Label>
                          <select
                            name="invoiceId"
                            className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                          >
                            <option value="">None</option>
                            {invoices.map((inv: any) => (
                              <option key={inv.id} value={inv.id}>
                                {inv.title} - ${(inv.amount / 100).toFixed(2)} (
                                {inv.status})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                          <input
                            type="checkbox"
                            id={`requiresPayment-${ms.id}`}
                            name="requiresPayment"
                            value="true"
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <Label
                            htmlFor={`requiresPayment-${ms.id}`}
                            className="text-sm font-bold text-slate-700"
                          >
                            Require Payment to Download
                          </Label>
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <Button
                          type="submit"
                          disabled={loading}
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700 font-bold text-white"
                        >
                          Save Deliverable
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* Deliverable Items */}
                  <div className="space-y-3">
                    {ms.deliverables.map((item: any) => (
                      <div
                        key={item.id}
                        className="p-4 border border-slate-100 bg-slate-50 rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-slate-900 text-sm">
                              {item.title}
                            </p>
                            {item.requiresPayment && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                                Payment Gated
                              </span>
                            )}
                            {item.clientStatus === "APPROVED" && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                                Client Approved
                              </span>
                            )}
                            {item.clientStatus === "REVISIONS_REQUESTED" && (
                              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                                Revisions Requested
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-slate-500 mt-1">
                              {item.description}
                            </p>
                          )}

                          {item.clientStatus === "REVISIONS_REQUESTED" &&
                            item.clientFeedback && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-800">
                                <strong>Client Feedback: </strong>
                                {item.clientFeedback}
                              </div>
                            )}

                          <div className="flex flex-wrap gap-4 mt-3">
                            {item.previewUrl && (
                              <div className="flex w-10 justify-between">
                                <a
                                  href={item.previewUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center bg-slate-200/50 px-2 py-1 rounded"
                                >
                                  <Download className="w-3 h-3 mr-1" /> View Preview File
                                </a>
                                <button
                                  onClick={() =>
                                    updateDeliverableStatus(
                                      item.id,
                                      item.status,
                                      undefined,
                                      null,
                                    )
                                  }
                                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                            {item.fileUrl && (
                              <a
                                href={item.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center bg-indigo-50 px-2 py-1 rounded"
                              >
                                <Download className="w-3 h-3 mr-1" /> View Final File
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 shrink-0">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-2">
                              <Label className="text-xs font-bold text-slate-700">
                                Status
                              </Label>
                              <select
                                value={item.status}
                                onChange={(e) =>
                                  updateDeliverableStatus(
                                    item.id,
                                    e.target.value as any,
                                  )
                                }
                                className="text-sm font-medium bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-600 outline-none"
                              >
                                <option value="Pending">Pending</option>
                                <option value="In progress...">In progress...</option>
                                <option value="Complete">Complete</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-2">
                              <Label className="text-xs font-bold text-slate-700">
                                Linked Invoice
                              </Label>
                              <select
                                value={item.invoiceId || ""}
                                onChange={(e) =>
                                  updateDeliverableInvoice(
                                    item.id,
                                    e.target.value || null,
                                  )
                                }
                                className="text-sm font-medium bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-600 outline-none"
                              >
                                <option value="">None</option>
                                {invoices.map((inv: any) => (
                                  <option key={inv.id} value={inv.id}>
                                    {inv.title} - ${(inv.amount / 100).toFixed(2)} (
                                    {inv.status})
                                  </option>
                                ))}
                              </select>
                            </div>

                            <button
                              onClick={() => deleteDeliverable(item.id)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {item.status !== "Complete" && (
                            <div className="flex gap-2 justify-between w-full">
                              <div className="border border-slate-200 rounded-lg bg-white px-2 py-1 shadow-sm">
                                <UploadButton
                                  endpoint="adminDeliverable"
                                  onClientUploadComplete={(res) => {
                                    updateDeliverableStatus(
                                      item.id,
                                      item.status,
                                      undefined,
                                      res[0].url,
                                    );
                                  }}
                                  onUploadError={(error) =>
                                    alert(`Upload Error: ${error.message}`)
                                  }
                                  appearance={{
                                    button:
                                      "text-[10px] font-bold text-slate-600 bg-transparent border-none py-0.5 px-2 h-auto after:hidden",
                                    allowedContent: "hidden",
                                  }}
                                  content={{ button: "Upload Preview" }}
                                />
                              </div>
                              <div className="border border-indigo-200 rounded-lg bg-indigo-50 px-2 py-1 shadow-sm">
                                <UploadButton
                                  endpoint="adminDeliverable"
                                  onClientUploadComplete={(res) => {
                                    updateDeliverableStatus(
                                      item.id,
                                      "Complete",
                                      res[0].url,
                                    );
                                  }}
                                  onUploadError={(error) =>
                                    alert(`Upload Error: ${error.message}`)
                                  }
                                  appearance={{
                                    button:
                                      "text-[10px] font-bold text-indigo-700 bg-transparent border-none py-0.5 px-2 h-auto after:hidden",
                                    allowedContent: "hidden",
                                  }}
                                  content={{ button: "Upload Final" }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {ms.deliverables.length === 0 && (
                      <p className="text-sm text-slate-400 italic">
                        No deliverables in this milestone.
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {milestones.length === 0 && (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                  <p className="text-sm text-slate-500 font-medium">
                    No milestones or deliverables yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* INVOICES TAB                               */}
          {/* ═══════════════════════════════════════════ */}
          {activeTab === "invoices" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-slate-900">
                  Manage Invoices
                </h2>
                <Button
                  onClick={() => setShowAddInv(!showAddInv)}
                  variant="outline"
                  size="sm"
                  className="font-bold"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Invoice
                </Button>
              </div>

              {showAddInv && (
                <form
                  onSubmit={handleCreateInvoice}
                  className="mb-6 p-4 border border-indigo-100 bg-indigo-50/30 rounded-xl space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-bold text-slate-700">
                        Invoice Name
                      </Label>
                      <Input
                        value={newInvTitle}
                        onChange={(e) => setNewInvTitle(e.target.value)}
                        placeholder="e.g. 50% Deposit"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-slate-700">
                        Amount (USD)
                      </Label>
                      <Input
                        type="number"
                        value={newInvAmount}
                        onChange={(e) => setNewInvAmount(e.target.value)}
                        placeholder="500"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-slate-700">
                        Due Date
                      </Label>
                      <Input
                        type="date"
                        value={newInvDate}
                        onChange={(e) => setNewInvDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={loading}
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700 font-bold text-white"
                    >
                      Save Invoice
                    </Button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {invoices.map((inv: any) => (
                  <div
                    key={inv.id}
                    className="p-4 border border-slate-100 bg-slate-50 rounded-xl flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900 text-sm">
                          {inv.title}
                        </p>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${inv.status === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-slate-900 mt-1">
                        ${(inv.amount / 100).toLocaleString()}
                      </p>
                      {inv.dueDate && (
                        <p className="text-xs text-slate-500 mt-1">
                          Due: {new Date(inv.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteInvoice(inv.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {invoices.length === 0 && !showAddInv && (
                  <p className="text-sm text-slate-500 italic">
                    No invoices created yet.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* SCOPE TAB                                  */}
          {/* ═══════════════════════════════════════════ */}
          {activeTab === "scope" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-slate-900">
                  Scope of Work
                </h2>
                {!isEditingScope ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingScope(true)}
                    className="font-bold"
                  >
                    <Edit2 className="w-4 h-4 mr-2" /> Edit Scope
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditingScope(false);
                        setEditedScope(scopeOfWork);
                      }}
                      className="font-bold"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveScope}
                      disabled={loading}
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700 font-bold text-white"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </div>

              {!isEditingScope ? (
                <div className="whitespace-pre-wrap text-sm text-slate-600 leading-relaxed">
                  {scopeOfWork}
                </div>
              ) : (
                <Textarea
                  value={editedScope}
                  onChange={(e) => setEditedScope(e.target.value)}
                  className="min-h-[300px] border-slate-200 focus-visible:ring-indigo-600 text-sm rounded-xl p-4 shadow-sm"
                  placeholder="Describe the project scope..."
                />
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* ASSETS TAB                                 */}
          {/* ═══════════════════════════════════════════ */}
          {activeTab === "assets" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-in fade-in duration-300">
              <h2 className="text-base font-bold text-slate-900 mb-6">
                Uploaded Assets
              </h2>
              {uploadedFiles.length === 0 ? (
                <p className="text-sm text-slate-500 italic">
                  No assets have been uploaded by the client yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {uploadedFiles.map((file: any) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {file.fileName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {file.uploadedAt
                              ? new Date(file.uploadedAt).toLocaleDateString()
                              : "Just now"}
                          </p>
                        </div>
                      </div>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
