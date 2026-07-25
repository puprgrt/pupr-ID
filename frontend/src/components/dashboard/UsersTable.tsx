"use client";

import { useState, useTransition, useEffect } from "react";
import { Search, Loader2, ShieldAlert, User, MoreVertical, Edit2 } from "lucide-react";
import { updateUserRole } from "@/app/dashboard/users/actions";
import { createClient } from "@/utils/supabase/client";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  avatar_url: string | null;
  department: string | null;
  created_at: string;
}

const ROLES = [
  "Super Admin", 
  "Administrator", 
  "Kepala Dinas", 
  "Kabid", 
  "Kasi", 
  "Koordinator", 
  "Operator", 
  "Staf", 
  "Surveyor", 
  "Guest"
];

export default function UsersTable({ initialUsers, currentUserRole }: { initialUsers: Profile[], currentUserRole: string }) {
  const [users, setUsers] = useState<Profile[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Filter users by search query
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (user.full_name && user.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canEditRole = currentUserRole === "Super Admin" || currentUserRole === "Administrator";

  // Sinkronisasi jika data dari Server (initialUsers) berubah karena revalidatePath
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Supabase Realtime Subscription
  useEffect(() => {
    const supabase = createClient();
    
    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setUsers(current => [payload.new as Profile, ...current]);
        } else if (payload.eventType === 'UPDATE') {
          setUsers(current => current.map(u => u.id === payload.new.id ? { ...u, ...payload.new } : u));
        } else if (payload.eventType === 'DELETE') {
          setUsers(current => current.filter(u => u.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    // Optimistic UI Update
    const previousUsers = [...users];
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setEditingUserId(null);

    startTransition(async () => {
      const { error } = await updateUserRole(userId, newRole);
      if (error) {
        alert(`Gagal mengubah role: ${error}`);
        // Revert UI on failure
        setUsers(previousUsers);
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari email, nama, atau role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#56CCF2] transition-colors"
          />
        </div>
      </div>

      {!canEditRole && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FFB300]/10 border border-[#FFB300]/20">
          <ShieldAlert className="w-5 h-5 text-[#FFB300] shrink-0" />
          <p className="text-sm text-[#FFB300]/90">
            Anda sedang melihat daftar pengguna dalam mode *Read-Only*. Hanya <strong>Super Admin</strong> dan <strong>Administrator</strong> yang memiliki izin untuk mengubah Role pengguna.
          </p>
        </div>
      )}

      {/* Users Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 font-semibold text-slate-300 text-sm">Pengguna</th>
                <th className="p-4 font-semibold text-slate-300 text-sm">Role Saat Ini</th>
                <th className="p-4 font-semibold text-slate-300 text-sm">Tanggal Bergabung</th>
                <th className="p-4 font-semibold text-slate-300 text-sm text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    {searchQuery ? "Tidak ada pengguna yang cocok dengan pencarian." : "Belum ada data pengguna."}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border border-white/10 shrink-0">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.email} className="w-full h-full object-cover" />
                          ) : (
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Avatar" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.full_name || user.email.split('@')[0]}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      {editingUserId === user.id && canEditRole ? (
                        <select 
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-[#071A3D] border border-white/20 text-white text-sm rounded-lg focus:ring-[#56CCF2] focus:border-[#56CCF2] block w-full p-2"
                        >
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          user.role === 'Super Admin' || user.role === 'Administrator' ? 'bg-[#FFDA00]/20 text-[#FFDA00] border-[#FFDA00]/30' :
                          user.role === 'Kepala Dinas' || user.role === 'Kabid' ? 'bg-[#00C853]/20 text-[#00C853] border-[#00C853]/30' :
                          user.role === 'Guest' ? 'bg-slate-500/20 text-slate-300 border-slate-500/30' :
                          'bg-[#56CCF2]/20 text-[#56CCF2] border-[#56CCF2]/30'
                        }`}>
                          {user.role}
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-sm text-slate-300">
                      {new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>

                    <td className="p-4 text-right">
                      {canEditRole ? (
                        editingUserId === user.id ? (
                          <button 
                            onClick={() => setEditingUserId(null)}
                            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                          >
                            Batal
                          </button>
                        ) : (
                          <button 
                            onClick={() => setEditingUserId(user.id)}
                            className="text-xs text-[#56CCF2] hover:text-[#56CCF2]/80 px-3 py-1.5 rounded-lg border border-[#56CCF2]/30 hover:bg-[#56CCF2]/10 transition-colors flex items-center gap-1 ml-auto"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Ubah Role
                          </button>
                        )
                      ) : (
                        <button disabled className="text-slate-600 cursor-not-allowed">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {isPending && (
             <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[1px] z-10">
               <div className="flex flex-col items-center gap-3 bg-[#071A3D] p-5 rounded-2xl border border-white/10 shadow-2xl">
                 <Loader2 className="w-8 h-8 text-[#56CCF2] animate-spin" />
                 <p className="text-sm font-medium text-white">Menyimpan Perubahan...</p>
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
