"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, ChevronRight, ChevronDown, MoreHorizontal, Mail, Phone, Building2, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CreateProjectModal } from "../dashboard/components/CreateProjectModal";
import { CreateClientModal } from "./components/CreateClientModal";

export type ClientData = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  projectsCount: number;
  totalValue: number;
  lastProjectSlug: string | null;
  lastProjectName: string | null;
};

export function ClientListUI({ clients }: { clients: ClientData[] }) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(clients.length > 0 ? clients[0].id : null);

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Clients</h1>
          <p className="text-sm text-slate-500">{clients.length} contacts</p>
        </div>
        <CreateClientModal />
      </div>

      {/* Toolbar */}
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input 
          placeholder="Search clients..." 
          className="pl-9 h-11 bg-white border-slate-200 focus-visible:ring-indigo-600 rounded-lg text-sm w-full shadow-sm"
        />
      </div>

      <div className="flex gap-6 items-start">
        {/* Clients List */}
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${selectedClientId ? 'w-[60%] xl:w-[65%]' : 'w-full'}`}>
          {clients.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No clients found. Start by creating a project!
            </div>
          )}
          {clients.map((client, index) => {
            const isSelected = selectedClientId === client.id;
            const initials = client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const valueFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(client.totalValue / 100);
            
            return (
              <button 
                key={client.id} 
                onClick={() => setSelectedClientId(isSelected ? null : client.id)}
                className={`flex items-center justify-between p-4 sm:px-6 sm:py-5 transition-colors text-left relative ${
                  index !== clients.length - 1 ? 'border-b border-slate-100' : ''
                } ${isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
              >
                {/* Active Indicator Line */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />
                )}

                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm bg-sky-500`}>
                    {initials}
                  </div>
                  <div>
                    <p className={`font-bold ${isSelected ? 'text-indigo-950' : 'text-slate-900'}`}>{client.name}</p>
                    <p className={`text-sm mt-0.5 ${isSelected ? 'text-indigo-700/70' : 'text-slate-500'}`}>
                      {client.company || 'No Company'} · {client.email || 'No email'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-8">
                  <div className="hidden sm:block text-right">
                    <p className={`font-bold ${isSelected ? 'text-indigo-950' : 'text-slate-900'}`}>{valueFormatted}</p>
                    <p className={`text-sm mt-0.5 ${isSelected ? 'text-indigo-700/70' : 'text-slate-500'}`}>
                      {client.projectsCount} {client.projectsCount === 1 ? 'project' : 'projects'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700`}>
                      Active
                    </span>
                    {isSelected ? (
                      <ChevronDown className="w-5 h-5 text-indigo-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right Detail Panel */}
        {selectedClient && (
          <div className="w-[40%] xl:w-[35%] bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24 shrink-0">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm bg-sky-500`}>
                {selectedClient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 rounded-full">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">{selectedClient.name}</h2>
              <p className="text-slate-500 mt-1">{selectedClient.company || 'No company'}</p>
            </div>

            <hr className="my-6 border-slate-100" />

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-600">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-sm font-medium">{selectedClient.email || '—'}</span>
              </div>
              
              <div className="flex items-center gap-4 text-slate-600">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-sm font-medium">{selectedClient.phone || '—'}</span>
              </div>

              <div className="flex items-center gap-4 text-slate-600">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-sm font-medium">{selectedClient.company || '—'}</span>
              </div>
            </div>

            <hr className="my-6 border-slate-100" />

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Total value</p>
                  <p className="text-lg font-bold text-slate-900">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(selectedClient.totalValue / 100)}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Projects</p>
                  <p className="text-lg font-bold text-slate-900">{selectedClient.projectsCount}</p>
                </div>
              </div>
            </div>

            <hr className="my-6 border-slate-100" />

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Last Project</h3>
              {selectedClient.lastProjectSlug ? (
                <Link href={`/projects/${selectedClient.lastProjectSlug}`} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl border border-slate-100 mb-4 group">
                  <span className="font-medium text-slate-900 text-sm">{selectedClient.lastProjectName}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                </Link>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4 text-sm text-slate-500">
                  No projects yet.
                </div>
              )}
              
              <CreateProjectModal />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
