"use client";

import { Link as LinkIcon, Key, Webhook, Shield, Plus, Copy, Check, EyeOff, Eye, RefreshCw, Power } from "lucide-react";
import { useState } from "react";

// Mock Data
const OIDC_CLIENTS = [
  { id: "client_SIMBG", name: "SIMBG Pusat", clientId: "pupr_simbg_39x8a", status: "active", lastUsed: "2 menit lalu", redirectUri: "https://simbg.pupr.garut.id/auth/callback" },
  { id: "client_SIJENANG", name: "SIJENANG", clientId: "pupr_sijenang_88x2c", status: "active", lastUsed: "15 menit lalu", redirectUri: "https://sijenang.pupr.garut.id/sso/callback" },
  { id: "client_EKIN", name: "E-Kinerja Internal", clientId: "pupr_ekinerja_11x9p", status: "inactive", lastUsed: "3 hari lalu", redirectUri: "https://kinerja.pupr.garut.id/login" },
];

const WEBHOOKS = [
  { id: "wh_1", name: "Sync Profile SIMBG", url: "https://api.simbg.pupr.garut.id/webhook/sso-update", events: ["user.updated", "role.changed"], status: "active", lastFired: "10 menit lalu" },
  { id: "wh_2", name: "SIJENANG Role Alert", url: "https://sijenang.pupr.garut.id/api/v1/sso/alert", events: ["role.changed"], status: "failing", lastFired: "2 hari lalu" },
];

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<"oidc" | "webhooks" | "apikeys">("oidc");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 h-[calc(100vh-6rem)] flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-white flex items-center gap-3">
            <LinkIcon className="w-8 h-8 text-pink-500" />
            Integrations
          </h1>
          <p className="text-slate-400 mt-2">
            Kelola koneksi SSO (OIDC), *Webhooks*, dan *API Keys* untuk aplikasi eksternal PUPR-ID.
          </p>
        </div>
        
        <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium shadow-lg shadow-pink-500/20 transition-all text-sm">
          <Plus className="w-5 h-5" />
          <span>Buat {activeTab === "oidc" ? "OIDC Client" : activeTab === "webhooks" ? "Webhook" : "API Key"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 flex-shrink-0 overflow-x-auto custom-scrollbar">
        <button 
          onClick={() => setActiveTab("oidc")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === "oidc" ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <Shield className="w-4 h-4" /> OAuth 2.1 Clients (SSO)
        </button>
        <button 
          onClick={() => setActiveTab("webhooks")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === "webhooks" ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <Webhook className="w-4 h-4" /> Webhooks
        </button>
        <button 
          onClick={() => setActiveTab("apikeys")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === "apikeys" ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <Key className="w-4 h-4" /> Global API Keys
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
        
        {/* OIDC TAB */}
        {activeTab === "oidc" && (
          <div className="space-y-4">
            {OIDC_CLIENTS.map((client) => (
              <div key={client.id} className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-6">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">{client.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      client.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' 
                        : 'bg-slate-500/20 text-slate-400 border-slate-500/20'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-xs font-medium text-slate-400 mb-1">Client ID</p>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-slate-900 rounded text-sm text-[#56CCF2] font-mono border border-white/5">{client.clientId}</code>
                        <button onClick={() => handleCopy(client.clientId, `id_${client.id}`)} className="p-1.5 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-md">
                          {copiedId === `id_${client.id}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-slate-400 mb-1">Client Secret</p>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-slate-900 rounded text-sm text-pink-400 font-mono border border-white/5 flex items-center min-w-[200px]">
                          {showSecret === client.id ? "sk_live_x88d92ma0c..." : "••••••••••••••••••••"}
                        </code>
                        <button onClick={() => setShowSecret(showSecret === client.id ? null : client.id)} className="p-1.5 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-md">
                          {showSecret === client.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleCopy("sk_live_x88d92ma0c...", `sec_${client.id}`)} className="p-1.5 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-md">
                          {copiedId === `sec_${client.id}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400 mb-1">Redirect URIs</p>
                      <p className="text-sm text-slate-300">{client.redirectUri}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-48 flex flex-col justify-between items-start md:items-end gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-slate-500">Terakhir Digunakan</p>
                    <p className="text-sm font-medium text-slate-300 mt-0.5">{client.lastUsed}</p>
                  </div>
                  
                  <div className="flex gap-2 w-full md:justify-end">
                    <button className="flex-1 md:flex-none p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-2 tooltip" title="Regenerate Secret">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button className={`flex-1 md:flex-none p-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      client.status === 'active' ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400' : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
                    }`} title={client.status === 'active' ? 'Revoke Access' : 'Enable Access'}>
                      <Power className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* WEBHOOKS TAB */}
        {activeTab === "webhooks" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {WEBHOOKS.map((wh) => (
              <div key={wh.id} className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{wh.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 font-mono">{wh.url}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    wh.status === 'active' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/20'
                  }`}>
                    {wh.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-xs font-medium text-slate-400 mb-2">Triggers pada event:</p>
                  <div className="flex gap-2 flex-wrap">
                    {wh.events.map(ev => (
                      <span key={ev} className="px-2 py-1 bg-slate-800 rounded text-xs text-[#FFDA00] font-mono border border-white/5">{ev}</span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Terakhir Dipanggil</p>
                    <p className="text-xs font-medium text-slate-300 mt-0.5">{wh.lastFired}</p>
                  </div>
                  <button className="text-xs font-medium text-[#56CCF2] hover:text-white transition-colors">Test Ping</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* API KEYS TAB */}
        {activeTab === "apikeys" && (
          <div className="flex flex-col items-center justify-center text-center p-12 glass-panel border border-white/10 rounded-2xl h-full min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-[#FFDA00]/10 flex items-center justify-center mb-4">
              <Key className="w-8 h-8 text-[#FFDA00]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Global API Keys Belum Dikonfigurasi</h2>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Gunakan Global API Keys hanya untuk keperluan *System-to-System* (Backend) yang tidak mewakili pengguna tertentu (seperti *Cron Jobs* atau *Data Sync* eksternal).
            </p>
            <button className="mt-6 px-6 py-2.5 rounded-xl bg-[#FFDA00] hover:bg-[#FFDA00]/90 text-[#071A3D] font-semibold transition-all shadow-lg shadow-[#FFDA00]/20">
              Generate Master Key
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
