"use client";

import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TabSecurity() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Password Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Password</h2>
        
        <form className="space-y-6 max-w-xl">
          <div className="space-y-3">
            <Label htmlFor="current" className="text-sm font-bold text-slate-900">Current password</Label>
            <Input 
              id="current"
              type="password"
              placeholder="••••••••"
              className="h-11 rounded-xl border-slate-200 shadow-sm focus-visible:ring-indigo-600 bg-slate-50/50"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="new" className="text-sm font-bold text-slate-900">New password</Label>
            <Input 
              id="new"
              type="password"
              placeholder="••••••••"
              className="h-11 rounded-xl border-slate-200 shadow-sm focus-visible:ring-indigo-600 bg-slate-50/50"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="confirm" className="text-sm font-bold text-slate-900">Confirm new password</Label>
            <Input 
              id="confirm"
              type="password"
              placeholder="••••••••"
              className="h-11 rounded-xl border-slate-200 shadow-sm focus-visible:ring-indigo-600 bg-slate-50/50"
            />
          </div>

          <Button type="button" className="bg-[#5851E5] hover:bg-[#4F46E5] text-white h-11 px-6 rounded-xl font-bold shadow-sm">
            Update password
          </Button>
        </form>
      </div>

      {/* 2FA Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Two-factor authentication</h2>
        <p className="text-sm text-slate-500 mb-6">Add an extra layer of security to your account.</p>
        
        <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50 shadow-sm">
          <Shield className="w-4 h-4 mr-2 text-indigo-600" />
          Enable 2FA
        </Button>
      </div>
    </div>
  );
}
