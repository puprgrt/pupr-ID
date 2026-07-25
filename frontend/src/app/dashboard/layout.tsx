import DashboardLayout from "@/components/layout/DashboardLayout";
import { createClient } from "@/utils/supabase/server";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const role = user?.app_metadata?.role || "Guest";

  if (role === "Guest") {
    return (
      <div className="min-h-screen overflow-y-auto p-4 md:p-8 custom-scrollbar">
        {children}
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
