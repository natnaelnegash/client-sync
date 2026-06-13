"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TabTeam() {
  const team = [
    { initials: "AL", name: "Alex Lawson", email: "alex@northlightstudio.co", role: "Owner", color: "bg-indigo-500" },
    { initials: "MT", name: "Mei Torres", email: "mei@northlightstudio.co", role: "Admin", color: "bg-pink-500" },
    { initials: "OB", name: "Omar Bello", email: "omar@northlightstudio.co", role: "Member", color: "bg-emerald-500" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Team members</h2>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-5 rounded-xl font-bold shadow-sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Invite
          </Button>
        </div>
        
        {/* List */}
        <div className="divide-y divide-slate-100 p-2">
          {team.map((member) => (
            <div key={member.email} className="flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50/50 rounded-xl transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm ${member.color}`}>
                  {member.initials}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{member.name}</p>
                  <p className="text-sm text-slate-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <select 
                  defaultValue={member.role}
                  disabled={member.role === "Owner"}
                  className="h-9 pl-3 pr-8 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2020%2020%20%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%221.66667%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                  <option value="Member">Member</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
