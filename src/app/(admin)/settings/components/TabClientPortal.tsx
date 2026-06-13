"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { updateClientPortal } from "@/app/actions/settings";

export function TabClientPortal({ settings }: { settings: any }) {
  const [showBranding, setShowBranding] = useState(settings?.showAgencyBranding ?? true);
  const [allowDownloads, setAllowDownloads] = useState(settings?.allowDownloads ?? true);
  const [require2FA, setRequire2FA] = useState(settings?.require2fa ?? true);
  const [emailNotifications, setEmailNotifications] = useState(settings?.emailNotifications ?? false);
  const [loading, setLoading] = useState(false);

  return (
    <form 
      action={async (data) => {
        setLoading(true);
        data.append("showAgencyBranding", String(showBranding));
        data.append("allowDownloads", String(allowDownloads));
        data.append("require2fa", String(require2FA));
        data.append("emailNotifications", String(emailNotifications));
        await updateClientPortal(data);
        setLoading(false);
      }}
      className="space-y-6 animate-in fade-in duration-500"
    >
      {/* Custom Domain Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Custom Domain</h2>
        
        <div className="space-y-6 max-w-2xl">
          {/* Default Domain */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-600">
            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
            <p>
              Default: <span className="font-mono text-slate-900 font-medium">app.clientsync.io/portal/your-workspace</span>
            </p>
          </div>

          {/* Custom Subdomain */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-900">Custom subdomain</label>
            <div className="flex items-center gap-3">
              <Input 
                name="customSubdomain"
                defaultValue={settings?.customSubdomain || "clients.northlightstudio.co"}
                className="h-11 rounded-xl border-slate-200 shadow-sm focus-visible:ring-indigo-600 max-w-sm"
              />
              <Button type="button" className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-6 rounded-xl font-bold shadow-sm">
                Connect
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Point a CNAME record to <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-600">portal.clientsync.io</code> and we'll handle SSL automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Portal Preferences Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Portal Preferences</h2>
        
        <div className="space-y-6 max-w-3xl">
          {/* Toggle 1 */}
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <h3 className="text-sm font-bold text-slate-900">Show agency branding in portal header</h3>
              <p className="text-sm text-slate-500 mt-1">Display your logo and name instead of ClientSync OS branding.</p>
            </div>
            <button 
              type="button"
              onClick={() => setShowBranding(!showBranding)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${showBranding ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${showBranding ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Toggle 2 */}
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <h3 className="text-sm font-bold text-slate-900">Allow clients to download files</h3>
              <p className="text-sm text-slate-500 mt-1">Clients can re-download any files they've uploaded.</p>
            </div>
            <button 
              type="button"
              onClick={() => setAllowDownloads(!allowDownloads)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${allowDownloads ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${allowDownloads ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Toggle 3 */}
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <h3 className="text-sm font-bold text-slate-900">Require 2FA for portal access</h3>
              <p className="text-sm text-slate-500 mt-1">Clients must verify their email each time they access their portal.</p>
            </div>
            <button 
              type="button"
              onClick={() => setRequire2FA(!require2FA)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${require2FA ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${require2FA ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Toggle 4 */}
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <h3 className="text-sm font-bold text-slate-900">Send email notifications to client</h3>
              <p className="text-sm text-slate-500 mt-1">Notify client on status changes and milestone completions.</p>
            </div>
            <button 
              type="button"
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${emailNotifications ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
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
