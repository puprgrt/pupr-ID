import { Users, UserPlus } from "lucide-react";
import { getUsers } from "./actions";
import UsersTable from "@/components/dashboard/UsersTable";
import { createClient } from "@/utils/supabase/server";

export default async function UsersPage() {
  const { data: users, error } = await getUsers();
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserRole = user?.app_metadata?.role || "Guest";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-[#56CCF2]" />
            Manajemen Pengguna
          </h1>
          <p className="text-slate-400 mt-2">
            Kelola akses, profil, dan peran (*role*) seluruh pengguna di sistem PUPR-ID.
          </p>
        </div>
        
        {/* Tombol Tambah Pengguna (Hanya UI) */}
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#56CCF2] hover:bg-[#56CCF2]/90 text-[#071A3D] font-semibold transition-all">
          <UserPlus className="w-5 h-5" />
          <span>Undang Pengguna</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#56CCF2]/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#56CCF2]" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Total Pengguna</p>
              <h3 className="text-2xl font-bold text-white">{users?.length || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {error ? (
        <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl">
          <p className="text-red-400 font-medium">{error}</p>
          <p className="text-sm text-red-400/80 mt-2">Pastikan tabel `public.profiles` sudah dibuat di Supabase.</p>
        </div>
      ) : (
        <UsersTable initialUsers={users || []} currentUserRole={currentUserRole} />
      )}
      
    </div>
  );
}
