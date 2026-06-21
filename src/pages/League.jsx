import { Trophy, Medal, FlagPennant, Users } from "@phosphor-icons/react";
import { useAppContext } from "../context/AppContext";

export default function League() {
  const { leagueData } = useAppContext();

  // Sort by score descending
  const sortedLeague = [...leagueData].sort((a, b) => b.score - a.score);

  return (
    <div className="p-6 pt-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-500/20 text-yellow-400 mx-auto flex items-center justify-center mb-3">
          <Trophy size={32} weight="duotone" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Campus Green League</h1>
        <p className="text-sm text-slate-400">Compete with friends and local groups.</p>
      </header>

      <div className="flex bg-white/5 rounded-xl p-1 mb-8 border border-glass-border" role="tablist" aria-label="League Categories">
        <button role="tab" aria-selected="true" className="flex-1 py-2 text-sm font-semibold rounded-lg bg-white/10 text-white shadow-md">
          Global
        </button>
        <button role="tab" aria-selected="false" className="flex-1 py-2 text-sm font-semibold rounded-lg text-slate-400 hover:text-white">
          Friends
        </button>
        <button role="tab" aria-selected="false" className="flex-1 py-2 text-sm font-semibold rounded-lg text-slate-400 hover:text-white">
          Teams
        </button>
      </div>

      <div className="cyber-panel overflow-hidden">
        <div className="p-4 bg-white/5 border-b border-glass-border flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span>Rank & Name</span>
          <span>Score</span>
        </div>
        
        <div className="divide-y divide-white/5">
          {sortedLeague.map((user, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            
            return (
              <div 
                key={index} 
                className={`p-4 flex items-center justify-between transition-colors ${
                  user.isMe ? "bg-purple-500/10 relative" : "hover:bg-white/5"
                }`}
              >
                {user.isMe && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-r-md"></div>
                )}
                
                <div className="flex items-center gap-4">
                  <div className={`font-bold w-6 text-center ${
                    rank === 1 ? "text-yellow-400" :
                    rank === 2 ? "text-slate-300" :
                    rank === 3 ? "text-orange-400" : "text-slate-500"
                  }`}>
                    {rank}
                  </div>
                  
                  <div>
                    <p className={`font-medium ${user.isMe ? "text-purple-300" : "text-white"}`}>
                      {user.name} {user.isMe && "(You)"}
                    </p>
                    {user.badge && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] uppercase tracking-wider font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20">
                        <Medal size={12} weight="fill" /> {user.badge}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="font-bold text-white">
                  {user.score.toLocaleString()} <span className="text-xs text-slate-400 font-normal">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="cyber-panel p-4 flex flex-col items-center text-center hover:bg-white/10 transition-colors cursor-pointer">
          <Users size={24} className="text-blue-400 mb-2" weight="duotone" />
          <p className="text-sm font-semibold text-white">Join a Team</p>
        </div>
        <div className="cyber-panel p-4 flex flex-col items-center text-center hover:bg-white/10 transition-colors cursor-pointer">
          <FlagPennant size={24} className="text-red-400 mb-2" weight="duotone" />
          <p className="text-sm font-semibold text-white">Weekly Challenge</p>
        </div>
      </div>
    </div>
  );
}
