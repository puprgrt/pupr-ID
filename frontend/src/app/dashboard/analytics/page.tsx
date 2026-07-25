import { BarChart3, TrendingUp, Users, Activity, MonitorSmartphone, Globe } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-poppins font-bold text-white flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-[#FFDA00]" />
          Analytics Dashboard
        </h1>
        <p className="text-slate-400 mt-2">
          Pantauan metrik autentikasi, penggunaan aplikasi, dan aktivitas pengguna secara *real-time*.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#56CCF2]/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Login Hari Ini</p>
              <h3 className="text-3xl font-bold text-white mt-1">1,284</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#56CCF2]/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#56CCF2]" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm relative z-10">
            <span className="text-emerald-400 flex items-center font-medium"><TrendingUp className="w-4 h-4 mr-1" /> +12.5%</span>
            <span className="text-slate-500">vs kemarin</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFDA00]/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-400">Pengguna Aktif (MAU)</p>
              <h3 className="text-3xl font-bold text-white mt-1">8,450</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FFDA00]/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#FFDA00]" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm relative z-10">
            <span className="text-emerald-400 flex items-center font-medium"><TrendingUp className="w-4 h-4 mr-1" /> +5.2%</span>
            <span className="text-slate-500">bulan ini</span>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-400">Tingkat Adopsi MFA</p>
              <h3 className="text-3xl font-bold text-white mt-1">68.2%</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <MonitorSmartphone className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm relative z-10">
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '68.2%' }}></div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-400">Tingkat Keberhasilan</p>
              <h3 className="text-3xl font-bold text-white mt-1">99.8%</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Globe className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm relative z-10">
            <span className="text-slate-400">Autentikasi Lancar</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CSS Chart: Traffic Mingguan */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-6">Aktivitas Login (7 Hari Terakhir)</h3>
          
          <div className="h-64 flex items-end gap-2 sm:gap-6 pt-4 pb-2">
            {/* Dummy Bar Chart data */}
            {[
              { day: 'Sen', val: 65, num: 1200 },
              { day: 'Sel', val: 78, num: 1450 },
              { day: 'Rab', val: 82, num: 1520 },
              { day: 'Kam', val: 95, num: 1800 },
              { day: 'Jum', val: 88, num: 1650 },
              { day: 'Sab', val: 35, num: 600 },
              { day: 'Min', val: 25, num: 450 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                <div className="w-full flex justify-center h-[calc(100%-2rem)] items-end pb-2 relative">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity pointer-events-none z-10 border border-white/10 shadow-xl">
                    {d.num} Login
                  </div>
                  
                  {/* Bar */}
                  <div 
                    className="w-full max-w-[3rem] bg-gradient-to-t from-[#56CCF2]/20 to-[#56CCF2] rounded-t-sm transition-all duration-500 relative overflow-hidden" 
                    style={{ height: `${d.val}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400 mt-2">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Applications */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-6">Aplikasi Terpopuler</h3>
          
          <div className="space-y-5">
            {[
              { name: 'SIMBG', users: 3420, percent: 85, color: 'bg-emerald-500' },
              { name: 'SIJENANG', users: 2150, percent: 65, color: 'bg-[#56CCF2]' },
              { name: 'E-Kinerja', users: 1890, percent: 55, color: 'bg-[#FFDA00]' },
              { name: 'Web GIS', users: 950, percent: 30, color: 'bg-purple-500' },
              { name: 'LAIKA', users: 450, percent: 15, color: 'bg-pink-500' },
            ].map((app, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-slate-300">{app.name}</span>
                  <span className="text-xs font-bold text-white">{app.users}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className={`${app.color} h-2 rounded-full`} style={{ width: `${app.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
