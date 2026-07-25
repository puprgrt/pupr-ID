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
    console.error("Error fetching users:", error);
    return { error: error?.message || error?.details || JSON.stringify(error) || "Terjadi kesalahan yang tidak diketahui saat mengambil data profil." };
  }

  return { data };
}

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = await createClient();
  
  // Karena app_metadata (auth.users) dan tabel public.profiles harus disinkronkan,
  // dan hanya admin yang boleh melakukan ini, kita panggil fungsi RPC yang sudah kita buat 
  // di database menggunakan SECURITY DEFINER.
  const { error } = await supabase.rpc('admin_set_user_role', {
    target_user_id: userId,
    new_role: newRole
  });

  if (error) {
    console.error("Error updating user role:", error);
    return { error: error.message };
  }

  revalidatePath('/dashboard/users');
  return { success: true };
}
