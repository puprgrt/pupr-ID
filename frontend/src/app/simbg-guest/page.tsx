"use client";

import { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  KeyRound, 
  Building2, 
  ArrowRight,
  ShieldAlert,
  Loader2,
  Mail
} from "lucide-react";

export default function SimbgGuestBridge() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  // Fallback kredensial jika Environment Variable belum diset
  const guestEmail = process.env.NEXT_PUBLIC_SIMBG_GUEST_EMAIL || "guest_garut@pu.go.id";
  const guestPassword = process.env.NEXT_PUBLIC_SIMBG_GUEST_PASSWORD || "PUPRGarut!123";
  const simbgUrl = "https://simbg.pu.go.id/";

  useEffect(() => {
    // Simulasi inisialisasi yang memberi kesan premium/aman
    const timer = setTimeout(() => {
      setStatus("ready");
      // Coba Auto-Copy (Beberapa browser butuh interaksi klik, jadi kita siapkan fallback)
      navigator.clipboard.writeText(guestPassword).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 5000);
      }).catch(() => {
        // Abaikan jika browser menahan auto-copy tanpa gesture
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [guestPassword]);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(guestPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#020813] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Dekorasi Background Premium */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1E5EFF]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFDA00]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Header Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
            <div className="bg-[#0A1628] border border-white/10 p-4 rounded-2xl relative shadow-2xl">
              <Building2 className="w-10 h-10 text-[#FFDA00]" />
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2 font-poppins">Integrasi SIMBG</h1>
          <p className="text-sm text-slate-400">
            Anda dialihkan ke portal SIMBG Nasional menggunakan <span className="text-[#56CCF2] font-semibold">Akun Guest DPUPR Garut</span>.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#0A1628]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          
          {status === "loading" ? (
             <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <Loader2 className="w-8 h-8 text-[#1E5EFF] animate-spin" />
                <p className="text-sm text-slate-400 font-medium animate-pulse">Menyiapkan Sesi Aman...</p>
             </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              
              {/* Alert Info */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-200/80 leading-relaxed">
                  Sistem keamanan SIMBG Nasional memerlukan pengisian formulir manual. Kami telah menyiapkan kredensial untuk Anda.
                </div>
              </div>

              {/* Credentials Box */}
              <div className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email Guest</label>
                  <div className="flex items-center gap-3 p-3.5 bg-[#050B14] rounded-xl border border-white/5">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-200 font-medium truncate">{guestEmail}</span>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Kata Sandi</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-3 p-3.5 bg-[#050B14] rounded-xl border border-white/5">
                      <KeyRound className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-200 font-mono tracking-widest">••••••••••</span>
                    </div>
                    <button 
                      onClick={handleCopyPassword}
                      className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-center shrink-0 ${
                        copied 
                          ? "bg-green-500/20 border-green-500/30 text-green-400" 
                          : "bg-[#1E5EFF]/20 border-[#1E5EFF]/30 text-[#1E5EFF] hover:bg-[#1E5EFF]/30"
                      }`}
                      title="Salin Kata Sandi"
                    >
                      {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  {/* Status Helper */}
                  <div className="h-4 px-1">
                    {copied && (
                      <p className="text-[10px] text-green-400 font-medium animate-in fade-in slide-in-from-left-2">
                        ✓ Kata sandi berhasil disalin ke clipboard!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <a 
                  href={simbgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-r from-[#1E5EFF] to-[#0047FF] hover:opacity-90 text-white font-bold text-sm shadow-[0_0_20px_rgba(30,94,255,0.3)] transition-all hover:shadow-[0_0_25px_rgba(30,94,255,0.5)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  Buka Portal SIMBG Nasional
                  <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
                </a>
                <p className="text-[10px] text-center text-slate-500 mt-4">
                  Tempelkan (Paste) kata sandi di halaman SIMBG yang terbuka.
                </p>
              </div>

            </div>
          )}
        </div>
        
        {/* Footer Link */}
        <div className="mt-8 text-center">
          <a href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors">
            Kembali ke Dashboard SSO <ArrowRight className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
}
