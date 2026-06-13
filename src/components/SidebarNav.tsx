"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Folder, 
  Users, 
  Receipt, 
  Settings 
} from "lucide-react";

export function SidebarNav() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: Folder },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Invoices", href: "/invoices", icon: Receipt },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
        const Icon = link.icon;
        
        return (
          <Link 
            key={link.name} 
            href={link.href} 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
              isActive 
                ? "bg-indigo-50 text-indigo-700" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon className="w-5 h-5" />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
