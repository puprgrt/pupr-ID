"use client";

import { Shield, ShieldCheck, Key, MapPin, Globe, AlertTriangle, Fingerprint, Lock } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-poppins font-bold text-white flex items-center gap-3">
          <Shield className="w-8 h-8 text-emerald-400" />
          Security Center
        </h1>
        <p className="text-slate-400 mt-2">
          Pusat kendali keamanan Zero Trust, verifikasi identitas, dan manajemen otentikasi.
        </p>
      </div>

      {/* Security Posture */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden bg-gradient-to-r from-emerald-900/40 to-slate-900/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          
          <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-800" />
              <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray="351.8" strokeDashoffset="42.2" className="text-emerald-400" strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">88<span className="text-lg text-emerald-400">%</span></span>
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Security Posture: <span className="text-emerald-400">Excellent</span>
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </h2>
            <p className="text-slate-300 mt-2 max-w-2xl">
              Sebagian besar konfigurasi keamanan Anda telah memenuhi standar Zero Trust. Namun, masih ada beberapa rekomendasi yang perlu Anda perhatikan terkait adopsi MFA di tingkat Staf.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">OIDC Enabled</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">PKCE Enforced</span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">Turnstile Active</span>
              <span className="px-3 py-1 rounded-full bg-[#FFDA00]/20 text-[#FFDA00] text-xs font-semibold border border-[#FFDA00]/30">MFA Warning</span>
            </div>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* MFA Settings */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Fingerprint className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Multi-Factor Auth (MFA)</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-white/5">
              <div>
                <p className="font-medium text-white text-sm">Super Admin & Admin</p>
                <p className="text-xs text-slate-400 mt-0.5">Wajib menggunakan Google Authenticator</p>
              </div>
              <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30">Enforced</div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-white/5">
              <div>
                <p className="font-medium text-white text-sm">Kepala Dinas & Kabid</p>
                <p className="text-xs text-slate-400 mt-0.5">Wajib menggunakan MFA</p>
              </div>
              <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30">Enforced</div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-white/5">
              <div>
                <p className="font-medium text-white text-sm">Operator, Staf, & Lainnya</p>
                <p className="text-xs text-slate-400 mt-0.5">MFA Opsional (Direkomendasikan)</p>
              </div>
              <div className="px-3 py-1 bg-[#FFDA00]/20 text-[#FFDA00] text-xs font-bold rounded-lg border border-[#FFDA00]/30">Optional</div>
            </div>
          </div>
          
          <button className="w-full mt-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors text-sm">
            Konfigurasi Kebijakan MFA
          </button>
        </div>

        {/* Protection & Threat */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-rose-500/20">
              <Lock className="w-5 h-5 text-rose-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Threat Protection</h3>
          </div>
          
          <div className="space-y-4">
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">Geo-Fencing (IP Filtering)</h4>
                <p className="text-xs text-slate-400 mt-1">Akses root/admin dibatasi hanya dari IP Jaringan Pemerintah Kabupaten Garut.</p>
                <div className="mt-2 text-xs font-mono text-emerald-400 bg-emerald-950/50 inline-block px-2 py-1 rounded border border-emerald-500/20">
                  Allowed: 103.144.xxx.xxx/24
                </div>
              </div>
            </div>
            <hr className="border-white/5" />
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#FFDA00]" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">Brute Force Protection</h4>
                <p className="text-xs text-slate-400 mt-1">Terdapat 14 percobaan login gagal dalam 1 jam terakhir. Cloudflare Turnstile telah memblokir 12 IP mencurigakan.</p>
              </div>
            </div>
            
          </div>
          
          <button className="w-full mt-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors text-sm">
            Lihat Log Keamanan
          </button>
        </div>
        
      </div>
    </div>
  );
}
