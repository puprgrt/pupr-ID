'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Stats {
  total_users: number;
  online_users: number;
  logins_today: number;
  failed_logins: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi Fetch dari API Gateway
    const fetchStats = async () => {
      try {
        // Pada produksi, ini akan fetch dari http://localhost:8000/api/v1/dashboard/stats
        // lengkap dengan Authorization: Bearer <token>
        setTimeout(() => {
          setStats({
            total_users: 12548,
            online_users: 1243,
            logins_today: 4210,
            failed_logins: 72
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    // Simulasi logout
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">PUPR</span>
              </div>
              <h1 className="text-xl font-semibold text-slate-800">SSO Administrator</h1>
            </div>
            <div>
              <Button onClick={handleLogout} variant="outline" className="text-slate-600 border-slate-300 hover:bg-slate-100">
                Keluar Sesi
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Ikhtisar Identitas Digital</h2>
          <p className="text-slate-500 mt-1">Pantau aktivitas login dan adopsi SSO harian di seluruh dinas.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Pengguna', value: stats?.total_users, color: 'text-blue-600' },
            { label: 'Pengguna Online', value: stats?.online_users, color: 'text-green-600' },
            { label: 'Login Hari Ini', value: stats?.logins_today, color: 'text-indigo-600' },
            { label: 'Gagal Login', value: stats?.failed_logins, color: 'text-red-600' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <span className="text-slate-500 font-medium text-sm">{stat.label}</span>
              {loading ? (
                <div className="h-8 w-24 bg-slate-200 rounded animate-pulse mt-2"></div>
              ) : (
                <span className={`text-4xl font-bold ${stat.color}`}>
                  {stat.value?.toLocaleString('id-ID')}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Connected Apps & Recent Activity (Placeholder) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Aplikasi Terintegrasi (Top 3)</h3>
            <div className="space-y-4">
              {['SIMBG', 'SIJENANG', 'LAIKA'].map((app, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center border border-slate-200 text-blue-500 font-bold">
                      {app.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700">{app}</h4>
                      <p className="text-sm text-slate-500">Status: Terhubung via OIDC</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">Kelola</Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Aktivitas Terakhir</h3>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 w-2 h-2 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Login Berhasil: Budi S.</p>
                    <p className="text-xs text-slate-400">2 menit yang lalu via LAIKA</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
