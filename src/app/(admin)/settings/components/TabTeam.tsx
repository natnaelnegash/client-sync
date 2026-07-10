"use client";

import { ExternalLink, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { inviteMember, updateMemberRole, removeMember } from "@/app/actions/team";
import { Input } from "@/components/ui/input";

export function TabTeam({ team = [], owner }: { team?: any[], owner?: any }) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Combine owner and team members
  const allMembers = [
    {
      id: owner?.id,
      initials: owner?.name?.substring(0, 2).toUpperCase() || "OW",
      name: owner?.name || "Workspace Owner",
      email: owner?.email,
      role: "Owner",
      color: "bg-indigo-500",
      status: "Active"
    },
    ...team.map(m => ({
      id: m.id,
      initials: m.email.substring(0, 2).toUpperCase(),
      name: m.email.split("@")[0],
      email: m.email,
      role: m.role,
      color: "bg-slate-500",
      status: m.status
    }))
  ];

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await inviteMember(formData);
      setIsInviteOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to invite member");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId: string, role: string) => {
    try {
      await updateMemberRole(memberId, role);
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await removeMember(memberId);
    } catch (err) {
      alert("Failed to remove member");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Team members</h2>
          <Button onClick={() => setIsInviteOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-5 rounded-xl font-bold shadow-sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Invite
          </Button>
        </div>
        
        {/* List */}
        <div className="divide-y divide-slate-100 p-2">
          {allMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50/50 rounded-xl transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm ${member.color}`}>
                  {member.initials}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    {member.name}
                    {member.status === "Pending" && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] uppercase font-bold tracking-wider">
                        Pending
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-slate-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <select 
                  defaultValue={member.role}
                  onChange={(e) => handleRoleChange(member.id, e.target.value)}
                  disabled={member.role === "Owner"}
                  className="h-9 pl-3 pr-8 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2020%2020%20%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%221.66667%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                  <option value="Member">Member</option>
                </select>
                
                {member.role !== "Owner" && (
                  <button onClick={() => handleRemove(member.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Invite Team Member</h2>
              <button onClick={() => setIsInviteOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Email Address</label>
                <Input name="email" type="email" placeholder="colleague@agency.com" required className="h-10 rounded-lg" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Role</label>
                <select name="role" defaultValue="Member" className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white">
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Member">Member (View Only)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsInviteOpen(false)} className="h-10 px-4 text-sm font-bold">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-6 rounded-xl font-bold">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Send Invite"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
