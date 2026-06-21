import { Tree, Fire, Target, TrendUp, Scales, Books, Sparkle, Trophy } from "@phosphor-icons/react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { xp, rank, name, netCarbonScore, carbonSaved, carbonGenerated, challenges, twinState, twinStyle, steps, screenTimeMinutes } = useAppContext();
  const xpProgress = rank.next === "MAX" ? 100 : (xp / rank.next) * 100;

  // Derive Twin UI based on state and style
  const twinImages = {
    forest: { thriving: "/utopian.png", stable: "https://images.unsplash.com/photo-1511497584788-876760111969?w=400&q=80", struggling: "/dystopian.png" },
    cyber: { thriving: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=400&q=80", stable: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80", struggling: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=400&q=80" },
    ocean: { thriving: "https://images.unsplash.com/photo-1582967635903-b097dc68434d?w=400&q=80", stable: "https://images.unsplash.com/photo-1498623116890-37e912163d5d?w=400&q=80", struggling: "https://images.unsplash.com/photo-1611273426858-450d8ce3ca8c?w=400&q=80" }
  };

  const currentImg = twinImages[twinStyle]?.[twinState] || twinImages.forest.stable;

  const twinConfig = {
    thriving: { img: currentImg, label: "Thriving", color: "text-green-400", border: "border-green-500/50" },
    stable: { img: currentImg, label: "Stable", color: "text-blue-400", border: "border-blue-500/50" },
    struggling: { img: currentImg, label: "Struggling", color: "text-orange-400", border: "border-orange-500/50" }
  };
  const currentTwin = twinConfig[twinState] || twinConfig.stable;

  return (
    <div className="p-6 pt-12 animate-in fade-in duration-500 pb-24 space-y-6">
      
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <p className="text-cyan-400 font-mono text-xs font-bold tracking-widest uppercase">ID: {name}</p>
          <h1 className="text-2xl font-bold text-white tracking-wider">CARBON<span className="text-cyan-500">ARY</span></h1>
        </div>
        <Link to="/profile" className="flex flex-col items-end group">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-purple-400">{rank.name}</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[2px] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-full border-[2px] border-transparent flex items-center justify-center relative overflow-hidden">
                <span className="text-xs font-bold text-white">Lv.{rank.level}</span>
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md group-hover:bg-blue-500/40 transition-colors"></div>
              </div>
            </div>
          </div>
          <div className="w-24 segmented-bar h-2">
            <div 
              className="segmented-bar-fill text-cyan-400" 
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-cyan-400 mt-1 font-mono tracking-widest">[{xp} / {rank.next}] XP</span>
        </Link>
      </header>

      {/* Flagship: AI Carbon Twin */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
          <Sparkle className="text-purple-400" weight="duotone" /> AI Carbon Twin
        </h2>
        <div className={`relative w-full h-48 border border-cyan-500/30 transition-colors duration-700`} style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
          <img src={currentTwin.img} alt="Carbon Twin" className="object-cover w-full h-full opacity-80 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          
          {/* Cyber Decor Lines */}
          <div className="absolute top-4 right-4 w-12 h-1 bg-cyan-500/50"></div>
          <div className="absolute top-6 right-4 w-6 h-1 bg-cyan-500/50"></div>
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div aria-live="polite">
              <p className="text-xs text-slate-300 font-medium mb-1">Twin Status</p>
              <h3 className={`text-2xl font-bold ${currentTwin.color} flex items-center gap-2`}>
                {currentTwin.label}
              </h3>
            </div>
            <Link to="/simulate" className="cyber-button text-xs glitch-hover">
              [ ENTER SIMULATOR ]
            </Link>
          </div>
        </div>
      </section>

      {/* Daily Carbon Battle */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
          <Scales className="text-blue-400" weight="duotone" /> Daily Battle
        </h2>
        <div className="cyber-panel p-5">
          <div className="flex justify-between items-center mb-6">
            <div className="text-center">
              <p className="text-[10px] text-cyan-500/80 mb-1 font-mono uppercase tracking-widest">[SAVED]</p>
              <p className="text-2xl font-mono text-green-400">{carbonSaved.toFixed(1)}g</p>
            </div>
            <div className="flex flex-col items-center px-4 border-x border-cyan-500/30">
              <p className="text-[10px] text-cyan-500/80 mb-1 font-mono uppercase tracking-widest">[NET_SCORE]</p>
              <p className={`text-4xl font-mono ${netCarbonScore > 0 ? "text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" : "text-orange-400"}`}>
                {netCarbonScore > 0 ? "+" : ""}{netCarbonScore.toFixed(1)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-cyan-500/80 mb-1 font-mono uppercase tracking-widest">[GENERATED]</p>
              <p className="text-2xl font-mono text-orange-400">{carbonGenerated.toFixed(1)}g</p>
            </div>
          </div>
          
          {/* Segmented Battle Bar */}
          <div className="w-full segmented-bar h-4 mt-2">
            <div 
              className={`segmented-bar-fill ${netCarbonScore > 0 ? "text-cyan-400" : "text-orange-400"}`}
              style={{ width: `${Math.min(100, Math.max(0, (carbonSaved / Math.max(1, carbonSaved + carbonGenerated)) * 100))}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Daily Inputs Log */}
      <section>
        <div className="flex gap-4">
          <div className="cyber-panel p-4 flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-1">Total Steps</p>
            <p className="text-2xl font-mono text-green-400">{steps.toLocaleString()}</p>
          </div>
          <div className="cyber-panel p-4 flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-1">Screen Time</p>
            <p className="text-2xl font-mono text-blue-400">{Math.floor(screenTimeMinutes / 60)}h {screenTimeMinutes % 60}m</p>
          </div>
        </div>
      </section>

      {/* AI Carbon Diary Snippet */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
          <Books className="text-indigo-400" weight="duotone" /> AI Diary
        </h2>
        <div className="cyber-panel p-4 border-l-4 border-cyan-500">
          <p className="text-sm text-slate-300 leading-relaxed italic">
            "Today you walked {Math.floor(carbonSaved / 13)} steps and avoided approx {carbonSaved}g CO₂. Most of your emissions came from digital activity. Tomorrow's challenge is to replace one short vehicle trip with walking."
          </p>
          <div className="mt-3 flex justify-end">
            <Link to="/coach" className="text-xs text-indigo-400 font-semibold hover:text-indigo-300">Chat with Coach &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Active Challenges */}
      <section>
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="text-red-400" weight="duotone" /> Active Challenges
          </h2>
          <Link to="/league" className="text-xs text-purple-400 font-semibold hover:text-purple-300">View League &rarr;</Link>
        </div>
        <div className="space-y-3">
          {challenges.slice(0, 2).map((challenge) => (
            <div key={challenge.id} className="cyber-panel p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${challenge.completed ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                {challenge.completed ? <Trophy size={24} weight="fill" /> : <Target size={24} weight="duotone" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <p className={`text-sm font-semibold ${challenge.completed ? 'text-green-400' : 'text-white'}`}>{challenge.title}</p>
                  <p className="text-xs text-cyan-400 font-mono tracking-widest">+{challenge.xp} XP</p>
                </div>
                <div className="w-full segmented-bar h-2">
                  <div className={`segmented-bar-fill ${challenge.completed ? 'text-green-400' : 'text-cyan-500'}`} style={{ width: `${Math.min(100, (challenge.progress / challenge.target) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Carbon Tree */}
      <section>
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Tree className="text-green-400" weight="duotone" /> Your Carbon Tree
          </h2>
          <span className="text-xs text-green-400 font-bold">{Math.floor(carbonSaved)}g Saved</span>
        </div>
        <div className="cyber-panel p-5 relative overflow-hidden flex flex-col items-center justify-center min-h-[280px]">
          {/* Animated Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-500/20 rounded-full blur-[60px] animate-pulse"></div>
          
          {/* Tree Logic */}
          {(() => {
            const totalSaved = carbonSaved;
            const stages = [
              { threshold: 0, img: "/tree_stage_1.png", name: "Seedling", next: 200 },
              { threshold: 200, img: "/tree_stage_2.png", name: "Sprout", next: 500 },
              { threshold: 500, img: "/tree_stage_3.png", name: "Sapling", next: 1000 },
              { threshold: 1000, img: "/tree_stage_4.png", name: "Young Tree", next: 2500 },
              { threshold: 2500, img: "/tree_stage_5.png", name: "Mature Tree", next: 5000 },
              { threshold: 5000, img: "/tree_stage_6.png", name: "Ancient World Tree", next: "MAX" }
            ];
            
            // Find current stage
            let currentStageIndex = 0;
            for (let i = stages.length - 1; i >= 0; i--) {
              if (totalSaved >= stages[i].threshold) {
                currentStageIndex = i;
                break;
              }
            }
            const stage = stages[currentStageIndex];
            const prevThreshold = stage.threshold;
            
            let progressPercent = 100;
            if (stage.next !== "MAX") {
              progressPercent = ((totalSaved - prevThreshold) / (stage.next - prevThreshold)) * 100;
            }

            return (
              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="w-48 h-48 relative mb-4 transition-transform duration-1000 hover:scale-105">
                  <img 
                    src={stage.img} 
                    alt={stage.name} 
                    className="w-full h-full object-contain animate-in zoom-in-90 fade-in duration-1000"
                  />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide">{stage.name}</h3>
                
                <div className="w-full max-w-[80%]">
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium mb-1 uppercase tracking-wider">
                    <span>{stage.name}</span>
                    <span>{stage.next === "MAX" ? "Max Level" : `${Math.floor(stage.next - totalSaved)}g to Next`}</span>
                  </div>
                  <div className="w-full segmented-bar h-2">
                    <div 
                      className="segmented-bar-fill text-green-400"
                      style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                    >
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

    </div>
  );
}
