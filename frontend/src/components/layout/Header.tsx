import { Bell, Search, Globe, Moon, LayoutGrid } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 glass-panel mt-4 mr-4 flex items-center justify-between px-6 sticky top-4 z-50">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96 hidden md:block group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-[#56CCF2] transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-2xl leading-5 bg-white/5 text-slate-300 placeholder-slate-400 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-[#56CCF2] sm:text-sm transition-all duration-300"
            placeholder="Search applications, users, or settings (Ctrl+K)..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors">
          <Globe className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors">
          <Moon className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-[#FF4D6D] ring-2 ring-[#071A3D]" />
        </button>
        <div className="h-6 w-px bg-white/20 mx-2"></div>
        <button className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors">
          <LayoutGrid className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
