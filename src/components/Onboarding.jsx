import { useState } from 'react';
import { Terminal, ShieldCheck, Leaf, Cpu, Waves, Planet, Sun } from '@phosphor-icons/react';
import { useAppContext } from '../context/AppContext';

export default function Onboarding() {
  const [isVisible, setIsVisible] = useState(() => {
    return !localStorage.getItem("carbonary_onboarded");
  });
  const [step, setStep] = useState(1);
  const { setTwinStyle } = useAppContext();

  const handleAcceptMission = () => {
    setStep(2);
  };

  const handleSelectHabit = (styleId) => {
    setTwinStyle(styleId);
    localStorage.setItem("carbonary_onboarded", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in zoom-in-95 fade-in duration-700 overflow-y-auto">
      <div className="cyber-panel max-w-lg w-full p-6 border-cyan-500/50 shadow-[0_0_40px_rgba(0,243,255,0.15)] relative overflow-hidden my-auto">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center gap-3 text-cyan-400 mb-6 border-b border-white/10 pb-4">
          <Terminal size={32} weight="duotone" className="animate-pulse text-cyan-400 shrink-0" />
          <div>
            <h2 className="text-xl font-mono tracking-widest uppercase font-bold text-white">System Initialization</h2>
            <p className="text-[10px] text-cyan-500 uppercase tracking-widest font-mono">
              {step === 1 ? "Incoming Transmission..." : "Calibrating Neural Link..."}
            </p>
          </div>
        </div>
        
        {step === 1 ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="relative z-10 space-y-4 font-mono text-sm text-slate-300 leading-relaxed mb-8">
              <p>
                <span className="text-cyan-400 font-bold">Wake up, Eco-Warrior.</span> The year is 2026. If you do not act now, the future will be completely destroyed by unchecked carbon emissions and ecological collapse.
              </p>
              <p>
                To alter this catastrophic timeline, you must accept <strong className="text-white">Project Carbonary</strong>. You will be bonded with an AI "Carbon Twin"—a digital lifeform directly linked to your real-world choices. 
              </p>
              <ul className="space-y-3 ml-2 my-4 border-l-2 border-cyan-500/30 pl-4 py-2">
                <li><span className="text-cyan-400 mr-2">{">"}</span><strong className="text-cyan-400">TRACK</strong> your daily impact via the HUD.</li>
                <li><span className="text-purple-400 mr-2">{">"}</span><strong className="text-purple-400">SCAN</strong> receipts and objects to reveal hidden footprints.</li>
                <li><span className="text-green-400 mr-2">{">"}</span><strong className="text-green-400">EVOLVE</strong> your twin by making sustainable choices.</li>
              </ul>
              <p className="text-xs text-red-400 border border-red-500/30 bg-red-500/10 p-3 rounded-md leading-relaxed">
                [CRITICAL WARNING]: If you refuse this mission, the dystopian future becomes inevitable. Accept the uplink to take responsibility and begin.
              </p>
            </div>

            <button 
              onClick={handleAcceptMission}
              className="relative z-10 w-full py-4 cyber-button text-sm tracking-widest font-bold flex justify-center items-center gap-2 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]"
            >
              <ShieldCheck size={20} weight="fill" /> [ ACCEPT MISSION ]
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="relative z-10 space-y-4 font-mono text-sm text-slate-300 leading-relaxed mb-2">
              <p>
                Select your primary real-world focus to calibrate your Twin's base form factor.
              </p>
              
              <div className="grid gap-3 mt-4">
                <button onClick={() => handleSelectHabit("forest")} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:border-green-500/50 hover:bg-green-500/10 transition-all text-left group">
                  <div className="p-2 bg-green-500/20 text-green-400 rounded-md shrink-0"><Leaf size={24} weight="duotone" /></div>
                  <div>
                    <div className="text-white font-bold text-base group-hover:text-green-400 transition-colors">Restoring Nature</div>
                    <div className="text-xs text-slate-400">Trees, Parks, Reforestation</div>
                  </div>
                </button>
                <button onClick={() => handleSelectHabit("cyber")} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all text-left group">
                  <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-md shrink-0"><Cpu size={24} weight="duotone" /></div>
                  <div>
                    <div className="text-white font-bold text-base group-hover:text-cyan-400 transition-colors">Technological Efficiency</div>
                    <div className="text-xs text-slate-400">Smart devices, EV, Upcycling</div>
                  </div>
                </button>
                <button onClick={() => handleSelectHabit("ocean")} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:border-blue-500/50 hover:bg-blue-500/10 transition-all text-left group">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-md shrink-0"><Waves size={24} weight="duotone" /></div>
                  <div>
                    <div className="text-white font-bold text-base group-hover:text-blue-400 transition-colors">Ocean Conservation</div>
                    <div className="text-xs text-slate-400">Water saving, Plastic free</div>
                  </div>
                </button>
                <button onClick={() => handleSelectHabit("solar")} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all text-left group">
                  <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-md shrink-0"><Sun size={24} weight="duotone" /></div>
                  <div>
                    <div className="text-white font-bold text-base group-hover:text-yellow-400 transition-colors">Renewable Energy</div>
                    <div className="text-xs text-slate-400">Solar, Wind, Power savings</div>
                  </div>
                </button>
                <button onClick={() => handleSelectHabit("space")} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:border-purple-500/50 hover:bg-purple-500/10 transition-all text-left group">
                  <div className="p-2 bg-purple-500/20 text-purple-400 rounded-md shrink-0"><Planet size={24} weight="duotone" /></div>
                  <div>
                    <div className="text-white font-bold text-base group-hover:text-purple-400 transition-colors">Future Frontiers</div>
                    <div className="text-xs text-slate-400">Minimalism, Future tech</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
