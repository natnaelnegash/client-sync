"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Shield } from "lucide-react";
import { signProject } from "@/app/actions/project";
import { format } from "date-fns";

export function Step1Signature({
  projectSlug,
  projectName,
  agencyName,
  projectValue,
  startDate,
  deliveryDate,
  scopeOfWork,
}: {
  projectSlug: string;
  projectName: string;
  agencyName: string;
  projectValue: number;
  startDate: Date | null;
  deliveryDate: Date | null;
  scopeOfWork: string;
}) {
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 mt-8">
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">From {agencyName}</p>
        <h1 className="text-3xl font-bold text-slate-900">{projectName}</h1>
        <p className="text-slate-500 text-sm">Please review the scope of work below and sign to kick off the project.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 font-medium mb-1">Project value</p>
          <p className="text-lg font-bold text-slate-900">${(projectValue / 100).toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 font-medium mb-1">Start date</p>
          <p className="text-lg font-bold text-slate-900">{startDate ? format(startDate, 'MMM d, yyyy') : 'TBD'}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 font-medium mb-1">Estimated delivery</p>
          <p className="text-lg font-bold text-slate-900">{deliveryDate ? format(deliveryDate, 'MMM d, yyyy') : 'TBD'}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
            Scope of Work — {projectName}
          </h2>
          <div className="prose prose-slate max-w-none text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {scopeOfWork}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-2 text-slate-500 mb-4">
          <Lock className="w-4 h-4" />
          <span className="text-sm font-medium">Secure digital signature</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Sign this document</h3>
        
        <form
          action={async (data) => {
            setLoading(true);
            try {
              await signProject(projectSlug, data);
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="clientSignature" className="text-sm font-bold text-slate-900">
              Full legal name
            </Label>
            <Input
              id="clientSignature"
              name="clientSignature"
              placeholder="Type your full name to sign"
              required
              className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-600 rounded-lg"
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="pt-1">
              <input 
                type="checkbox" 
                required 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-600 cursor-pointer" 
              />
            </div>
            <span className="text-sm text-slate-600 leading-snug group-hover:text-slate-900 transition-colors">
              I have read and agree to the scope of work above. I understand this constitutes a legally binding agreement.
            </span>
          </label>

          <Button 
            type="submit" 
            disabled={!agreed || loading}
            className={`w-full h-12 rounded-xl text-base font-bold shadow-sm transition-all ${agreed ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-200 text-white cursor-not-allowed'}`}
          >
            <Shield className="w-4 h-4 mr-2" />
            {loading ? "Signing..." : "Accept & Sign Document"}
          </Button>

          <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 pt-2">
            <Lock className="w-3 h-3" />
            256-bit encryption · Legally binding · Full audit trail
          </p>
        </form>
      </div>

      <div className="text-center pt-8 opacity-50 pb-8">
        <p className="text-xs text-slate-400 mb-3">Demo navigation (not shown to real clients)</p>
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" className="text-xs" disabled>
            Skip to Assets &rarr;
          </Button>
          <Button variant="outline" size="sm" className="text-xs" disabled>
            Skip to Tracker &rarr;
          </Button>
        </div>
      </div>
    </div>
  );
}
