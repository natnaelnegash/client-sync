import React from "react";
import { Check } from "lucide-react";

export function PortalHeader({
  clientName,
  agencyName,
  brandLogoUrl,
  activeStep,
}: {
  clientName: string;
  agencyName: string;
  brandLogoUrl?: string | null;
  activeStep: number;
}) {
  return (
    <div className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Nav */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-brand">
              {brandLogoUrl ? (
                <img src={brandLogoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-lg">{agencyName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-sm leading-tight">{agencyName}</span>
              <span className="text-xs text-slate-500 leading-tight">Client portal</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0099FF] flex items-center justify-center text-white font-bold text-xs shrink-0">
              {clientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <span className="font-bold text-slate-900 text-sm hidden sm:block">{clientName}</span>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center py-4 border-t border-slate-50/50">
          <div className="flex items-center gap-2 sm:gap-4 max-w-2xl w-full justify-between">
            {/* Step 1 */}
            <div className={`flex items-center gap-2 flex-1 ${activeStep >= 1 ? "opacity-100" : "opacity-50"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${activeStep > 1 ? "bg-emerald-500 text-white" : activeStep === 1 ? "bg-brand text-white" : "bg-slate-200 text-slate-500"}`}>
                {activeStep > 1 ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : "1"}
              </div>
              <span className={`text-sm font-bold whitespace-nowrap ${activeStep >= 1 ? "text-slate-900" : "text-slate-500"}`}>Review & Sign</span>
              <div className="hidden sm:block flex-1 h-px bg-slate-200 mx-2" />
            </div>

            {/* Step 2 */}
            <div className={`flex items-center gap-2 flex-1 ${activeStep >= 2 ? "opacity-100" : "opacity-50"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${activeStep > 2 ? "bg-emerald-500 text-white" : activeStep === 2 ? "bg-brand text-white" : "bg-slate-100 text-slate-400"}`}>
                {activeStep > 2 ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : "2"}
              </div>
              <span className={`text-sm font-bold whitespace-nowrap ${activeStep >= 2 ? "text-slate-900" : "text-slate-500"}`}>Upload Assets</span>
              <div className="hidden sm:block flex-1 h-px bg-slate-200 mx-2" />
            </div>

            {/* Step 3 */}
            <div className={`flex items-center gap-2 ${activeStep >= 3 ? "opacity-100" : "opacity-50"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${activeStep === 3 ? "bg-brand text-white" : "bg-slate-100 text-slate-400"}`}>
                3
              </div>
              <span className={`text-sm font-bold whitespace-nowrap ${activeStep === 3 ? "text-slate-900" : "text-slate-500"}`}>Track Progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
