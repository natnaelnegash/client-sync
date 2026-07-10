"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updatePayments } from "@/app/actions/settings";
import { useState } from "react";

export function TabPayments({ settings }: { settings: any }) {
  const [loading, setLoading] = useState(false);

  return (
    <form 
      action={async (data) => {
        setLoading(true);
        await updatePayments(data);
        setLoading(false);
      }}
      className="space-y-6 animate-in fade-in duration-500"
    >
      {/* Chapa Integration Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Chapa Integration</h2>
        <p className="text-sm text-slate-500 mb-6">Connect Chapa to collect invoice payments directly from your client portal in ETB.</p>
        
        <div className="space-y-4 max-w-2xl">
          <Button type="button" className="bg-[#00A651] hover:bg-[#008f46] text-white h-11 px-6 rounded-xl font-bold shadow-sm">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/>
            </svg>
            Connect Chapa
          </Button>
          <p className="text-xs text-slate-500 leading-relaxed max-w-[500px]">
            We use Chapa to securely process payments in Ethiopia. You keep 100% of what you invoice — ClientSync OS never takes a cut.
          </p>
        </div>
      </div>

      {/* Invoice Settings Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Invoice settings</h2>
        
        <div className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-2 gap-6">
            {/* Invoice Prefix */}
            <div className="space-y-3">
              <Label htmlFor="prefix" className="text-sm font-bold text-slate-900">Invoice prefix</Label>
              <Input 
                id="prefix"
                name="invoicePrefix"
                defaultValue={settings?.invoicePrefix || "INV-"}
                className="h-11 rounded-xl border-slate-200 shadow-sm focus-visible:ring-indigo-600 bg-slate-50/50"
              />
            </div>
            {/* Default terms */}
            <div className="space-y-3">
              <Label htmlFor="terms" className="text-sm font-bold text-slate-900">Default payment terms</Label>
              <select 
                id="terms"
                name="defaultPaymentTerms"
                defaultValue={settings?.defaultPaymentTerms || "Net 30"}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50 text-slate-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%20%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%221.66667%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_16px_center] bg-no-repeat pr-10 shadow-sm"
              >
                <option>Upon receipt</option>
                <option>Net 15</option>
                <option selected>Net 30</option>
                <option>Net 60</option>
              </select>
            </div>
          </div>

          {/* Default Invoice Notes */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-sm font-bold text-slate-900">Default invoice notes</Label>
            <Textarea 
              id="notes"
              name="defaultInvoiceNotes"
              defaultValue={settings?.defaultInvoiceNotes || "Thank you for your business. Payment can be made via the secure portal link above."}
              className="min-h-[100px] rounded-xl border-slate-200 shadow-sm focus-visible:ring-indigo-600 bg-slate-50/50 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button disabled={loading} type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-8 rounded-xl font-bold shadow-sm">
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
