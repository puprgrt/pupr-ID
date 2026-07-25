"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";

export async function createOidcClient(name: string, redirectUri: string) {
  const supabase = await createClient();
  
  // Verifikasi Role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  const currentRole = user.app_metadata?.role || "Guest";
  if (currentRole !== "Administrator" && currentRole !== "Super Admin") {
    return { error: "Forbidden: Anda tidak memiliki izin." };
  }

  // Generate ID and Secret
  const clientId = "pupr_" + randomBytes(6).toString("hex");
  const clientSecret = "sk_live_" + randomBytes(16).toString("hex");

  const { data, error } = await supabase.from("oidc_clients").insert({
    name,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    status: "active",
    created_by: user.id
  }).select().single();

  if (error) {
    console.error("Error creating OIDC client:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/integrations");
  return { success: true, data };
}

export async function createWebhook(name: string, url: string, events: string[]) {
  const supabase = await createClient();
  
  // Verifikasi Role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  const currentRole = user.app_metadata?.role || "Guest";
  if (currentRole !== "Administrator" && currentRole !== "Super Admin") {
    return { error: "Forbidden: Anda tidak memiliki izin." };
  }

  const { data, error } = await supabase.from("webhooks").insert({
    name,
    url,
    events,
    status: "active",
    created_by: user.id
  }).select().single();

  if (error) {
    console.error("Error creating Webhook:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/integrations");
  return { success: true, data };
}
