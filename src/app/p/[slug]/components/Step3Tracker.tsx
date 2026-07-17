"use client";

import { Button } from "@/components/ui/button";
import {
  Upload,
  Download,
  CheckCircle2,
  Lock,
  Star,
  ChevronLeft,
  Loader2,
  CircleDot,
  Circle,
  MessageSquare,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { ProjectChat } from "@/components/ProjectChat";
import { submitDeliverableFeedback } from "@/app/actions/deliverableFeedback";
import { UploadButton } from "@/utils/uploadthing";

export function Step3Tracker({
  projectId,
  projectName,
  agencyName,
  deliverables,
  invoices,
  contractFileUrl,
  initialMessages = [],
}: {
  projectId: string;
  projectName: string;
  agencyName: string;
  deliverables: any[];
  invoices: any[];
  contractFileUrl?: string | null;
  initialMessages?: any[];
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState<{ [key: string]: string }>(
    {},
  );

  const handlePayment = async (invoiceId: string) => {
    try {
      setLoading(invoiceId);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      const data = await res.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || "Failed to initialize payment");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Area */}
      <div className="flex items-start justify-between mt-8 mb-8">
        <div className="space-y-1">
          <p className="text-xs font-bold text-brand uppercase tracking-wider">
            {projectName}
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Project Status</h1>
          <p className="text-slate-500 text-sm">
            Track where we are in the project. We'll update this as each phase
            is completed.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {contractFileUrl && (
            <a
              href={contractFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center justify-center whitespace-nowrap rounded-xl h-10 px-4 text-sm font-medium border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Contract
            </a>
          )}
          <Button
            variant="outline"
            className="hidden sm:flex text-slate-700 font-medium rounded-xl h-10 px-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            <Upload className="w-4 h-4 mr-2" />
            Upload files
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* LEFT COLUMN: Tracking & Deliverables */}
        <div className="lg:col-span-3 space-y-8">
          {/* Timeline Status */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-brand before:to-slate-200">
              {/* Timeline Item 1 */}
              <div className="relative flex items-start gap-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-transparent">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 z-10 shadow-[0_0_0_4px_white]">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 bg-white pt-1">
                  <div className="flex sm:items-center justify-between sm:flex-row gap-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Discovery
                      </h4>
                      <p className="text-sm text-slate-500">
                        Kickoff, strategy brief, competitive research
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full w-fit">
                      Complete
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative flex items-start gap-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 z-10 shadow-[0_0_0_4px_white]">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 bg-white pt-1">
                  <div className="flex sm:items-center justify-between sm:flex-row gap-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Brand Direction
                      </h4>
                      <p className="text-sm text-slate-500">
                        Mood boards, direction proposals, client feedback
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full w-fit">
                      Complete
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Item 3 (Active) */}
              <div className="relative flex items-start gap-6">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center shrink-0 z-10 shadow-[0_0_0_4px_white]">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 bg-brand/10 border border-brand/20 rounded-xl p-4 -mt-3 shadow-sm">
                  <div className="flex sm:items-center justify-between sm:flex-row gap-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Asset Collection
                      </h4>
                      <p className="text-sm text-slate-500">
                        Brand assets, photography, and reference files
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-brand text-white text-xs font-bold rounded-full w-fit shadow-sm">
                      In progress
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Item 4 (Upcoming) */}
              <div className="relative flex items-start gap-6">
                <div className="w-10 h-10 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center shrink-0 z-10 shadow-[0_0_0_4px_white]">
                  <span className="text-slate-400 font-bold text-sm">4</span>
                </div>
                <div className="flex-1 bg-white pt-1 opacity-60">
                  <div className="flex sm:items-center justify-between sm:flex-row gap-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Design Execution
                      </h4>
                      <p className="text-sm text-slate-500">
                        Logo, typography, color system, and collateral
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full w-fit">
                      Upcoming
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Item 5 (Upcoming) */}
              <div className="relative flex items-start gap-6">
                <div className="w-10 h-10 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center shrink-0 z-10 shadow-[0_0_0_4px_white]">
                  <span className="text-slate-400 font-bold text-sm">5</span>
                </div>
                <div className="flex-1 bg-white pt-1 opacity-60">
                  <div className="flex sm:items-center justify-between sm:flex-row gap-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Handoff
                      </h4>
                      <p className="text-sm text-slate-500">
                        Final deliverables, guidelines, and invoice
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full w-fit">
                      Upcoming
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deliverables */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
            <h3 className="font-bold text-slate-900 mb-6 text-lg">
              Your Deliverables
            </h3>
            <div className="space-y-4">
              {deliverables.length === 0 ? (
                <p className="text-sm text-slate-500 italic">
                  No deliverables have been added yet.
                </p>
              ) : (
                deliverables.map((item, i) => {
                  const linkedInvoice = item.invoiceId
                    ? invoices.find((inv) => inv.id === item.invoiceId)
                    : null;
                  const isLocked =
                    item.requiresPayment &&
                    linkedInvoice &&
                    linkedInvoice.status !== "PAID";

                  return (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-start justify-between py-4 border-b border-slate-100 last:border-0 last:pb-0 gap-4"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`p-2 rounded-lg mt-0.5 shrink-0 ${item.status === "Complete" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}
                        >
                          {item.status === "Complete" ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <div className="w-4 h-4 bg-slate-200 rounded-sm" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-bold ${item.status === "Complete" ? "text-slate-900" : "text-slate-600"}`}
                            >
                              {item.title}
                            </span>
                            {isLocked && (
                              <Lock className="w-3 h-3 text-amber-500" />
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-slate-500 mt-1">
                              {item.description}
                            </p>
                          )}

                          {item.previewUrl && (
                            <div className="mt-3">
                              <a
                                href={item.previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <Download className="w-3.5 h-3.5 mr-1.5" />
                                View Preview
                              </a>
                            </div>
                          )}

                          {/* Feedback Form for PENDING preview/files */}
                          {(item.previewUrl || item.fileUrl) &&
                            item.clientStatus === "PENDING" && (
                              <div className="mt-4 p-4 border border-brand/20 bg-brand/10 rounded-xl space-y-3">
                                <p className="text-xs font-bold text-brand uppercase tracking-wider">
                                  Provide Feedback / Request Revision
                                </p>
                                <textarea
                                  className="w-full text-sm p-3 rounded-lg border border-brand/20 focus:outline-none focus:ring-2 focus:ring-brand bg-white"
                                  placeholder="Looks great! / Please change..."
                                  rows={2}
                                  value={feedbackText[item.id] || ""}
                                  onChange={(e) =>
                                    setFeedbackText({
                                      ...feedbackText,
                                      [item.id]: e.target.value,
                                    })
                                  }
                                />
                                <div className="flex gap-2">
                                  <Button
                                    onClick={async () => {
                                      setLoading(`approve-${item.id}`);
                                      await submitDeliverableFeedback(
                                        item.id,
                                        "APPROVED",
                                      );
                                      setLoading(null);
                                    }}
                                    disabled={loading === `approve-${item.id}`}
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-sm flex-1"
                                  >
                                    {loading === `approve-${item.id}` ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      "Approve"
                                    )}
                                  </Button>
                                  <Button
                                    onClick={async () => {
                                      if (!feedbackText[item.id])
                                        return alert(
                                          "Please provide feedback first.",
                                        );
                                      setLoading(`revise-${item.id}`);
                                      await submitDeliverableFeedback(
                                        item.id,
                                        "REVISIONS_REQUESTED",
                                        feedbackText[item.id],
                                      );
                                      setLoading(null);
                                    }}
                                    disabled={loading === `revise-${item.id}`}
                                    size="sm"
                                    className="bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold flex-1 border"
                                  >
                                    {loading === `revise-${item.id}` ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      "Request Revisions"
                                    )}
                                  </Button>
                                </div>
                              </div>
                            )}

                          {/* Display Status if already reviewed */}
                          {item.clientStatus === "APPROVED" && (
                            <div className="mt-3 text-xs font-bold text-emerald-600 flex items-center">
                              <CheckCircle2 className="w-4 h-4 mr-1.5" /> You
                              approved this deliverable.
                            </div>
                          )}
                          {item.clientStatus === "REVISIONS_REQUESTED" && (
                            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                              <strong className="block mb-1 font-bold uppercase tracking-wider">
                                Revisions Requested:
                              </strong>
                              {item.clientFeedback}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col gap-2">
                        {item.status === "Complete" && item.fileUrl ? (
                          isLocked ? (
                            <Button
                              onClick={() => handlePayment(linkedInvoice.id)}
                              disabled={loading === linkedInvoice.id}
                              className="bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold h-9 border border-amber-200"
                            >
                              {loading === linkedInvoice.id ? (
                                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                              ) : (
                                <Lock className="w-3.5 h-3.5 mr-2" />
                              )}
                              Pay to Unlock
                            </Button>
                          ) : (
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 bg-brand hover:opacity-90 text-white shadow-sm"
                            >
                              <Download className="w-3.5 h-3.5 mr-2" />
                              Download Final
                            </a>
                          )
                        ) : item.status === "Complete" ? (
                          <Button
                            disabled
                            size="sm"
                            className="bg-brand/50 text-white font-bold h-9"
                          >
                            <Download className="w-3.5 h-3.5 mr-2" />
                            No File Attached
                          </Button>
                        ) : (
                          <span
                            className={`text-sm ${item.status === "Pending" ? "text-slate-400 font-medium" : "text-brand font-medium"}`}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Chat & Invoices */}
        <div className="lg:col-span-2 space-y-8">
          {/* Chat Section */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <ProjectChat
              projectId={projectId}
              initialMessages={initialMessages}
              currentRole="CLIENT"
            />
          </div>

          {/* Invoices */}
          {invoices.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
              <h3 className="font-bold text-slate-900 mb-6 text-lg">
                Invoices
              </h3>

              <div className="space-y-6">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-bold text-slate-900">{inv.title}</p>
                        <div
                          className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full flex items-center gap-1 ${inv.status === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                        >
                          {inv.status}
                        </div>
                      </div>
                      <p className="text-sm text-slate-500">
                        {inv.dueDate
                          ? `Due by ${new Date(inv.dueDate).toLocaleDateString()}`
                          : "Payable upon receipt"}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-3">
                      <p className="text-xl font-bold text-slate-900">
                        ${(inv.amount / 100).toLocaleString()}
                      </p>

                      {inv.status !== "PAID" && (
                        <Button
                          onClick={() => handlePayment(inv.id)}
                          disabled={loading === inv.id}
                          className="w-full sm:w-auto h-10 rounded-lg text-white font-bold bg-[#635BFF] hover:bg-[#5851E5] shadow-sm"
                        >
                          {loading === inv.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <svg
                              className="w-4 h-4 mr-2"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect x="2" y="5" width="20" height="14" rx="2" />
                              <line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                          )}
                          Pay now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mini Upload CTA */}
          <div className="w-full bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors hover:border-brand/40 hover:bg-brand/5">
            <UploadButton
              endpoint="projectAssets"
              input={{ projectId }}
              content={{
                button({ ready }) {
                  return ready ? "Upload more files" : "Loading...";
                },
              }}
              onClientUploadComplete={() => {
                window.location.reload();
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
              className="ut-button:bg-brand ut-button:ut-readying:bg-brand/50 ut-button:ut-uploading:bg-brand/50 ut-label:text-brand"
            />
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-400 pt-8 pb-4">
        <span className="flex items-center gap-1.5">
          <Lock className="w-3 h-3" /> Secured by ClientSync OS
        </span>
        <span>·</span>
        <span className="flex items-center gap-1.5">
          <Star className="w-3 h-3" /> Powered by {agencyName}
        </span>
      </div>
    </div>
  );
}
