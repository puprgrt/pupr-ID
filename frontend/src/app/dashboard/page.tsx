"use client";

import { useState, useEffect } from "react";
import { Users, Globe, LogIn, Activity, ShieldCheck, AlertTriangle, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle, MoreVertical } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// --- Dummy Data ---
const loginData = [
  { time: "08:00", success: 120, failed: 5 },
  { time: "10:00", success: 450, failed: 12 },
  { time: "12:00", success: 800, failed: 25 },
  { time: "14:00", success: 650, failed: 8 },
  { time: "16:00", success: 300, failed: 4 },
  { time: "18:00", success: 150, failed: 2 },
];

const appUsageData = [
  { name: 'SIMBG', value: 400, color: '#1E5EFF' },
  { name: 'SIJENANG', value: 300, color: '#FFDA00' },
  { name: 'LAIKA', value: 300, color: '#00C853' },
  { name: 'GIS', value: 200, color: '#7B61FF' },
];

const kpiData = [
  { title: "Total User", value: "12.548", trend: "+12%", trendUp: true, icon: Users, color: "text-[#56CCF2]" },
  { title: "Online Sekarang", value: "1.243", trend: "+5%", trendUp: true, icon: Globe, color: "text-[#17C3B2]" },
  { title: "Login Hari Ini", value: "4.210", trend: "-2%", trendUp: false, icon: LogIn, color: "text-[#7B61FF]" },
  { title: "Sistem Aktif", value: "18", trend: "Normal", trendUp: true, icon: Activity, color: "text-[#FFDA00]" },
];

const activities = [
  { id: 1, user: "Enjang W.", action: "Login berhasil", time: "Baru saja", type: "success" },
  { id: 2, user: "Sistem", action: "Blokir akses dari IP asing", time: "5 mnt lalu", type: "warning" },
  { id: 3, user: "Asep S.", action: "Mengakses SIMBG", time: "12 mnt lalu", type: "info" },
  { id: 4, user: "Siti F.", action: "Gagal login (Password salah)", time: "25 mnt lalu", type: "error" },
  { id: 5, user: "Budi T.", action: "Mengakses SIJENANG", time: "1 jam lalu", type: "info" },
];

const bentoApps = [
  { name: "SIMBG", desc: "Sistem Informasi Manajemen Bangunan Gedung", users: "412 Online", icon: "🏢", colSpan: "md:col-span-2" },
  { name: "SIJENANG", desc: "Sistem Jalan dan Jembatan", users: "128 Online", icon: "🛣️", colSpan: "md:col-span-1" },
  { name: "LAIKA", desc: "Layanan Adminduk", users: "89 Online", icon: "📄", colSpan: "md:col-span-1" },
  { name: "GIS", desc: "Geographic Info System", users: "45 Online", icon: "🗺️", colSpan: "md:col-span-2" },
];

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Selamat Datang");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setDateStr(new Date().toLocaleDateString('id-ID', options));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header Contextual */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-medium text-[#56CCF2] mb-1">{dateStr}</p>
          <h1 className="text-3xl font-poppins font-bold text-white leading-tight">
            {greeting}, <span className="text-[#FFDA00]">Enjang Wahyudin</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-md">
          <ShieldCheck className="w-5 h-5 text-[#00C853]" />
          <span className="text-sm font-medium text-white">Security Score: <span className="text-[#00C853] font-bold">98%</span></span>
        </div>
      </div>

      {/* KPI Sparkline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => (
          <div key={idx} className="glass-card p-5 relative overflow-hidden group flex flex-col justify-between h-32">
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
              <span className="text-xs text-slate-400 ml-1">vs periode lalu</span>
            </div>

            {/* Decorative background blur */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/5 blur-xl group-hover:bg-white/10 transition-colors"></div>
          </div>
        ))}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Charts Section (Takes up more space) */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          {/* Dual Line Chart */}
          <div className="glass-panel p-6 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-poppins font-semibold text-white">Aktivitas Login Harian</h3>
                <p className="text-xs text-slate-400 mt-1">Perbandingan login sukses dan ancaman/gagal</p>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={loginData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E5EFF" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#1E5EFF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF4D6D" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#FF4D6D" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(7, 26, 61, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(16px)', color: '#fff' }}
                    itemStyle={{ color: '#fff', fontWeight: 500 }}
                  />
                  <Area type="monotone" name="Sukses" dataKey="success" stroke="#1E5EFF" strokeWidth={3} fill="url(#colorSuccess)" />
                  <Area type="monotone" name="Gagal/Blokir" dataKey="failed" stroke="#FF4D6D" strokeWidth={2} strokeDasharray="4 4" fill="url(#colorFailed)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bento App Launcher */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bentoApps.map((app, idx) => (
              <div key={idx} className={`glass-card p-5 group cursor-pointer flex flex-col justify-between ${app.colSpan}`}>
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
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar Area (Timeline & Donut) */}
        <div className="space-y-6">
          
          {/* Donut Chart: App Distribution */}
          <div className="glass-panel p-6">
            <h3 className="text-base font-poppins font-semibold text-white mb-2">Distribusi Penggunaan</h3>
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
                <span className="text-2xl font-bold text-white">4</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Aplikasi</span>
              </div>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {appUsageData.map((app, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: app.color }}></div>
                  <span className="text-xs text-slate-300 truncate">{app.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="glass-panel p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-poppins font-semibold text-white">Live Activity</h3>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            
            <div className="space-y-5 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-white/10 before:to-transparent">
              {activities.map((act, i) => (
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
            
            <button className="w-full mt-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors border border-white/5">
              Lihat Semua Log
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
