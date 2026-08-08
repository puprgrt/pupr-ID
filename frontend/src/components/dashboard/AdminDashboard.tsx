"use client";

import { useState, useEffect } from "react";
import { Users, Globe, LogIn, Activity, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle, AlertTriangle, MoreVertical, Copy, Link } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { createClient } from "@/utils/supabase/client";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOidc: 0,
    totalWebhooks: 0,
  });
  
  const [bentoApps, setBentoApps] = useState<any[]>([]);
  const [appUsageData, setAppUsageData] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const realmUrl = "https://sso.pupr.garutkab.go.id/realms/pupr-id";

  const handleCopyRealm = () => {
    navigator.clipboard.writeText(realmUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      
      // Fetch stats
      const [
        { count: userCount },
        { data: oidcApps, count: oidcCount },
        { count: webhookCount },
        { data: profiles }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('oidc_clients').select('*', { count: 'exact' }).order('created_at', { ascending: false }),
        supabase.from('webhooks').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('id, full_name, email, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.auth.getSession()
      ]);

      setStats({
        totalUsers: userCount || 0,
        totalOidc: oidcCount || 0,
        totalWebhooks: webhookCount || 0,
      });

      // Format OIDC Apps for Bento Launcher
      if (oidcApps && oidcApps.length > 0) {
        const apps = oidcApps.map((app: any, idx: number) => {
          let targetUrl = app.app_url || app.redirect_uri || "#";
          if (targetUrl !== "#" && session?.access_token) {
            targetUrl = `${targetUrl}#sso_token=${session.access_token}`;
          }
          return {
            name: app.name,
            desc: `Redirect: ${app.redirect_uri}`,
            app_url: targetUrl,
            users: app.status === 'active' ? "Active" : "Inactive",
            icon: idx % 2 === 0 ? "🏢" : "🌐",
            colSpan: idx % 3 === 0 ? "md:col-span-2" : "md:col-span-1"
          };
        });
        setBentoApps(apps);

        // Map to Pie Chart
        const colors = ['#1E5EFF', '#FFDA00', '#00C853', '#7B61FF', '#FF4D6D'];
        setAppUsageData(oidcApps.map((app: any, idx: number) => ({
          name: app.name,
          value: 100 / oidcApps.length, // Simulate equal distribution for now
          color: colors[idx % colors.length]
        })));
      }

      // Format recent profiles as activities
      if (profiles) {
        const mappedActivities = profiles.map((p: any, idx: number) => ({
          id: p.id,
          user: p.full_name || p.email.split('@')[0],
          action: "Mendaftar ke dalam sistem",
          time: new Date(p.created_at).toLocaleDateString('id-ID'),
          type: "success"
        }));
        setActivities(mappedActivities);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const kpiData = [
    { title: "Total Pengguna", value: stats.totalUsers.toString(), trend: "Realtime", trendUp: true, icon: Users, color: "text-[#56CCF2]" },
    { title: "Klien OIDC Aktif", value: stats.totalOidc.toString(), trend: "Realtime", trendUp: true, icon: Globe, color: "text-[#17C3B2]" },
    { title: "Webhooks Terdaftar", value: stats.totalWebhooks.toString(), trend: "Realtime", trendUp: true, icon: Activity, color: "text-[#FFDA00]" },
    { title: "Status Sistem", value: "Aman", trend: "Normal", trendUp: true, icon: CheckCircle2, color: "text-[#00C853]" },
  ];

  const emptyChartData = [
    { time: "08:00", success: 0, failed: 0 },
    { time: "12:00", success: 0, failed: 0 },
    { time: "16:00", success: 0, failed: 0 },
    { time: "20:00", success: 0, failed: 0 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400 animate-pulse">
        Menyiapkan Dashboard dengan data real...
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* SSO Realm Configuration Card */}
      <div className="glass-panel p-5 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-[#1E5EFF]/10 to-transparent relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="p-3 bg-[#1E5EFF]/20 rounded-xl border border-[#1E5EFF]/30 text-[#1E5EFF]">
            <Link className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-poppins text-white">SSO Realm URL (Issuer Endpoint)</h2>
            <p className="text-sm text-slate-400 mt-1">Gunakan URL ini sebagai konfigurasi Issuer pada aplikasi klien OIDC (SIMBG, SIJENANG, dll).</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto bg-[#071A3D] p-1.5 rounded-lg border border-white/10 z-10">
          <div className="px-3 py-2 bg-[#0A2558] rounded-md border border-white/5 w-full md:w-[320px] overflow-hidden">
            <p className="text-sm font-mono text-[#56CCF2] truncate">{realmUrl}</p>
          </div>
          <button 
            onClick={handleCopyRealm}
            className="p-2.5 bg-[#1E5EFF] hover:bg-[#1E5EFF]/80 text-white rounded-md transition-all flex items-center justify-center min-w-[44px]"
            title="Salin URL"
          >
            {isCopied ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        
        {/* Dekorasi Background */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#1E5EFF]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* KPI Sparkline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => (
          <div key={idx} className="glass-card p-5 relative overflow-hidden group flex flex-col justify-between h-32 border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-slate-300">{kpi.title}</h3>
                <p className="text-2xl font-bold text-white mt-1">{kpi.value}</p>
              </div>
              <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
            
            <div className="flex items-center gap-1 mt-4">
              {kpi.trendUp ? (
                <ArrowUpRight className="w-4 h-4 text-[#00C853]" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-[#FF4D6D]" />
              )}
              <span className={`text-xs font-semibold ${kpi.trendUp ? 'text-[#00C853]' : 'text-[#FF4D6D]'}`}>
                {kpi.trend}
              </span>
              <span className="text-xs text-slate-400 ml-1">Live Database</span>
            </div>

            {/* Decorative background blur */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/5 blur-xl group-hover:bg-white/10 transition-colors"></div>
          </div>
        ))}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Charts Section */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          {/* Dual Line Chart */}
          <div className="glass-panel p-6 h-[400px] flex flex-col border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-poppins font-semibold text-white">Aktivitas Auth Flow</h3>
                <p className="text-xs text-slate-400 mt-1">Data log autentikasi riwayat login (Menunggu Implementasi Audit Table)</p>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 w-full min-h-0 relative">
              <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm bg-[#071A3D]/40 rounded-xl border border-dashed border-white/20">
                 <p className="text-slate-400 font-medium text-sm">Grafik Log Auth akan aktif setelah Audit Tabel dibuat</p>
              </div>
              <ResponsiveContainer width="100%" height="100%" className="opacity-30">
                <AreaChart data={emptyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12}} axisLine={false} tickLine={false} />
                  <Area type="monotone" name="Sukses" dataKey="success" stroke="#1E5EFF" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bento App Launcher */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bentoApps.length === 0 ? (
               <div className="col-span-3 p-8 text-center text-slate-400 border border-dashed border-white/20 rounded-2xl glass-card">
                 Belum ada aplikasi SSO (OIDC) yang didaftarkan.
               </div>
            ) : (
              bentoApps.map((app, idx) => (
                <a href={app.app_url} target="_blank" rel="noreferrer" key={idx} className={`glass-card p-5 group cursor-pointer flex flex-col justify-between border border-white/10 ${app.colSpan}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-3xl bg-white/5 p-3 rounded-2xl border border-white/10 group-hover:scale-110 group-hover:border-[#FFDA00]/50 transition-all duration-300 shadow-lg">
                      {app.icon}
                    </div>
                    <div className="flex items-center gap-1.5 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-[10px] font-medium text-green-400">{app.users}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-white text-lg group-hover:text-[#FFDA00] transition-colors">{app.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{app.desc}</p>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar Area (Timeline & Donut) */}
        <div className="space-y-6">
          
          {/* Donut Chart: App Distribution */}
          <div className="glass-panel p-6 border border-white/10">
            <h3 className="text-base font-poppins font-semibold text-white mb-2">Klien Terdaftar</h3>
            
            {appUsageData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-slate-500 text-sm">Tidak ada data Klien</div>
            ) : (
              <>
                <div className="h-48 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={appUsageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {appUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-white">{stats.totalOidc}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Aplikasi</span>
                  </div>
                </div>
                {/* Legend */}
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {appUsageData.slice(0, 4).map((app, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: app.color }}></div>
                      <span className="text-xs text-slate-300 truncate">{app.name}</span>
                    </div>
                  ))}
                  {appUsageData.length > 4 && (
                     <div className="text-xs text-slate-500 mt-1 text-center">+{appUsageData.length - 4} lainnya</div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="glass-panel p-6 flex-1 flex flex-col border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-poppins font-semibold text-white">Pengguna Terbaru</h3>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            
            <div className="space-y-5 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-white/10 before:to-transparent">
              {activities.length === 0 ? (
                <div className="text-sm text-slate-500 text-center relative z-10 py-4 bg-[#071A3D]">Belum ada aktivitas</div>
              ) : activities.map((act) => (
                <div key={act.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline dot */}
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#071A3D] bg-[#071A3D] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 
                    ${act.type === 'success' ? 'text-[#00C853]' : act.type === 'error' ? 'text-[#FF4D6D]' : act.type === 'warning' ? 'text-[#FFB300]' : 'text-[#56CCF2]'}`}>
                    {act.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                     act.type === 'error' ? <XCircle className="w-3.5 h-3.5" /> : 
                     act.type === 'warning' ? <AlertTriangle className="w-3 h-3" /> : 
                     <div className="w-2 h-2 rounded-full bg-current"></div>}
                  </div>
                  
                  {/* Content Card */}
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl glass-card border border-white/5 shadow-sm group-hover:-translate-y-1 transition-transform">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">{act.user}</span>
                      <span className="text-[10px] text-slate-400">{act.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{act.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
