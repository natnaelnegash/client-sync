"use client";

import { useState } from "react";
import { CheckCircle2, CircleDot, Circle, Download, FileText, Plus, Trash2, Loader2, ArrowRight, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import { Textarea } from "@/components/ui/textarea";
import { updateProjectStatus, updateProjectScope } from "@/app/actions/project";
import { addDeliverable, updateDeliverableStatus, deleteDeliverable } from "@/app/actions/deliverable";
import { createInvoice, deleteInvoice } from "@/app/actions/invoice";
import { ProjectChat } from "@/components/ProjectChat";

type TabType = "timeline" | "scope" | "deliverables" | "assets" | "invoices" | "chat";

export function ProjectTabs({
  project,
  currentIndex,
  scopeOfWork,
  uploadedFiles,
  deliverables,
  invoices,
  initialMessages
}: {
  project: any;
  currentIndex: number;
  scopeOfWork: string;
  uploadedFiles: any[];
  deliverables: any[];
  invoices: any[];
  initialMessages: any[];
}) {
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [loading, setLoading] = useState(false);

  // New Deliverable State
  const [newDelivTitle, setNewDelivTitle] = useState("");
  const [newDelivDesc, setNewDelivDesc] = useState("");
  const [showAddDeliv, setShowAddDeliv] = useState(false);

  // New Invoice State
  const [newInvTitle, setNewInvTitle] = useState("");
  const [newInvAmount, setNewInvAmount] = useState("");
  const [newInvDate, setNewInvDate] = useState("");
  const [showAddInv, setShowAddInv] = useState(false);

  // Scope Edit State
  const [isEditingScope, setIsEditingScope] = useState(false);
  const [editedScope, setEditedScope] = useState(scopeOfWork);

  const handleSaveScope = async () => {
    setLoading(true);
    await updateProjectScope(project.slug, editedScope);
    setIsEditingScope(false);
    setLoading(false);
  };

  const statuses = [
    "AWAITING_SIGNATURE",
    "COLLECTING_ASSETS",
    "IN_PROGRESS",
    "IN_REVIEW",
    "DELIVERY",
    "COMPLETED"
  ];

  const handleAdvanceStatus = async () => {
    if (currentIndex < statuses.length - 1) {
      setLoading(true);
      await updateProjectStatus(project.slug, statuses[currentIndex + 1] as any);
      setLoading(false);
    }
  };

  const handleCreateDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append("title", newDelivTitle);
    fd.append("description", newDelivDesc);
    await addDeliverable(project.id, fd);
    setNewDelivTitle("");
    setNewDelivDesc("");
    setShowAddDeliv(false);
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
          Timeline
        </button>
        <button 
          onClick={() => setActiveTab("deliverables")}
          className={`pb-3 border-b-2 font-semibold text-sm transition-colors ${activeTab === "deliverables" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Deliverables ({deliverables.length})
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

          {/* TIMELINE TAB */}
          {activeTab === "timeline" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-slate-900">Project Timeline</h2>
                {currentIndex < statuses.length - 1 && (
                  <Button onClick={handleAdvanceStatus} disabled={loading} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                    Advance Stage <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-0.5">
                    {currentIndex >= 1 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : currentIndex === 0 ? <CircleDot className="w-5 h-5 text-indigo-600" /> : <Circle className="w-5 h-5 text-slate-200" />}
                  </div>
                  <div>
                    <p className={`text-sm ${currentIndex >= 1 ? 'text-slate-500 line-through' : currentIndex === 0 ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>
                      Awaiting Signature
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-0.5">
                    {currentIndex >= 2 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : currentIndex === 1 ? <CircleDot className="w-5 h-5 text-indigo-600" /> : <Circle className="w-5 h-5 text-slate-200" />}
                  </div>
                  <div>
                    <p className={`text-sm ${currentIndex >= 2 ? 'text-slate-500 line-through' : currentIndex === 1 ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>
                      Collecting Assets
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-0.5">
                    {currentIndex >= 3 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : currentIndex === 2 ? <CircleDot className="w-5 h-5 text-indigo-600" /> : <Circle className="w-5 h-5 text-slate-200" />}
                  </div>
                  <div>
                    <p className={`text-sm ${currentIndex >= 3 ? 'text-slate-500 line-through' : currentIndex === 2 ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>
                      In Progress (Design Execution)
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-0.5">
                    {currentIndex >= 4 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : currentIndex === 3 ? <CircleDot className="w-5 h-5 text-indigo-600" /> : <Circle className="w-5 h-5 text-slate-200" />}
                  </div>
                  <div>
                    <p className={`text-sm ${currentIndex >= 4 ? 'text-slate-500 line-through' : currentIndex === 3 ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>
                      In Review
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-0.5">
                    {currentIndex >= 5 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : currentIndex === 4 ? <CircleDot className="w-5 h-5 text-indigo-600" /> : <Circle className="w-5 h-5 text-slate-200" />}
                  </div>
                  <div>
                    <p className={`text-sm ${currentIndex >= 5 ? 'text-slate-500 line-through' : currentIndex === 4 ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>
                      Final Delivery
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-0.5">
                    {currentIndex === 5 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-slate-200" />}
                  </div>
                  <div>
                    <p className={`text-sm ${currentIndex === 5 ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>
                      Completed
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* DELIVERABLES TAB */}
          {activeTab === "deliverables" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-slate-900">Manage Deliverables</h2>
                <Button onClick={() => setShowAddDeliv(!showAddDeliv)} variant="outline" size="sm" className="font-bold">
                  <Plus className="w-4 h-4 mr-2" /> Add Item
                </Button>
              </div>

              {showAddDeliv && (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  const fd = new FormData(e.currentTarget);
                  await addDeliverable(project.id, fd);
                  setShowAddDeliv(false);
                  setLoading(false);
                }} className="mb-6 p-4 border border-indigo-100 bg-indigo-50/30 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-bold text-slate-700">Title</Label>
                      <Input name="title" placeholder="e.g. Final 4K Video Edit" required className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-slate-700">Description</Label>
                      <Input name="description" placeholder="Optional details..." className="mt-1" />
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <input type="checkbox" id="requiresPayment" name="requiresPayment" value="true" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                      <Label htmlFor="requiresPayment" className="text-sm font-bold text-slate-700">Require Payment to Download</Label>
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-slate-700">Link to Invoice (Optional)</Label>
                      <select name="invoiceId" className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white">
                        <option value="">None</option>
                        {invoices.map(inv => (
                          <option key={inv.id} value={inv.id}>{inv.title} - ${(inv.amount/100).toFixed(2)} ({inv.status})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={loading} size="sm" className="bg-indigo-600 hover:bg-indigo-700 font-bold text-white">Save Deliverable</Button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {deliverables.map((item) => (
                  <div key={item.id} className="p-4 border border-slate-100 bg-slate-50 rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                        {item.requiresPayment && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                            Payment Gated
                          </span>
                        )}
                        {item.clientStatus === 'APPROVED' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                            Client Approved
                          </span>
                        )}
                        {item.clientStatus === 'REVISIONS_REQUESTED' && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                            Revisions Requested
                          </span>
                        )}
                      </div>
                      {item.description && <p className="text-xs text-slate-500 mt-1">{item.description}</p>}
                      
                      {item.clientStatus === 'REVISIONS_REQUESTED' && item.clientFeedback && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-800">
                          <strong>Client Feedback: </strong>
                          {item.clientFeedback}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4 mt-3">
                        {item.previewUrl && (
                          <a href={item.previewUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center bg-slate-200/50 px-2 py-1 rounded">
                            <Download className="w-3 h-3 mr-1" /> View Preview File
                          </a>
                        )}
                        {item.fileUrl && (
                          <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center bg-indigo-50 px-2 py-1 rounded">
                            <Download className="w-3 h-3 mr-1" /> View Final File
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <div className="flex items-center gap-3">
                        <select 
                          value={item.status} 
                          onChange={(e) => updateDeliverableStatus(item.id, e.target.value as any)}
                          className="text-sm font-medium bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-600 outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In progress...">In progress...</option>
                          <option value="Complete">Complete</option>
                        </select>
                        
                        <button onClick={() => deleteDeliverable(item.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {item.status !== 'Complete' && (
                        <div className="flex gap-2">
                          <div className="border border-slate-200 rounded-lg bg-white px-2 py-1 shadow-sm">
                            <UploadButton
                              endpoint="adminDeliverable"
                              onClientUploadComplete={(res) => {
                                updateDeliverableStatus(item.id, item.status, undefined, res[0].url);
                              }}
                              onUploadError={(error) => alert(`Upload Error: ${error.message}`)}
                              appearance={{
                                button: "text-[10px] font-bold text-slate-600 bg-transparent border-none py-0.5 px-2 h-auto w-auto after:hidden",
                                allowedContent: "hidden"
                              }}
                              content={{ button: "Upload Preview" }}
                            />
                          </div>
                          
                          <div className="border border-indigo-200 rounded-lg bg-indigo-50 px-2 py-1 shadow-sm">
                            <UploadButton
                              endpoint="adminDeliverable"
                              onClientUploadComplete={(res) => {
                                updateDeliverableStatus(item.id, "Complete", res[0].url);
                              }}
                              onUploadError={(error) => alert(`Upload Error: ${error.message}`)}
                              appearance={{
                                button: "text-[10px] font-bold text-indigo-700 bg-transparent border-none py-0.5 px-2 h-auto w-auto after:hidden",
                                allowedContent: "hidden"
                              }}
                              content={{ button: "Upload Final" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {deliverables.length === 0 && !showAddDeliv && (
                  <p className="text-sm text-slate-500 italic">No deliverables added yet.</p>
                )}
              </div>
            </div>
          )}

          {/* INVOICES TAB */}
          {activeTab === "invoices" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-slate-900">Manage Invoices</h2>
                <Button onClick={() => setShowAddInv(!showAddInv)} variant="outline" size="sm" className="font-bold">
                  <Plus className="w-4 h-4 mr-2" /> Add Invoice
                </Button>
              </div>

              {showAddInv && (
                <form onSubmit={handleCreateInvoice} className="mb-6 p-4 border border-indigo-100 bg-indigo-50/30 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-bold text-slate-700">Invoice Name</Label>
                      <Input value={newInvTitle} onChange={e => setNewInvTitle(e.target.value)} placeholder="e.g. 50% Deposit" required className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-slate-700">Amount (USD)</Label>
                      <Input type="number" value={newInvAmount} onChange={e => setNewInvAmount(e.target.value)} placeholder="500" required className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-slate-700">Due Date</Label>
                      <Input type="date" value={newInvDate} onChange={e => setNewInvDate(e.target.value)} className="mt-1" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading} size="sm" className="bg-indigo-600 hover:bg-indigo-700 font-bold text-white">Save Invoice</Button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {invoices.map((inv) => (
                  <div key={inv.id} className="p-4 border border-slate-100 bg-slate-50 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900 text-sm">{inv.title}</p>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-slate-900 mt-1">${(inv.amount / 100).toLocaleString()}</p>
                      {inv.dueDate && <p className="text-xs text-slate-500 mt-1">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>}
                    </div>
                    <button onClick={() => deleteInvoice(inv.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {invoices.length === 0 && !showAddInv && (
                  <p className="text-sm text-slate-500 italic">No invoices created yet.</p>
                )}
              </div>
            </div>
          )}

          {/* SCOPE TAB */}
          {activeTab === "scope" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-slate-900">Scope of Work</h2>
                {!isEditingScope ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditingScope(true)} className="font-bold">
                    <Edit2 className="w-4 h-4 mr-2" /> Edit Scope
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setIsEditingScope(false); setEditedScope(scopeOfWork); }} className="font-bold">
                      Cancel
                    </Button>
                    <Button onClick={handleSaveScope} disabled={loading} size="sm" className="bg-indigo-600 hover:bg-indigo-700 font-bold text-white">
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

          {/* ASSETS TAB */}
          {activeTab === "assets" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-in fade-in duration-300">
              <h2 className="text-base font-bold text-slate-900 mb-6">Uploaded Assets</h2>
              {uploadedFiles.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No assets have been uploaded by the client yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-bold text-slate-900 truncate">{file.fileName}</p>
                          <p className="text-xs text-slate-500">
                            {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : 'Just now'}
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
