import { FileText, Map, Info, LogOut, ExternalLink, ShieldAlert, Globe } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Application {
  id: string;
  name: string;
  description: string;
  app_url?: string;
  icon_url?: string;
}

export default function GuestDashboard() {
  const router = useRouter();
  const [publicApps, setPublicApps] = useState<Application[]>([]);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('category', 'Layanan Publik')
        .eq('status', 'online')
        .order('created_at', { ascending: true });

      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (!error && data) {
        setPublicApps(data);
      }
      setIsLoading(false);
    };

    fetchApps();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#123B7A] to-[#071A3D] p-8 md:p-12 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+CjxwYXRoIGQ9Ik0wIDBoODB2ODBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgNDBjMjAgMCAyMC00MCA0MC00MHMyMCA0MCA0MCA0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==')] opacity-50 pointer-events-none"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#56CCF2]/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-4">
              Selamat Datang di <span className="text-[#FFDA00]">PUPR-ID</span>
            </h2>
            <p className="text-slate-300 leading-relaxed text-lg">
              Portal Layanan Terpadu Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Garut. Silakan pilih layanan publik yang tersedia di bawah ini.
            </p>
          </div>
          
          <div className="shrink-0">
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Keluar (Sign Out)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role Notice */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FFB300]/10 border border-[#FFB300]/20">
        <ShieldAlert className="w-6 h-6 text-[#FFB300] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[#FFB300] font-semibold">Akses Terbatas (Guest)</h4>
          <p className="text-sm text-[#FFB300]/80 mt-1">
            Akun Anda saat ini memiliki peran sebagai <strong>Guest</strong>. Anda hanya dapat mengakses aplikasi dan informasi yang bersifat publik. 
            Jika Anda adalah staf DPUPR yang membutuhkan akses internal (seperti SIMBG, SIJENANG), silakan hubungi Administrator sistem untuk eskalasi hak akses Anda.
          </p>
        </div>
      </div>

      {/* Public Apps Grid */}
      <div>
        <h3 className="text-xl font-poppins font-semibold text-white mb-6">Layanan Publik</h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-[#56CCF2]/30 border-t-[#56CCF2] rounded-full animate-spin"></div>
          </div>
        ) : publicApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {publicApps.map((app) => {
              let targetUrl = app.app_url || "#";
              
              // Cek jika ini adalah aplikasi SIMBG (Intersep ke halaman Bridge Guest)
              const isSimbg = (app.name?.toLowerCase().includes('simbg')) || 
                              (app.app_url?.toLowerCase().includes('simbg'));

              if (isSimbg) {
                 targetUrl = "/simbg-guest";
              } else if (targetUrl !== "#" && session?.access_token) {
                const separator = targetUrl.includes('?') ? '&' : '?';
                targetUrl = `${targetUrl}${separator}sso_token=${session.access_token}`;
              }
              return (
              <a href={targetUrl} target={app.app_url ? "_blank" : "_self"} rel="noreferrer" key={app.id} className="block group">
                <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 h-full flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#1E5EFF]/10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300 flex items-center justify-center overflow-hidden">
                      {app.icon_url ? (
                        <img src={app.icon_url} alt={app.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <Globe className="w-7 h-7 text-[#56CCF2]" />
                      )}
                    </div>
                    <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="mt-auto">
                    <h4 className="font-poppins font-bold text-lg text-white group-hover:text-[#56CCF2] transition-colors mb-2">{app.name}</h4>
                    <p className="text-sm text-slate-400 line-clamp-2">{app.description}</p>
                  </div>
                </div>
              </a>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center glass-panel rounded-2xl">
            <p className="text-slate-400">Belum ada layanan publik yang online saat ini.</p>
          </div>
        )}
      </div>

    </div>
  );
}
