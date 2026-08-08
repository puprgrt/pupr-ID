import Link from "next/link";
import { 
  Home, 
  Grid, 
  Users, 
  Shield, 
  BarChart3, 
  Lock, 
  FileText, 
  Link as LinkIcon, 
  Bot, 
  Settings 
} from "lucide-react";

import { createClient } from "@/utils/supabase/server";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Grid, label: "Applications", href: "/dashboard/apps" },
  { icon: Users, label: "Users", href: "/dashboard/users" },
  { icon: Shield, label: "Roles", href: "/dashboard/roles" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Lock, label: "Security", href: "/dashboard/security" },
  { icon: FileText, label: "Audit Trail", href: "/dashboard/audit" },
  { icon: LinkIcon, label: "Integrations", href: "/dashboard/integrations" },
  { icon: Bot, label: "AI Assistant", href: "/dashboard/ai" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default async function Sidebar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const email = user?.email || "guest@pupr.garut.id";
  const role = user?.app_metadata?.role || "Guest";
  const name = email.split('@')[0];
  return (
    <aside className="w-72 h-[calc(100vh-2rem)] glass-panel m-4 flex flex-col p-4 transition-all duration-300">
      <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-white/10 pb-6">
        <div className="flex gap-1 items-center">
          <img src="/Lambang_Kabupaten_Garut.png" alt="Garut" className="w-8 h-8 object-contain drop-shadow-md" />
          <img src="/logo-puprID.png" alt="PUPR-ID" className="h-8 w-auto object-contain" />
        </div>
        <div className="ml-1">
          <p className="text-[10px] text-[#56CCF2] uppercase tracking-wider mt-1">Kabupaten Garut</p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:text-white hover:bg-white/10 hover:border hover:border-white/10 transition-all duration-200 group"
          >
            <item.icon className="w-5 h-5 group-hover:scale-110 group-hover:text-[#FFDA00] transition-transform duration-200" />
            <span className="font-medium text-sm group-hover:font-semibold">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border-2 border-[#FFDA00]">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`} alt="User Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate capitalize">{name}</p>
            <p className="text-xs text-[#FFDA00] truncate font-medium">{role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
