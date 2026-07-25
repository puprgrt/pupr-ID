"use client";

import { useState } from "react";
import { User, Shield, Bell, Settings as SettingsIcon, Mail, Smartphone, Globe, Key, AlertTriangle } from "lucide-react";

interface SettingsTabsProps {
  email: string;
  role: string;
}

export default function SettingsTabs({ email, role }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState("profile");
  
  // UI States untuk form mock
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);

  const tabs = [
    { id: "profile", label: "Profil Pengguna", icon: User },
    { id: "general", label: "Pengaturan Umum", icon: SettingsIcon },
    { id: "security", label: "Keamanan", icon: Shield },
    { id: "notifications", label: "Notifikasi", icon: Bell },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Nav (Tabs) */}
      <div className="w-full md:w-64 shrink-0 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-[#1E5EFF] text-white shadow-lg shadow-[#1E5EFF]/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-slate-500"}`} />
            <span className="font-medium text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 glass-panel p-6 md:p-10 min-h-[500px]">
        
        {/* --- TAB: PROFIL --- */}
        {activeTab === "profile" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <h2 className="text-2xl font-poppins font-bold text-white">Profil Pengguna</h2>
              <p className="text-slate-400 text-sm mt-1">Informasi dasar akun dan detail peran Anda.</p>
            </div>
            
            <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-24 h-24 rounded-full border-4 border-[#1E5EFF] overflow-hidden bg-slate-800">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white capitalize">{email.split('@')[0]}</h3>
                <p className="text-slate-400 mb-3">{email}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${role === 'Super Admin' ? 'bg-[#FFDA00]/20 text-[#FFDA00]' : 'bg-[#56CCF2]/20 text-[#56CCF2]'}`}>
                  Role: {role}
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400 font-medium">Alamat Email</label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <Mail className="w-5 h-5 text-slate-500" />
                    <input type="email" value={email} readOnly className="bg-transparent border-none outline-none text-white w-full" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400 font-medium">Nomor Handphone (NIP/NIK)</label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <Smartphone className="w-5 h-5 text-slate-500" />
                    <input type="text" placeholder="Belum diatur" className="bg-transparent border-none outline-none text-white w-full" />
                  </div>
                </div>
              </div>
              <button className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
                Simpan Perubahan
              </button>
            </div>
          </div>
        )}

        {/* --- TAB: GENERAL --- */}
        {activeTab === "general" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <h2 className="text-2xl font-poppins font-bold text-white">Pengaturan Umum</h2>
              <p className="text-slate-400 text-sm mt-1">Konfigurasi bahasa, zona waktu, dan preferensi aplikasi.</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl"><Globe className="w-6 h-6 text-[#56CCF2]" /></div>
                  <div>
                    <h4 className="text-white font-medium">Bahasa Sistem</h4>
                    <p className="text-xs text-slate-400 mt-1">Pilih bahasa bawaan antarmuka aplikasi</p>
                  </div>
                </div>
                <select className="bg-[#071A3D] text-white px-4 py-2 rounded-xl border border-white/20 outline-none">
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English (US)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: SECURITY --- */}
        {activeTab === "security" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <h2 className="text-2xl font-poppins font-bold text-white">Keamanan & Sesi</h2>
              <p className="text-slate-400 text-sm mt-1">Lindungi akun Anda dan pantau aktivitas login.</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl"><Key className="w-6 h-6 text-[#FFDA00]" /></div>
                  <div>
                    <h4 className="text-white font-medium">Two-Factor Authentication (2FA)</h4>
                    <p className="text-xs text-slate-400 mt-1">Tambahkan lapis keamanan menggunakan Google Authenticator</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${is2FAEnabled ? 'bg-[#00C853]' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${is2FAEnabled ? 'translate-x-6' : 'translate-x-0'}`}></span>
                </button>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/20">
                <AlertTriangle className="w-6 h-6 text-[#FF4D6D] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[#FF4D6D] font-semibold">Ubah Kata Sandi</h4>
                  <p className="text-sm text-[#FF4D6D]/80 mt-1 mb-3">
                    Bagi Anda yang menggunakan otentikasi Supabase, kami menyarankan untuk memperbarui kata sandi Anda setiap 3 bulan sekali.
                  </p>
                  <button className="px-4 py-2 bg-[#FF4D6D] hover:bg-[#FF4D6D]/90 text-white rounded-lg text-sm font-medium transition-colors">
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: NOTIFICATIONS --- */}
        {activeTab === "notifications" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <h2 className="text-2xl font-poppins font-bold text-white">Preferensi Notifikasi</h2>
              <p className="text-slate-400 text-sm mt-1">Kendalikan peringatan apa saja yang masuk ke perangkat Anda.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <h4 className="text-white font-medium">Notifikasi Email</h4>
                  <p className="text-xs text-slate-400 mt-1">Kirim ringkasan aktivitas sistem mingguan ke email ini.</p>
                </div>
                <button 
                  onClick={() => setEmailNotif(!emailNotif)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${emailNotif ? 'bg-[#1E5EFF]' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${emailNotif ? 'translate-x-6' : 'translate-x-0'}`}></span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
