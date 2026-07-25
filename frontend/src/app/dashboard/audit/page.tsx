"use client";

import { FileText, Search, Filter, Download, AlertCircle, Info, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useState } from "react";

// Dummy data for Audit Trail
const MOCK_AUDIT_LOGS = [
  { id: "LOG-001", time: "Baru saja", user: "wahyudin@pupr.garut.id", action: "Role Updated", target: "budi.staf@pupr.garut.id", details: "Changed role from Guest to Staf", level: "info" },
  { id: "LOG-002", time: "5 menit lalu", user: "System", action: "Failed Login Attempt", target: "Unknown", details: "Invalid credentials from IP 114.120.x.x", level: "warning" },
  { id: "LOG-003", time: "15 menit lalu", user: "admin@pupr.garut.id", action: "App Added", target: "SIMBG", details: "Added SIMBG to SSO grid", level: "info" },
  { id: "LOG-004", time: "1 jam lalu", user: "System", action: "Brute Force Blocked", target: "Cloudflare Turnstile", details: "Blocked 5 requests from ASN 13322", level: "critical" },
  { id: "LOG-005", time: "2 jam lalu", user: "dinas@pupr.garut.id", action: "Login Success", target: "Dashboard", details: "Authenticated via Email/Password", level: "success" },
  { id: "LOG-006", time: "3 jam lalu", user: "admin@pupr.garut.id", action: "MFA Enforced", target: "All Staf", details: "Changed policy to require MFA for Staf", level: "info" },
  { id: "LOG-007", time: "Kemarin", user: "guest@pupr.garut.id", action: "Failed Login Attempt", target: "System", details: "Account locked out after 5 attempts", level: "critical" },
];

const LevelIcon = ({ level }: { level: string }) => {
  switch(level) {
    case 'info': return <Info className="w-4 h-4 text-blue-400" />;
    case 'warning': return <AlertCircle className="w-4 h-4 text-[#FFDA00]" />;
    case 'critical': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
    case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    default: return <Info className="w-4 h-4 text-slate-400" />;
  }
};

const LevelBadge = ({ level }: { level: string }) => {
  switch(level) {
    case 'info': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/20">Info</span>;
    case 'warning': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FFDA00]/20 text-[#FFDA00] border border-[#FFDA00]/20">Warning</span>;
    case 'critical': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/20">Critical</span>;
    case 'success': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">Success</span>;
    default: return null;
  }
}

export default function AuditTrailPage() {
  const [search, setSearch] = useState("");

  const filteredLogs = MOCK_AUDIT_LOGS.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) || 
    log.user.toLowerCase().includes(search.toLowerCase()) ||
    log.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 h-[calc(100vh-6rem)] flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-400" />
            Audit Trail
          </h1>
          <p className="text-slate-400 mt-2">
            Log aktivitas sistem komprehensif untuk transparansi dan kepatuhan (*compliance*).
          </p>
        </div>
        
        <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all text-sm">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="glass-panel rounded-2xl border border-white/10 flex-1 flex flex-col min-h-0 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/40">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari aktivitas, user, atau IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#56CCF2]/50"
            />
          </div>
          
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium border border-white/5 transition-all text-sm w-full sm:w-auto">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Level</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Waktu</th>
                <th className="px-6 py-4 font-semibold">Aktor / User</th>
                <th className="px-6 py-4 font-semibold">Aksi</th>
                <th className="px-6 py-4 font-semibold">Target / Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <LevelBadge level={log.level} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs">
                    {log.time}
                  </td>
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <LevelIcon level={log.level} />
                    </div>
                    {log.user}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-200">{log.action}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white text-xs font-medium">{log.target}</span>
                      <span className="text-slate-500 text-xs mt-0.5">{log.details}</span>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada log audit yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
