"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Palette, 
  Globe, 
  CreditCard, 
  Users, 
  Shield, 
  Bell 
} from "lucide-react";

export function SettingsNav() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "white-labeling";

  const navItems = [
    { id: "white-labeling", label: "White-labeling", icon: Palette },
    { id: "client-portal", label: "Client Portal", icon: Globe },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "team", label: "Team", icon: Users },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => {
        const isActive = currentTab === item.id;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.id}
            href={`/settings?tab=${item.id}`}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              isActive 
                ? "bg-indigo-50 text-indigo-700" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
