"use client";

import { UploadDropzone } from "@/utils/uploadthing";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Upload, ArrowRight, FolderOpen, Clock } from "lucide-react";
import { completeAssetCollection } from "@/app/actions/project";
import { useState } from "react";

export function Step2Upload({
  projectSlug,
  projectId,
}: {
  projectSlug: string;
  projectId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between mt-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-bold">Contract signed</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Upload Your Assets</h1>
          <p className="text-slate-500 text-sm">Drop your brand files below. You can return here any time to add more.</p>
        </div>
        
        <form action={async () => {
          setLoading(true);
          await completeAssetCollection(projectSlug);
        }}>
          <Button type="submit" variant="outline" className="hidden sm:flex text-indigo-600 border-indigo-200 hover:bg-indigo-50 font-bold rounded-xl h-10 px-4">
            <FolderOpen className="w-4 h-4 mr-2" />
            View tracker
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <h3 className="font-bold text-slate-900 mb-4">What to upload</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              Existing logo files (SVG, AI, EPS, PNG)
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              Photography / imagery you own
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              Color swatches or palette references
            </li>
          </ul>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              Brand guidelines or style guide
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              Any fonts or typefaces you use
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600 leading-snug">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1 self-start" />
              Anything else that represents your current brand
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-1 overflow-hidden transition-colors hover:border-indigo-300 hover:bg-indigo-50/50">
        <UploadDropzone
          endpoint="projectAssets"
          className="ut-button:bg-indigo-600 ut-button:ut-readying:bg-indigo-600/50 ut-button:ut-uploading:bg-indigo-600/50 ut-label:text-indigo-600 hover:bg-transparent border-none py-12"
          onClientUploadComplete={() => {
            setUploadedCount(prev => prev + 1);
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
          input={{ projectId }}
        />
      </div>

      <div className="flex items-center gap-3 bg-slate-50 text-slate-600 text-sm font-medium px-4 py-3 rounded-xl border border-slate-100">
        <Clock className="w-4 h-4 text-slate-400" />
        You can return to this portal link at any time to add or update files.
      </div>

      <div className="pt-4 space-y-3 text-center">
        <form action={async () => {
          setLoading(true);
          await completeAssetCollection(projectSlug);
        }}>
          <Button 
            type="submit" 
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-lg shadow-sm transition-all"
            disabled={loading}
          >
            {uploadedCount > 0 ? "Done Uploading — view project status" : "Skip for now — view project status"}
            <ArrowRight className="w-5 h-5 ml-2 opacity-80" />
          </Button>
        </form>
        <p className="text-xs text-slate-500 font-medium">You can upload more files at any time by returning to this page.</p>
      </div>
    </div>
  );
}
