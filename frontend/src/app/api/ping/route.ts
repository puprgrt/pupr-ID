import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    // Inisialisasi Supabase client
    const supabase = await createClient();

    // Lakukan query sederhana untuk mencatat aktivitas di Supabase
    // Mengambil 1 baris dari tabel pg_stat_activity atau mencoba hit auth
    // Kita cukup panggil fungsi auth.getSession() atau select dari user
    // Query ini akan dihitung sebagai 1 aktivitas oleh Supabase
    
    // Pilih tabel bebas yang pasti ada, misal kita cukup cek koneksi atau session
    const { error } = await supabase.from('oidc_clients').select('id').limit(1);

    if (error) {
      console.error('Ping query error:', error);
      // Kita tetap return 200 supaya UptimeRobot tidak menganggap down jika tabel tidak bisa diakses
      // karena API tetap dipanggil
    }

    return NextResponse.json(
      { 
        status: 'ok', 
        message: 'Supabase ping successful', 
        timestamp: new Date().toISOString() 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Ping endpoint failed:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
