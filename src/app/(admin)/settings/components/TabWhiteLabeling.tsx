"use client";

import { useState } from "react";
import { Upload, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateWhiteLabeling } from "@/app/actions/settings";
import { UploadButton } from "@/utils/uploadthing";

export function TabWhiteLabeling({ settings }: { settings: any }) {
  const [accentColor, setAccentColor] = useState(settings?.brandAccentColor || "#10B981");
  const [logoUrl, setLogoUrl] = useState(settings?.agencyLogoUrl || "");
  const [loading, setLoading] = useState(false);
  
  const colors = [
    "#10B981", // Emerald
    "#4F46E5", // Indigo
    "#059669", // Dark Emerald
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
  ];

  return (
    <form 
      action={async (data) => {
        setLoading(true);
        data.append("brandAccentColor", accentColor);
        data.append("brandLogoUrl", logoUrl);
        await updateWhiteLabeling(data);
        setLoading(false);
      }}
      className="space-y-6 animate-in fade-in duration-500"
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Agency Identity</h2>
        
        <div className="space-y-6 max-w-xl">
          {/* Logo Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-900">Agency Logo</Label>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-400 font-bold text-2xl">N</span>
                )}
              </div>
              <div className="space-y-2">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      setLogoUrl(res[0].url);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                />
                <p className="text-xs text-slate-500">SVG, PNG or JPG · Max 2MB · Recommended 200×200px</p>
              </div>
            </div>
          </div>

          {/* Agency Name */}
          <div className="space-y-3">
            <Label htmlFor="agencyName" className="text-sm font-bold text-slate-900">Agency name</Label>
            <Input 
              id="agencyName"
              name="agencyName"
              defaultValue={settings?.agencyName || "Northlight Studio"}
              className="h-11 rounded-xl border-slate-200 shadow-sm focus-visible:ring-indigo-600 bg-slate-50/50"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-3">
            <Label htmlFor="tagline" className="text-sm font-bold text-slate-900">
              Tagline <span className="font-normal text-slate-400">(shown in client portal)</span>
            </Label>
            <Input 
              id="tagline"
              name="agencyTagline"
              defaultValue={settings?.agencyTagline || "We design digital experiences."}
              className="h-11 rounded-xl border-slate-200 shadow-sm focus-visible:ring-indigo-600 bg-slate-50/50"
            />
          </div>

          {/* Brand Accent Color */}
          <div className="space-y-4 pt-2">
            <Label className="text-sm font-bold text-slate-900">Brand accent color</Label>
            <div className="flex flex-wrap items-center gap-3">
              {/* Custom Color Input Box */}
              <div className="flex items-center gap-2">
                <div 
                  className="w-10 h-10 rounded-lg shadow-sm border border-slate-200"
                  style={{ backgroundColor: accentColor }}
                />
                <Input 
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-28 rounded-lg border-slate-200 bg-slate-50 shadow-sm text-sm font-medium uppercase text-slate-700"
                />
              </div>
              {/* Preset Colors */}
              <div className="flex items-center gap-2 ml-4">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      accentColor === color ? "border-slate-900 scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            {/* Preview Box */}
            <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-sm shadow-sm"
                style={{ backgroundColor: accentColor }}
              >
                N
              </div>
              <span className="text-sm text-slate-500">
                Preview — this color will be used as your portal's primary accent.
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button disabled={loading} type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-8 rounded-xl font-bold shadow-sm">
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
