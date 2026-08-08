"use client";

import { useState } from "react";
import { Shield, ShieldAlert, Key, Lock, Edit2, Users, Database, Globe, Save, CheckCircle2, Search, ArrowRight } from "lucide-react";

const rolesHierarchy = [
  { name: "Super Admin", level: 1, color: "text-[#FF4D6D]", bg: "bg-[#FF4D6D]/10", border: "border-[#FF4D6D]/30", desc: "Akses penuh sistem, manajemen konfigurasi, pengaturan SSO, & DB" },
  { name: "Administrator", level: 2, color: "text-[#FFDA00]", bg: "bg-[#FFDA00]/10", border: "border-[#FFDA00]/30", desc: "Manajemen user lintas OPD, integrasi API, & log sistem (Audit Trail)" },
  { name: "Kepala Dinas", level: 3, color: "text-[#00C853]", bg: "bg-[#00C853]/10", border: "border-[#00C853]/30", desc: "Akses eksekutif (View-Only) ke semua dashboard & analitik laporan" },
  { name: "Kabid", level: 4, color: "text-[#00C853]", bg: "bg-[#00C853]/10", border: "border-[#00C853]/30", desc: "Manajemen operasional level bidang, persetujuan utama" },
  { name: "Kasi", level: 5, color: "text-[#56CCF2]", bg: "bg-[#56CCF2]/10", border: "border-[#56CCF2]/30", desc: "Verifikasi dokumen, proses spesifik aplikasi, & operasional seksi" },
  { name: "Koordinator", level: 6, color: "text-[#56CCF2]", bg: "bg-[#56CCF2]/10", border: "border-[#56CCF2]/30", desc: "Koordinasi surveyor & pemantauan tim teknis di lapangan" },
  { name: "Operator", level: 7, color: "text-slate-300", bg: "bg-slate-500/10", border: "border-slate-500/30", desc: "Input & validasi data tingkat pertama (Layanan SIMBG/SIJENANG)" },
  { name: "Staf", level: 8, color: "text-slate-300", bg: "bg-slate-500/10", border: "border-slate-500/30", desc: "Akses internal dinas dengan izin operasional yang dibatasi" },
  { name: "Surveyor", level: 9, color: "text-slate-300", bg: "bg-slate-500/10", border: "border-slate-500/30", desc: "Akses mobile/lapangan untuk input dan upload data survei teknis" },
  { name: "Guest", level: 10, color: "text-slate-500", bg: "bg-slate-500/5", border: "border-slate-500/10", desc: "Pemohon / Masyarakat Umum, akses portal layanan mandiri" },
];

export default function RolesPage() {
  const [activeRole, setActiveRole] = useState(rolesHierarchy[0]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1400px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-[#FFDA00]/10 rounded-lg border border-[#FFDA00]/20">
              <Shield className="w-6 h-6 text-[#FFDA00]" />
            </div>
            <h1 className="text-3xl font-poppins font-bold text-white">Role-Based Access Control</h1>
          </div>
          <p className="text-slate-400">Hierarki akses dan perizinan identitas lintas aplikasi terpadu DPUPR Kab. Garut.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari Role..."
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#56CCF2] transition-colors w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Role Hierarchy Tree */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel p-5 border border-white/10">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#56CCF2]" />
              Hierarki (Zero-Trust)
            </h3>
            
            <div className="space-y-2 relative before:absolute before:inset-0 before:ml-4 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-white/20 before:to-transparent">
              {rolesHierarchy.map((role, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveRole(role)}
                  className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                    activeRole.name === role.name 
                      ? 'bg-white/10 border-white/20 shadow-lg' 
                      : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border relative z-10 ${role.bg} ${role.border} ${role.color}`}>
                    <span className="font-bold text-xs">{role.level}</span>
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${activeRole.name === role.name ? 'text-white' : 'text-slate-300'}`}>{role.name}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{role.desc}</p>
                  </div>
                  {activeRole.name === role.name && (
                    <ArrowRight className="w-4 h-4 text-[#56CCF2] ml-auto" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Role Detail & Permissions */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className={`glass-panel p-8 border ${activeRole.border} relative overflow-hidden transition-colors duration-500`}>
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-20 ${activeRole.bg}`}></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${activeRole.bg} ${activeRole.color} ${activeRole.border}`}>
                    Level {activeRole.level}
                  </span>
                  <span className="text-xs text-slate-400 bg-black/20 px-2 py-1 rounded-md border border-white/5">
                    ID: {activeRole.name.toUpperCase().replace(/\s+/g, '_')}
                  </span>
                </div>
                <h2 className="text-3xl font-poppins font-bold text-white mb-2">{activeRole.name}</h2>
                <p className="text-slate-300">{activeRole.desc}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-medium text-white transition-colors shrink-0">
                <Edit2 className="w-4 h-4" /> Edit Role
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 relative z-10">
              <div className="p-4 rounded-xl bg-[#071A3D]/50 border border-white/5">
                <div className="flex items-center gap-2 text-slate-300 mb-2">
                  <Globe className="w-4 h-4 text-[#17C3B2]" />
                  <span className="text-xs font-medium">Akses Aplikasi (SSO)</span>
                </div>
                <p className="text-sm font-semibold text-white">Semua Klien OIDC Aktif</p>
              </div>
              <div className="p-4 rounded-xl bg-[#071A3D]/50 border border-white/5">
                <div className="flex items-center gap-2 text-slate-300 mb-2">
                  <Database className="w-4 h-4 text-[#56CCF2]" />
                  <span className="text-xs font-medium">Policy Database</span>
                </div>
                <p className="text-sm font-semibold text-white">{activeRole.level <= 2 ? 'Read / Write (Global)' : 'Read Only (Scoped)'}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#071A3D]/50 border border-white/5">
                <div className="flex items-center gap-2 text-slate-300 mb-2">
                  <Key className="w-4 h-4 text-[#FFDA00]" />
                  <span className="text-xs font-medium">Otorisasi MFA</span>
                </div>
                <p className="text-sm font-semibold text-white">{activeRole.level <= 3 ? 'Wajib (Required)' : 'Opsional'}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 border border-white/10">
            <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-slate-400" />
              Matriks Izin (Permissions)
            </h3>
            
            <div className="space-y-4">
              {[
                { module: "User Management", read: true, write: activeRole.level <= 2, delete: activeRole.level === 1 },
                { module: "OIDC Client Config", read: activeRole.level <= 2, write: activeRole.level <= 2, delete: activeRole.level === 1 },
                { module: "Dashboard Reports", read: activeRole.level <= 4, write: false, delete: false },
                { module: "Audit Logs (System)", read: activeRole.level <= 2, write: false, delete: false },
                { module: "GIS Map Data", read: true, write: activeRole.level <= 6, delete: activeRole.level <= 2 },
              ].map((perm, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="font-medium text-sm text-slate-200">{perm.module}</span>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 uppercase">Read</span>
                      {perm.read ? <CheckCircle2 className="w-4 h-4 text-[#00C853]" /> : <XCircle className="w-4 h-4 text-slate-600" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 uppercase">Write</span>
                      {perm.write ? <CheckCircle2 className="w-4 h-4 text-[#00C853]" /> : <XCircle className="w-4 h-4 text-slate-600" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 uppercase">Delete</span>
                      {perm.delete ? <CheckCircle2 className="w-4 h-4 text-[#FF4D6D]" /> : <XCircle className="w-4 h-4 text-slate-600" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1E5EFF] hover:bg-[#1E5EFF]/80 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-[#1E5EFF]/20">
                <Save className="w-4 h-4" /> Simpan Perubahan Policy
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

function XCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  )
}
