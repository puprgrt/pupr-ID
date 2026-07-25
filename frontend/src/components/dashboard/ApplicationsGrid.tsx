"use client";

import { useState, useTransition } from "react";
import { Search, Plus, ExternalLink, Settings, MoreVertical, X, Loader2, Server, Trash2, Edit3, Globe } from "lucide-react";
import { createApplication, updateApplication, deleteApplication } from "@/app/dashboard/apps/actions";

interface Application {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  users_count: number;
  color_gradient: string;
  app_url?: string;
  icon_url?: string;
}

export default function ApplicationsGrid({ initialApps = [] }: { initialApps?: Application[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [isPending, startTransition] = useTransition();

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editApp, setEditApp] = useState<Application | null>(null);
  
  // Dropdown Menu State (simpan ID aplikasi yang sedang buka menu)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const categories = ["Semua", "Layanan Publik", "Manajemen Internal", "Pemetaan (GIS)"];

  const filteredApps = initialApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (app.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "Semua" || app.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createApplication(formData);
      if (result.success) {
        setIsAddModalOpen(false);
      } else {
        alert("Gagal menambahkan layanan: " + result.error);
      }
    });
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateApplication(formData);
      if (result.success) {
        setEditApp(null);
      } else {
        alert("Gagal menyimpan perubahan: " + result.error);
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus layanan "${name}"? Data yang dihapus tidak dapat dikembalikan.`)) {
      startTransition(async () => {
        const result = await deleteApplication(id);
        if (!result.success) {
          alert("Gagal menghapus layanan: " + result.error);
        }
      });
    }
    setActiveDropdown(null);
  };

  const openAppUrl = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      alert("Layanan ini belum memiliki URL tautan yang diatur.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-[#56CCF2] transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-white/10 rounded-2xl leading-5 bg-white/5 text-slate-200 placeholder-slate-400 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-[#56CCF2] transition-all duration-300"
            placeholder="Cari nama layanan atau deskripsi..."
          />
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#1E5EFF] hover:bg-[#1E5EFF]/90 text-white rounded-2xl font-medium shadow-lg shadow-[#1E5EFF]/30 transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Tambah Layanan Baru
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === category
                ? "bg-white text-[#071A3D] shadow-md"
                : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4 relative">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => (
            <div key={app.id} className="glass-panel p-6 rounded-3xl flex flex-col hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group">
              
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color_gradient || 'from-blue-500 to-indigo-600'} p-0.5 shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                  {app.icon_url ? (
                    <div className="w-full h-full rounded-[14px] bg-[#071A3D] flex items-center justify-center p-2">
                      <img src={app.icon_url} alt={app.name} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-[#071A3D]/40 backdrop-blur-sm rounded-[14px] flex items-center justify-center">
                      <span className="text-xl font-bold text-white drop-shadow-md">{app.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 relative">
                  <div className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                    app.status === 'online' ? 'bg-[#00C853]/20 text-[#00C853] border border-[#00C853]/20' : 
                    app.status === 'maintenance' ? 'bg-[#FFDA00]/20 text-[#FFDA00] border border-[#FFDA00]/20' : 
                    'bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      app.status === 'online' ? 'bg-[#00C853] animate-pulse' : 
                      app.status === 'maintenance' ? 'bg-[#FFDA00]' : 
                      'bg-[#FF4D6D]'
                    }`}></span>
                    {app.status}
                  </div>
                  
                  {/* Dropdown Menu (3 Titik) */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === app.id ? null : app.id)}
                      className="text-slate-400 hover:text-white p-1 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {activeDropdown === app.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#0a1930] border border-white/10 rounded-xl shadow-2xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <button 
                          onClick={() => { setEditApp(app); setActiveDropdown(null); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" /> Edit Layanan
                        </button>
                        <button 
                          onClick={() => openAppUrl(app.app_url)}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-[#56CCF2] hover:bg-white/5 transition-colors"
                        >
                          <Globe className="w-4 h-4" /> Buka URL
                        </button>
                        <div className="h-px bg-white/10 my-1"></div>
                        <button 
                          onClick={() => handleDelete(app.id, app.name)}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#FF4D6D] hover:bg-[#FF4D6D]/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" /> Hapus Layanan
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 mb-6 cursor-pointer" onClick={() => openAppUrl(app.app_url)}>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#56CCF2] transition-colors">{app.name}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{app.description}</p>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-white/10 mt-auto">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border border-[#071A3D] bg-slate-700">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.id}${i}`} className="w-full h-full rounded-full" alt="user" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-400">+{app.users_count?.toLocaleString('id-ID') || 0} users</span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditApp(app)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors" 
                    title="Pengaturan Layanan"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => openAppUrl(app.app_url)}
                    className="p-2 rounded-xl bg-[#56CCF2]/10 hover:bg-[#56CCF2]/20 text-[#56CCF2] transition-colors" 
                    title="Buka Aplikasi"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Server className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aplikasi tidak ditemukan</h3>
            <p className="text-slate-400 max-w-md">Belum ada layanan yang ditambahkan atau cocok dengan pencarian Anda.</p>
          </div>
        )}
        
        {/* Overlay if dropdown is open to close it when clicking outside */}
        {activeDropdown && (
          <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
        )}
      </div>

      {/* Modal / Dialog Tambah Layanan */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">Tambah Layanan</h2>
              <p className="text-sm text-slate-400">Daftarkan aplikasi baru ke ekosistem SSO PUPR.</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Nama Aplikasi</label>
                <input type="text" name="name" required placeholder="Misal: SIMBG" 
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#56CCF2] focus:ring-1 focus:ring-[#56CCF2]" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">URL Tautan (Web)</label>
                <input type="url" name="app_url" placeholder="https://..." 
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#56CCF2] focus:ring-1 focus:ring-[#56CCF2]" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">URL Gambar Ikon (Opsional)</label>
                <input type="url" name="icon_url" placeholder="https://.../logo.png" 
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#56CCF2] focus:ring-1 focus:ring-[#56CCF2]" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Deskripsi Singkat</label>
                <textarea name="description" required rows={2} placeholder="Sistem informasi manajemen..." 
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#56CCF2] focus:ring-1 focus:ring-[#56CCF2] resize-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Kategori</label>
                <select name="category" className="w-full px-4 py-2.5 rounded-xl bg-[#071A3D] border border-white/10 text-white focus:outline-none focus:border-[#56CCF2]">
                  <option value="Layanan Publik">Layanan Publik</option>
                  <option value="Manajemen Internal">Manajemen Internal</option>
                  <option value="Pemetaan (GIS)">Pemetaan (GIS)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Status</label>
                <select name="status" className="w-full px-4 py-2.5 rounded-xl bg-[#071A3D] border border-white/10 text-white focus:outline-none focus:border-[#56CCF2]">
                  <option value="online">Online (Aktif)</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isPending}
                  className="w-full flex justify-center items-center gap-2 py-3 bg-gradient-to-r from-[#1E5EFF] to-[#7B61FF] hover:from-[#1E5EFF]/90 hover:to-[#7B61FF]/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-[#1E5EFF]/25 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...</> : "Simpan ke Database"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal / Dialog Edit Layanan */}
      {editApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl relative">
            <button 
              onClick={() => setEditApp(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">Edit Layanan</h2>
              <p className="text-sm text-slate-400">Ubah konfigurasi layanan <strong>{editApp.name}</strong>.</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Hidden ID Field */}
              <input type="hidden" name="id" value={editApp.id} />
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Nama Aplikasi</label>
                <input type="text" name="name" required defaultValue={editApp.name}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#56CCF2] focus:ring-1 focus:ring-[#56CCF2]" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">URL Tautan (Web)</label>
                <input type="url" name="app_url" defaultValue={editApp.app_url || ''} placeholder="https://..." 
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#56CCF2] focus:ring-1 focus:ring-[#56CCF2]" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">URL Gambar Ikon (Opsional)</label>
                <input type="url" name="icon_url" defaultValue={editApp.icon_url || ''} placeholder="https://.../logo.png" 
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#56CCF2] focus:ring-1 focus:ring-[#56CCF2]" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Deskripsi Singkat</label>
                <textarea name="description" required rows={2} defaultValue={editApp.description}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#56CCF2] focus:ring-1 focus:ring-[#56CCF2] resize-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Kategori</label>
                <select name="category" defaultValue={editApp.category} className="w-full px-4 py-2.5 rounded-xl bg-[#071A3D] border border-white/10 text-white focus:outline-none focus:border-[#56CCF2]">
                  <option value="Layanan Publik">Layanan Publik</option>
                  <option value="Manajemen Internal">Manajemen Internal</option>
                  <option value="Pemetaan (GIS)">Pemetaan (GIS)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Status</label>
                <select name="status" defaultValue={editApp.status} className="w-full px-4 py-2.5 rounded-xl bg-[#071A3D] border border-white/10 text-white focus:outline-none focus:border-[#56CCF2]">
                  <option value="online">Online (Aktif)</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isPending}
                  className="w-full flex justify-center items-center gap-2 py-3 bg-[#FFDA00] hover:bg-[#FFDA00]/90 text-[#071A3D] rounded-xl font-bold transition-all shadow-lg shadow-[#FFDA00]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...</> : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
