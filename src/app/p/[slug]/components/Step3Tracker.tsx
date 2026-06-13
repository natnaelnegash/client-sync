"use client";

import { Button } from "@/components/ui/button";
import { Upload, Download, CheckCircle2, Lock, Star, ChevronLeft } from "lucide-react";

export function Step3Tracker({
  projectName,
  agencyName,
  deliverables,
  invoice,
}: {
  projectName: string;
  agencyName: string;
  deliverables: any[];
  invoice: any;
}) {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Area */}
      <div className="flex items-start justify-between mt-8">
        <div className="space-y-1">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{projectName}</p>
          <h1 className="text-3xl font-bold text-slate-900">Project Status</h1>
          <p className="text-slate-500 text-sm">Track where we are in the project. We'll update this as each phase is completed.</p>
        </div>
        <Button variant="outline" className="hidden sm:flex text-slate-700 font-medium rounded-xl h-10 px-4">
          <ChevronLeft className="w-4 h-4 mr-2" />
          <Upload className="w-4 h-4 mr-2" />
          Upload files
        </Button>
      </div>

      {/* Timeline Status */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-indigo-500 before:to-slate-200">
          
          {/* Timeline Item 1 */}
          <div className="relative flex items-start gap-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-transparent">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 z-10 shadow-[0_0_0_4px_white]">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 bg-white pt-1">
              <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-2">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Discovery</h4>
                  <p className="text-sm text-slate-500">Kickoff, strategy brief, competitive research</p>
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
              <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-2">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Brand Direction</h4>
                  <p className="text-sm text-slate-500">Mood boards, direction proposals, client feedback</p>
                </div>
                <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full w-fit">
                  Complete
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Item 3 (Active) */}
          <div className="relative flex items-start gap-6">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 z-10 shadow-[0_0_0_4px_white]">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <div className="flex-1 bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 -mt-3 shadow-sm">
              <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-2">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Asset Collection</h4>
                  <p className="text-sm text-slate-500">Brand assets, photography, and reference files</p>
                </div>
                <div className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full w-fit shadow-sm">
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
              <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-2">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Design Execution</h4>
                  <p className="text-sm text-slate-500">Logo, typography, color system, and collateral</p>
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
              <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-2">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Handoff</h4>
                  <p className="text-sm text-slate-500">Final deliverables, guidelines, and invoice</p>
                </div>
                <div className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full w-fit">
                  Upcoming
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mini Upload CTA */}
      <button className="w-full bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 text-center text-sm font-medium text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-colors flex items-center justify-center gap-2">
        <Upload className="w-4 h-4 text-slate-400" />
        Need to upload more files? Click here to go back to the upload area.
      </button>

      {/* Deliverables */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <h3 className="font-bold text-slate-900 mb-6 text-lg">Your Deliverables</h3>
        <div className="space-y-4">
          {deliverables.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${item.status === 'Complete' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                  {item.status === 'Complete' ? <Download className="w-4 h-4" /> : <div className="w-4 h-4 bg-slate-200 rounded-sm" />}
                </div>
                <span className={`text-sm font-bold ${item.status === 'Complete' ? 'text-slate-900' : 'text-slate-600'}`}>{item.title}</span>
              </div>
              
              {item.status === 'Complete' ? (
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9">
                  <Download className="w-3.5 h-3.5 mr-2" />
                  Download
                </Button>
              ) : (
                <span className={`text-sm ${item.status === 'Pending' ? 'text-slate-400 font-medium' : 'text-indigo-600 font-medium'}`}>
                  {item.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invoice */}
      {invoice && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <h3 className="font-bold text-slate-900 mb-6 text-lg">Invoice</h3>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-3xl font-bold text-slate-900">${(invoice.amount / 100).toLocaleString()}</p>
              <p className="text-sm text-slate-500 font-medium">Deposit due on signing</p>
            </div>
            <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
              Paid <CheckCircle2 className="w-3 h-3" />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-bold text-slate-900">Balance due on delivery</p>
              <p className="text-xs text-slate-500">Payable July 21, 2026</p>
            </div>
            <p className="text-lg font-bold text-slate-900">${(invoice.amount / 100).toLocaleString()}</p>
          </div>

          <Button variant="outline" className="w-full h-12 rounded-xl text-slate-700 font-bold border-slate-200 hover:bg-slate-50">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            Pay balance early
          </Button>
        </div>
      )}

      {/* Footer Branding */}
      <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-400 pt-8 pb-4">
        <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Secured by ClientSync OS</span>
        <span>·</span>
        <span className="flex items-center gap-1.5"><Star className="w-3 h-3" /> Powered by {agencyName}</span>
      </div>
    </div>
  );
}
