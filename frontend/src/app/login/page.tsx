import Link from "next/link";
import { QrCode, Smartphone, Info, ShieldCheck, Map, Building2, HardHat, FileText, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-[#071A3D]">
      
      {/* ======================= */}
      {/* LEFT PANEL (Informative) */}
      {/* ======================= */}
      <div className="relative hidden lg:flex lg:w-7/12 flex-col justify-between p-12 overflow-hidden bg-[#123B7A]">
        {/* Background Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-60"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1624619934399-52e802a46698?q=80&w=2000&auto=format&fit=crop')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A3D] via-[#071A3D]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+CjxwYXRoIGQ9Ik0wIDBoODB2ODBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgNDBjMjAgMCAyMC00MCA0MC00MHMyMCA0MCA0MCA0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==')] opacity-40"></div>
        
        {/* Glowing Blobs for accent */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFDA00]/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#1E5EFF]/20 blur-[150px] rounded-full mix-blend-screen"></div>

        {/* Content Top */}
        <div className="relative z-10 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-[#FFDA00]" />
          <span className="text-white font-semibold text-lg tracking-wider">SMART GOVERNMENT UI</span>
        </div>

        {/* Content Middle */}
        <div className="relative z-10 max-w-2xl mt-20">
          <h1 className="text-5xl lg:text-6xl font-poppins font-bold text-white leading-tight mb-6">
            Satu Portal Integrasi<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFDA00] to-[#56CCF2]">
              Layanan Infrastruktur
            </span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-xl">
            Akses seluruh sistem informasi terpadu Dinas Pekerjaan Umum dan Penataan Ruang (DPUPR) Kabupaten Garut hanya dengan satu identitas digital.
          </p>
          
          {/* Ecosystem Showcase */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 rounded-2xl glass-card bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
              <Building2 className="w-8 h-8 text-[#56CCF2] mb-3" />
              <span className="text-xs font-semibold text-white">SIMBG</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl glass-card bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
              <Map className="w-8 h-8 text-[#00C853] mb-3" />
              <span className="text-xs font-semibold text-white">GIS Spatial</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl glass-card bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
              <HardHat className="w-8 h-8 text-[#FFDA00] mb-3" />
              <span className="text-xs font-semibold text-white">SIJENANG</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl glass-card bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
              <FileText className="w-8 h-8 text-[#7B61FF] mb-3" />
              <span className="text-xs font-semibold text-white">LAIKA</span>
            </div>
          </div>
        </div>

        {/* Content Bottom (System Status) */}
        <div className="relative z-10 mt-auto pt-20">
          <div className="p-5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl flex gap-4 items-start max-w-lg">
            <div className="mt-1">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
              </span>
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">System Status: All Services Operational</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">Layanan jaringan, server database, dan integrasi API dengan Dukcapil terpantau stabil dengan latensi rata-rata &lt;45ms. <span className="text-[#56CCF2] cursor-pointer">Lihat Status Detail</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================= */}
      {/* RIGHT PANEL (Login Form) */}
      {/* ======================= */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-6 sm:p-12 relative bg-[#071A3D]">
        
        {/* Subtle Background Elements on Right side */}
        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-[#123B7A]/30 to-transparent pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
          
          {/* Logos */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-white/10 rounded-full p-2.5 backdrop-blur-sm border border-white/10 shadow-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/23/Lambang_Kabupaten_Garut.png" alt="Logo Garut" className="w-full h-full object-contain" />
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-full p-2.5 backdrop-blur-sm border border-white/10 shadow-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Logo_PUPR.png" alt="Logo PUPR" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-poppins font-bold text-white tracking-wide">PUPR<span className="text-[#FFDA00]">ID</span></h2>
            <p className="text-sm text-slate-400 mt-2">Masukkan kredensial Anda untuk masuk ke sistem terpusat DPUPR Kab. Garut.</p>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">NIP / Username</label>
              <input 
                type="text" 
                className="w-full px-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFDA00] focus:border-transparent transition-all backdrop-blur-sm shadow-inner"
                placeholder="Masukkan NIP Anda"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <a href="#" className="text-xs text-[#FFDA00] hover:text-white transition-colors">Lupa Password?</a>
              </div>
              <input 
                type="password" 
                className="w-full px-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFDA00] focus:border-transparent transition-all backdrop-blur-sm shadow-inner"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 pb-4">
              <input type="checkbox" id="remember" className="rounded border-white/20 bg-black/20 text-[#FFDA00] focus:ring-[#FFDA00]/50 h-4 w-4" />
              <label htmlFor="remember" className="text-sm text-slate-300 cursor-pointer select-none">Ingat saya di peramban ini</label>
            </div>

            <Link href="/dashboard" className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1E5EFF] hover:bg-[#173D90] text-white rounded-xl font-medium shadow-[0_0_15px_rgba(30,94,255,0.4)] hover:shadow-[0_0_20px_rgba(30,94,255,0.6)] hover:-translate-y-0.5 transition-all duration-300 group">
              Login ke Portal
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#071A3D] text-slate-400">Atau masuk menggunakan</span>
              </div>
            </div>

            {/* Google Login */}
            <button className="w-full mt-6 mb-4 flex items-center justify-center gap-3 py-3.5 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Lanjutkan dengan Google</span>
            </button>

            {/* Other Options */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-slate-200 transition-colors group">
                <QrCode className="w-5 h-5 text-[#FFDA00] group-hover:scale-110 transition-transform" />
                <span>QR Code</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-slate-200 transition-colors group">
                <Smartphone className="w-5 h-5 text-[#FFDA00] group-hover:scale-110 transition-transform" />
                <span>Passkey</span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 mt-12">
            &copy; 2024 Dinas Pekerjaan Umum dan Penataan Ruang<br/>Kabupaten Garut.
          </p>

        </div>
      </div>
      
    </div>
  );
}
