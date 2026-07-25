import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {children}
        </main>
      </div>
      
      {/* Floating AI Assistant Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-r from-[#7B61FF] to-[#1E5EFF] shadow-[0_0_20px_rgba(123,97,255,0.6)] flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 z-50">
        <div className="relative">
          <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          </div>
        </div>
      </button>
    </div>
  );
}
