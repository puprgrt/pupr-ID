import { createClient } from "@/utils/supabase/server";
import SettingsTabs from "@/components/dashboard/SettingsTabs";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = user.app_metadata?.role || "Guest";
  
  // Jika guest, mungkin tidak boleh akses Settings (opsional, tp kita izinkan lihat profil)
  // Untuk security lebih baik, kita bisa block jika Guest:
  // if (role === "Guest") redirect("/dashboard");

  return (
    <div className="pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-poppins font-bold text-white leading-tight">
          Pengaturan <span className="text-[#56CCF2]">Sistem</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">Kelola preferensi akun, privasi, dan keamanan aplikasi.</p>
      </div>

      <SettingsTabs email={user.email || ""} role={role} />
    </div>
  );
}
