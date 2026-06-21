import { House, Camera, Trophy, SlidersHorizontal, Footprints } from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: House },
    { name: "League", path: "/league", icon: Trophy },
    { name: "Camera", path: "/vision", icon: Camera },
    { name: "Activity", path: "/activity", icon: Footprints },
    { name: "Simulate", path: "/simulate", icon: SlidersHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-[#0a0c10]/95 backdrop-blur-xl border-t border-cyan-500/30 shadow-[0_-10px_30px_rgba(0,243,255,0.05)] z-50">
      <div className="max-w-md mx-auto px-2 h-16 flex justify-between items-center relative">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              aria-label={item.name}
              className={cn(
                "flex flex-col items-center justify-center w-14 h-full relative group",
                isActive ? "text-cyan-400" : "text-slate-500 hover:text-cyan-200"
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.8)]"></div>
              )}
              <Icon size={24} weight={isActive ? "fill" : "duotone"} className="mb-1 transition-colors duration-300" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase opacity-80">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
