"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import GuestDashboard from "@/components/dashboard/GuestDashboard";
import { ShieldCheck, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [greeting, setGreeting] = useState("Selamat Datang");
  const [dateStr, setDateStr] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Setup Waktu & Tanggal
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setDateStr(new Date().toLocaleDateString('id-ID', options));

    // Fetch User Role dari Supabase
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const displayName = user.email ? user.email.split('@')[0] : "Pengguna";
        setUserEmail(displayName);
        const role = user.app_metadata?.role || "Guest";
        setUserRole(role);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#FFDA00]/30 border-t-[#FFDA00] rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium animate-pulse">Memuat pengaturan ruang kerja...</p>
        </div>
      </div>
    );
  }

  // JIKA ROLE ADALAH GUEST
  if (userRole === "Guest") {
    // GuestDashboard memiliki Header-nya sendiri
    return <GuestDashboard />;
  }

  // JIKA ROLE ADALAH ADMIN / SUPER ADMIN
  return (
    <div className="pb-20">
      {/* Header Contextual khusus Admin */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-medium text-[#56CCF2] mb-1">{dateStr}</p>
          <h1 className="text-3xl font-poppins font-bold text-white leading-tight">
            {greeting}, <span className="text-[#FFDA00] capitalize">{userEmail}</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-sm text-slate-300">
              Peran Anda: <span className="font-semibold px-2 py-0.5 rounded-full text-xs bg-[#FFDA00]/20 text-[#FFDA00]">{userRole}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-md">
            <ShieldCheck className="w-5 h-5 text-[#00C853]" />
            <span className="text-sm font-medium text-white">Security Score: <span className="text-[#00C853] font-bold">98%</span></span>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all font-medium"
            title="Keluar"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <AdminDashboard />
    </div>
  );
}
