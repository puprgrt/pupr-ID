"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getApplications() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching applications:", error);
    return [];
  }

  return data;
}

export async function createApplication(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const status = formData.get("status") as string;
  const app_url = formData.get("app_url") as string;
  const icon_url = formData.get("icon_url") as string;
  
  // Random color gradient for visual variety
  const colors = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-purple-500 to-pink-600",
    "from-rose-500 to-red-600",
    "from-cyan-500 to-blue-600"
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const { error } = await supabase
    .from("applications")
    .insert([
      {
        name,
        description,
        category,
        status,
        app_url,
        icon_url,
        color_gradient: randomColor,
        users_count: Math.floor(Math.random() * 500) // Mock initial users
      }
    ]);

  if (error) {
    console.error("Error creating application:", error);
    return { success: false, error: error.message };
  }

  // Merender ulang halaman agar data baru langsung muncul
  revalidatePath("/dashboard/apps");
  return { success: true };
}

export async function updateApplication(formData: FormData) {
  const supabase = await createClient();
  
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "ID aplikasi tidak ditemukan" };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const status = formData.get("status") as string;
  const app_url = formData.get("app_url") as string;
  const icon_url = formData.get("icon_url") as string;

  const { error } = await supabase
    .from("applications")
    .update({ name, description, category, status, app_url, icon_url, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error updating application:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/apps");
  return { success: true };
}

export async function deleteApplication(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting application:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/apps");
  return { success: true };
}
