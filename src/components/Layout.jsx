import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import { useAppContext } from "../context/AppContext";

export default function Layout() {
  const { systemStatus, setCarbonGenerated } = useAppContext();
  const isCorrupted = systemStatus === "CORRUPTED";

  const handleRepair = () => {
    // Resetting generated carbon fixes the glitch
    setCarbonGenerated(0);
  };

  return (
    <div className={isCorrupted ? "system-corrupted" : ""}>
      <div className="cyber-bg-layer"></div>
      
      {isCorrupted && (
        <div 
          role="alert" 
          aria-live="assertive"
          className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-center bg-red-900/20 backdrop-blur-[2px]"
        >
          <div className="pointer-events-auto cyber-panel !border-red-500 bg-black/80 p-6 flex flex-col items-center text-center animate-pulse">
            <h2 className="text-3xl font-mono font-bold text-red-500 mb-2 glitch-text">SYSTEM CORRUPTION</h2>
            <p className="text-red-400 font-mono text-sm mb-6 max-w-[250px]">Critical carbon threshold exceeded. Neural link unstable.</p>
            <button 
              onClick={handleRepair}
              className="px-6 py-3 border border-red-500 text-red-500 font-mono font-bold hover:bg-red-500 hover:text-black transition-colors uppercase tracking-widest"
            >
              [ INITIATE EMERGENCY REPAIR ]
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen relative pb-24 md:pb-0 z-10">
        <main className="max-w-md mx-auto min-h-screen relative">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
