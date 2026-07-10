"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Wand2,
  Bold,
  List as ListIcon,
  Link2,
  User,
  ChevronRight,
  Loader2,
} from "lucide-react";
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

export function CreateProjectModal({
  triggerVariant = "default",
}: {
  triggerVariant?: "default" | "action";
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fake state for the UI interaction matching the screenshot
  const [depositEnabled, setDepositEnabled] = useState(true);
  const [depositPercent, setDepositPercent] = useState<number | null>(50);
  const [clients, setClients] = useState<any[]>([]);

  const [scopeText, setScopeText] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const newText =
      text.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      text.substring(end);
    setScopeText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleEnhance = async () => {
    setIsEnhancing(true);
    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (scopeText.trim() === "") {
      setScopeText("### Project Overview\n\n### Deliverables\n- \n- \n\n### Timeline\n");
    } else {
      setScopeText(`### Enhanced Scope of Work\n\n${scopeText.trim()}\n\n### Next Steps\n- `);
    }
    setIsEnhancing(false);
  };

  useEffect(() => {
    if (open) {
      import("@/app/actions/client")
        .then((m) => m.getClients())
        .then(setClients);
    }
  }, [open]);

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
              <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                Create new project
              </p>
              <p className="text-sm text-slate-500">Set up scope & proposal</p>
            </div>
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden bg-white border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] !rounded-2xl">
        <form
          action={async (data) => {
            setLoading(true);
            try {
              await createProject(data);
              setOpen(false);
            } catch (err) {
              console.error(err);
            } finally {
              setLoading(false);
            }
          }}
          className="flex flex-col h-[85vh] sm:h-auto sm:max-h-[85vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-start gap-4 shrink-0 bg-white">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 mt-1">
              <Wand2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                Create New Project
              </DialogTitle>
              <DialogDescription className="text-slate-500 mt-1 text-sm">
                Generate a secure client portal and set up the project scope.
              </DialogDescription>
            </div>
          </div>

          {/* Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white scrollbar-thin scrollbar-thumb-slate-200">
            {/* Client Section */}
            <div className="space-y-3">
              <Label
                htmlFor="clientName"
                className="text-base font-bold text-slate-900"
              >
                Client <span className="text-red-500">*</span>
              </Label>
              <p className="text-sm text-slate-500 mt-0.5">
                Select an existing client or type a new name.
              </p>
              <Input
                id="clientName"
                name="clientName"
                list="clientNames"
                placeholder="Enter client name..."
                className="h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-600 text-base shadow-sm"
                required
              />
              <datalist id="clientNames">
                {clients.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>

            {/* Project Name */}
            <div className="space-y-3">
              <Label
                htmlFor="projectName"
                className="text-base font-bold text-slate-900"
              >
                Project name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="projectName"
                name="projectName"
                placeholder="Web Design"
                className="h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-600 text-base shadow-sm"
                required
              />
            </div>

            {/* Scope of Work */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="scopeOfWork"
                  className="text-base font-bold text-slate-900"
                >
                  Scope of work
                </Label>
                <span className="text-sm text-slate-400">Optional</span>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-600 focus-within:border-transparent transition-all shadow-sm">
                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => insertFormatting("**", "**")}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-md transition-colors"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("- ")}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-md transition-colors"
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("[", "](url)")}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-md transition-colors"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-slate-200 mx-1" />
                  <button
                    type="button"
                    onClick={handleEnhance}
                    disabled={isEnhancing}
                    className="flex items-center gap-2 px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isEnhancing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                    {isEnhancing ? "Enhancing..." : "Enhance"}
                  </button>
                </div>
                <Textarea
                  id="scopeOfWork"
                  name="scopeOfWork"
                  ref={textareaRef}
                  value={scopeText}
                  onChange={(e) => setScopeText(e.target.value)}
                  placeholder="Describe the project scope, deliverables, and timeline..."
                  className="min-h-[140px] border-none focus-visible:ring-0 rounded-none resize-none p-4 text-base"
                />
              </div>
            </div>

            {/* Financials */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-bold text-slate-900">
                  Financials{" "}
                  <span className="text-slate-400 font-normal ml-1">
                    — optional
                  </span>
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-slate-600 font-medium">
                    Project value
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                      $
                    </span>
                    <Input
                      id="projectInvoiceAmount"
                      name="projectInvoiceAmount"
                      placeholder="300"
                      className="h-12 pl-8 rounded-xl border-slate-200 shadow-sm"
                      type="number"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-slate-600 font-medium">
                    Currency
                  </Label>
                  <select className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%20%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%221.66667%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_16px_center] bg-no-repeat pr-10 shadow-sm">
                    <option>USD — US Dollar</option>
                    <option>ETB — Ethipian Birr</option>
                    <option>EUR — Euro</option>
                    <option>GBP — British Pound</option>
                  </select>
                </div>
              </div>

              {/* Deposit Box */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Label className="text-base font-bold text-slate-900">
                      Require deposit upfront
                    </Label>
                    <p className="text-sm text-slate-500 mt-1">
                      Client pays a percentage before work begins.
                    </p>
                  </div>
                  {/* Custom Toggle */}
                  <button
                    type="button"
                    onClick={() => setDepositEnabled(!depositEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${depositEnabled ? "bg-indigo-600" : "bg-slate-300"}`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${depositEnabled ? "translate-x-5" : "translate-x-1"}`}
                    />
                  </button>
                </div>

                {depositEnabled && (
                  <div className="pt-2">
                    <Label className="text-sm text-slate-500 font-medium mb-3 block">
                      Deposit percentage
                    </Label>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDepositPercent(25)}
                        className={`h-10 px-4 rounded-lg text-sm font-bold transition-colors ${depositPercent === 25 ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                      >
                        25%
                      </button>
                      <button
                        type="button"
                        onClick={() => setDepositPercent(33)}
                        className={`h-10 px-4 rounded-lg text-sm font-bold transition-colors ${depositPercent === 33 ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                      >
                        33%
                      </button>
                      <button
                        type="button"
                        onClick={() => setDepositPercent(50)}
                        className={`h-10 px-4 rounded-lg text-sm font-bold transition-colors ${depositPercent === 50 ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                      >
                        50%
                      </button>
                      <div className="flex items-center h-10 bg-white border border-slate-200 rounded-lg px-3 w-20 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                        <input
                          type="text"
                          placeholder="50"
                          className="w-full text-sm font-bold text-slate-900 border-none outline-none p-0 focus:ring-0 bg-transparent text-center"
                        />
                        <span className="text-slate-400 text-sm font-bold">
                          %
                        </span>
                      </div>
                      <span className="ml-2 text-indigo-600 font-bold text-sm bg-white border border-indigo-100 rounded-lg px-3 h-10 flex items-center shadow-sm">
                        = $150
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-xs font-medium leading-snug">
                Client portal generated
                <br />
                automatically
              </span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                className="h-11 px-6 rounded-xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50 w-full sm:w-auto shadow-sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full sm:w-auto shadow-sm"
                disabled={loading}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {loading ? "Creating..." : "Create Project & Generate Link"}
                {!loading && (
                  <ChevronRight className="w-4 h-4 ml-1 opacity-70" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
