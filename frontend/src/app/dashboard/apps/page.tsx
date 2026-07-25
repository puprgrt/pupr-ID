import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ApplicationsGrid from "@/components/dashboard/ApplicationsGrid";
import { getApplications } from "./actions";

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Security check: Only Admins might be allowed here, but for now we let everyone view it
  // You could uncomment this if Guest shouldn't see the app store at all
  // const role = user.app_metadata?.role || "Guest";
  // if (role === "Guest") {
  //   redirect("/dashboard");
  // }

  const apps = await getApplications();

  return (
    <div className="pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-poppins font-bold text-white leading-tight">
          Integrasi <span className="text-[#FFDA00]">Layanan</span> & Aplikasi
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl">
          Pusat kendali ekosistem Single Sign-On DPUPR Kabupaten Garut. 
          Tambahkan dan pantau status koneksi antar-aplikasi dari satu pintu (SSO).
        </p>
      </div>

      <ApplicationsGrid initialApps={apps} />
    </div>
  );
}
