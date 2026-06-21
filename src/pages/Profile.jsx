import { useState } from "react";
import { Leaf, Heartbeat, PiggyBank, FloppyDisk } from "@phosphor-icons/react";
import { useAppContext } from "../context/AppContext";

export default function Profile() {
  const { name, setName, goal, setGoal, xp, rank, twinStyle, setTwinStyle } = useAppContext();
  
  const [inputName, setInputName] = useState(name);
  const [inputGoal, setInputGoal] = useState(goal);
  const [inputTwin, setInputTwin] = useState(twinStyle);
  const [saved, setSaved] = useState(false);

  const goals = [
    { id: "health", title: "Better Health", icon: Heartbeat, color: "text-red-400", bg: "bg-red-500/20" },
    { id: "emissions", title: "Reduce Emissions", icon: Leaf, color: "text-green-400", bg: "bg-green-500/20" },
    { id: "money", title: "Save Money", icon: PiggyBank, color: "text-yellow-400", bg: "bg-yellow-500/20" },
  ];

  const handleSave = () => {
    setName(inputName);
    setGoal(inputGoal);
    setTwinStyle(inputTwin);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Your Profile</h1>
        <p className="text-sm text-slate-400">Manage your identity and sustainability goals.</p>
      </header>

      <div className="space-y-6">
        <div className="cyber-panel p-5 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[3px] mb-4 shadow-xl shadow-purple-500/20">
            <div className="w-full h-full bg-slate-900 rounded-full border-[3px] border-transparent flex flex-col items-center justify-center">
               <span className="text-xs font-bold text-slate-400">Lv.{rank.level}</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">{name}</h2>
          <p className="text-sm font-semibold text-purple-400 mb-2">{rank.name}</p>
          <div className="bg-white/10 px-3 py-1 rounded-full border border-white/20 text-xs text-white">
            {xp} Total XP
          </div>
        </div>

        <div className="cyber-panel p-5">
          <label className="text-sm text-slate-300 font-medium block mb-2">Display Name</label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            className="w-full bg-white/5 border border-glass-border rounded-xl px-4 py-3 text-white text-base placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
          />
        </div>

        <div className="cyber-panel p-5">
          <label id="goal-group-label" className="text-sm text-slate-300 font-medium block mb-4">Primary Goal</label>
          <div className="space-y-3" role="radiogroup" aria-labelledby="goal-group-label">
            {goals.map((g) => {
              const Icon = g.icon;
              const isSelected = inputGoal === g.id;
              return (
                <button
                  key={g.id}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setInputGoal(g.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    isSelected 
                      ? "bg-white/10 border-purple-500 shadow-md shadow-purple-500/10" 
                      : "bg-glass border-glass-border hover:bg-white/5"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full ${g.bg} flex items-center justify-center ${g.color}`}>
                    <Icon size={20} weight={isSelected ? "fill" : "duotone"} />
                  </div>
                  <span className="text-white font-medium">{g.title}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="cyber-panel p-5">
          <label id="twin-group-label" className="text-sm text-slate-300 font-medium block mb-4">Carbon Twin Base Style</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="radiogroup" aria-labelledby="twin-group-label">
            {[
              { id: "forest", title: "Forest Spirit", img: "/forest_avatar.png" },
              { id: "cyber", title: "Cyber-Eco", img: "/cyber_avatar.png" },
              { id: "ocean", title: "Oceanic", img: "/ocean_avatar.png" },
              { id: "space", title: "Galactic", img: "/space_avatar.png" },
              { id: "solar", title: "Solarpunk", img: "/solar_avatar.png" }
            ].map((style) => (
              <button
                key={style.id}
                role="radio"
                aria-checked={inputTwin === style.id}
                onClick={() => setInputTwin(style.id)}
                className={`relative flex flex-col items-center gap-2 p-2 rounded-xl border transition-all duration-300 overflow-hidden ${
                  inputTwin === style.id 
                    ? "bg-white/10 border-blue-500 shadow-md shadow-blue-500/20" 
                    : "bg-glass border-glass-border hover:bg-white/5"
                }`}
              >
                <div className="w-full h-16 rounded-lg overflow-hidden relative">
                  <img src={style.img} alt={style.title} className="w-full h-full object-cover" />
                  {inputTwin === style.id && (
                    <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 rounded-lg"></div>
                  )}
                </div>
                <span className={`text-[10px] font-medium ${inputTwin === style.id ? 'text-blue-400' : 'text-slate-400'}`}>{style.title}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 py-4 cyber-button font-bold text-white relative overflow-hidden"
        >
          {saved ? (
            <span className="text-green-400 flex items-center gap-2">Saved Successfully!</span>
          ) : (
            <>
              <FloppyDisk size={20} weight="duotone" /> Save Profile
            </>
          )}
        </button>
      </div>
    </div>
  );
}
