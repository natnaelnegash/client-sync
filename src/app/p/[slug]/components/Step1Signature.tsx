"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Shield } from "lucide-react";
import { signProject } from "@/app/actions/project";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useUploadThing } from "@/utils/uploadthing";

export function Step1Signature({
  projectSlug,
  projectId,
  projectName,
  agencyName,
  projectValue,
  startDate,
  deliveryDate,
  scopeOfWork,
}: {
  projectSlug: string;
  projectId: string;
  projectName: string;
  agencyName: string;
  projectValue: number;
  startDate: Date | null;
  deliveryDate: Date | null;
  scopeOfWork: string;
}) {
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [signatureText, setSignatureText] = useState("");
  const contractRef = useRef<HTMLDivElement>(null);
  const { startUpload } = useUploadThing("contractUpload");

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      // 1. Wait a tiny bit for the UI to reflect loading state (which hides the form and shows the signature block)
      await new Promise((r) => setTimeout(r, 100));

      if (contractRef.current) {
        // 2. Take a snapshot of the contract div
        const imgData = await toPng(contractRef.current, { pixelRatio: 2 });

        // 3. Create a PDF
        // Get natural dimensions of the node
        const width = contractRef.current.offsetWidth;
        const height = contractRef.current.offsetHeight;

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [width, height],
        });
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        const pdfBlob = pdf.output("blob");
        const file = new File(
          [pdfBlob],
          `Contract_${projectName.replace(/\s+/g, "_")}.pdf`,
          { type: "application/pdf" },
        );

        // 4. Upload to UploadThing
        await startUpload([file], { projectId });
      }

      // 5. Submit the signature to the database to advance the stage
      await signProject(projectSlug, formData);
    } catch (err) {
      console.error("Failed to generate/upload contract PDF", err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* THIS WRAPPER WILL BE TURNED INTO A PDF */}
      <div ref={contractRef} className="bg-slate-50 p-6 md:p-10 rounded-2xl">
        <div className="space-y-2 mb-8">
          <p className="text-xs font-bold text-brand uppercase tracking-wider">
            Contract with {agencyName}
          </p>
          <h1 className="text-3xl font-bold text-slate-900">{projectName}</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-medium mb-1">
              Project value
            </p>
            <p className="text-lg font-bold text-slate-900">
              ${(projectValue / 100).toLocaleString()}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-medium mb-1">
              Start date
            </p>
            <p className="text-lg font-bold text-slate-900">
              {startDate ? format(startDate, "MMM d, yyyy") : "TBD"}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-medium mb-1">
              Estimated delivery
            </p>
            <p className="text-lg font-bold text-slate-900">
              {deliveryDate ? format(deliveryDate, "MMM d, yyyy") : "TBD"}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
              Scope of Work
            </h2>
            <div className="prose prose-slate max-w-none text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {scopeOfWork}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Dynamic Signature Block - only visible on PDF or when loading */}
        {loading && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 mt-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
              Digital Signature
            </h3>
            <p className="text-sm text-slate-500 mb-2">Signed by:</p>
            <p className="text-3xl font-serif text-slate-800 italic">
              {signatureText}
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Date: {format(new Date(), "MMM d, yyyy")}
            </p>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Digitally verified by ClientSync OS
            </p>
          </div>
        )}
      </div>

      {!loading && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-2 text-slate-500 mb-4">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">
              Secure digital signature
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Sign this document
          </h3>

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="clientSignature"
                className="text-sm font-bold text-slate-900"
              >
                Full legal name
              </Label>
              <Input
                id="clientSignature"
                name="clientSignature"
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                placeholder="Type your full name to sign"
                required
                className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-brand rounded-lg text-lg"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="pt-1">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 text-brand border-slate-300 rounded focus:ring-brand cursor-pointer"
                />
              </div>
              <span className="text-sm text-slate-600 leading-snug group-hover:text-slate-900 transition-colors">
                I have read and agree to the scope of work above. I understand
                this constitutes a legally binding agreement.
              </span>
            </label>

            <Button
              type="submit"
              disabled={!agreed || loading || !signatureText.trim()}
              className={`w-full h-12 rounded-xl text-base font-bold shadow-sm transition-all ${agreed && signatureText.trim() ? "bg-brand hover:opacity-90 text-white" : "bg-brand/50 text-white cursor-not-allowed"}`}
            >
              <Shield className="w-4 h-4 mr-2" />
              Accept & Sign Document
            </Button>

            <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 pt-2">
              <Lock className="w-3 h-3" />
              256-bit encryption · Legally binding · Full audit trail
            </p>
          </form>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand border-t-transparent mb-4"></div>
          <p className="text-brand font-bold animate-pulse">
            Generating secure PDF contract...
          </p>
        </div>
      )}
    </div>
  );
}
