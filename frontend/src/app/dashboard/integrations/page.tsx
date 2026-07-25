"use client";

import { Link as LinkIcon, Key, Webhook, Shield, Plus, Copy, Check, EyeOff, Eye, RefreshCw, Power } from "lucide-react";
import { useState, useEffect } from "react";
import CreateIntegrationModal, { IntegrationType } from "@/components/integrations/CreateIntegrationModal";
import { createClient } from "@/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<IntegrationType>("oidc");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState<string | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data state
  const [oidcClients, setOidcClients] = useState<any[]>([]);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const [oidcRes, webhookRes] = await Promise.all([
        supabase.from("oidc_clients").select("*").order("created_at", { ascending: false }),
        supabase.from("webhooks").select("*").order("created_at", { ascending: false })
      ]);
      if (oidcRes.data) setOidcClients(oidcRes.data);
      if (webhookRes.data) setWebhooks(webhookRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSuccess = (newData: any, type: string) => {
    if (type === "oidc") {
      setOidcClients([newData, ...oidcClients]);
    } else if (type === "webhooks") {
      setWebhooks([newData, ...webhooks]);
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    if (!dateStr) return "-";
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: localeId });
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
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium shadow-lg shadow-pink-500/20 transition-all text-sm"
        >
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
        {loading ? (
          <div className="text-center p-12 text-slate-400 animate-pulse">Memuat data...</div>
        ) : (
          <>
            {/* OIDC TAB */}
            {activeTab === "oidc" && (
              <div className="space-y-4">
                {oidcClients.length === 0 && (
                  <div className="text-center p-8 border border-dashed border-white/10 rounded-2xl text-slate-400">Belum ada OIDC Client</div>
                )}
                {oidcClients.map((client) => (
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
                            <code className="px-2 py-1 bg-slate-900 rounded text-sm text-[#56CCF2] font-mono border border-white/5">{client.client_id}</code>
                            <button onClick={() => handleCopy(client.client_id, `id_${client.id}`)} className="p-1.5 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-md">
                              {copiedId === `id_${client.id}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-slate-400 mb-1">Client Secret</p>
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 bg-slate-900 rounded text-sm text-pink-400 font-mono border border-white/5 flex items-center min-w-[200px]">
                              {showSecret === client.id ? client.client_secret : "••••••••••••••••••••"}
                            </code>
                            <button onClick={() => setShowSecret(showSecret === client.id ? null : client.id)} className="p-1.5 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-md">
                              {showSecret === client.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button onClick={() => handleCopy(client.client_secret, `sec_${client.id}`)} className="p-1.5 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-md">
                              {copiedId === `sec_${client.id}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-slate-400 mb-1">Redirect URIs</p>
                          <p className="text-sm text-slate-300">{client.redirect_uri}</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-48 flex flex-col justify-between items-start md:items-end gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-slate-500">Dibuat</p>
                        <p className="text-sm font-medium text-slate-300 mt-0.5">{formatRelativeTime(client.created_at)}</p>
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
                {webhooks.length === 0 && (
                  <div className="col-span-1 lg:col-span-2 text-center p-8 border border-dashed border-white/10 rounded-2xl text-slate-400">Belum ada Webhook</div>
                )}
                {webhooks.map((wh) => (
                  <div key={wh.id} className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{wh.name}</h3>
                          <p className="text-xs text-slate-400 mt-1 font-mono break-all">{wh.url}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex-shrink-0 ${
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
                          {wh.events.map((ev: string) => (
                            <span key={ev} className="px-2 py-1 bg-slate-800 rounded text-xs text-[#FFDA00] font-mono border border-white/5">{ev}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-auto">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Dibuat</p>
                        <p className="text-xs font-medium text-slate-300 mt-0.5">{formatRelativeTime(wh.created_at)}</p>
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
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-[#FFDA00] hover:bg-[#FFDA00]/90 text-[#071A3D] font-semibold transition-all shadow-lg shadow-[#FFDA00]/20"
                >
                  Lihat Info Master Key
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <CreateIntegrationModal 
        type={activeTab} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleCreateSuccess} 
      />
    </div>
  );
}
