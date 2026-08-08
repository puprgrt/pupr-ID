"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  const supabase = await createClient();
  
  // Ambil data profil beserta role-nya dari tabel public.profiles
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error?.message || error?.details || JSON.stringify(error) || "Terjadi kesalahan saat mengambil data." };
  }

  return { data };
}

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = await createClient();
  
  // Verifikasi Role (RBAC) - Pastikan hanya Administrator / Super Admin yang bisa
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "Unauthorized" };
  }
  const currentRole = user.app_metadata?.role || "Guest";
  if (currentRole !== "Administrator" && currentRole !== "Super Admin") {
    return { error: "Forbidden: Anda tidak memiliki izin untuk mengubah role pengguna." };
  }

  // Karena app_metadata (auth.users) dan tabel public.profiles harus disinkronkan,
  // dan hanya admin yang boleh melakukan ini, kita panggil fungsi RPC yang sudah kita buat 
  // di database menggunakan SECURITY DEFINER.
  const { error } = await supabase.rpc('admin_set_user_role', {
    target_user_id: userId,
    new_role: newRole
  });

  if (error) {
    console.error("Error updating user role:", error);
    if (error.message.includes("Could not find the function") || error.message.includes("function admin_set_user_role does not exist")) {
      return { error: "Fungsi admin_set_user_role belum diinstal di Database Supabase. Harap hubungi pengembang." };
    }
    return { error: error.message };
  }

  revalidatePath('/dashboard/users');
  return { success: true };
}
