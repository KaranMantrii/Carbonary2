import { useState } from "react";
import { SlidersHorizontal, ArrowRight, Car, Plant, Lightning, ShoppingBag, DeviceMobile, Bus, Money, Tree, CurrencyDollar, Planet } from "@phosphor-icons/react";

export default function Simulate() {
  // Sliders
  const [commute, setCommute] = useState(3);
  const [publicTransport, setPublicTransport] = useState(2);
  const [meat, setMeat] = useState(5);
  const [delivery, setDelivery] = useState(3);
  const [electricity, setElectricity] = useState(300); // kWh
  const [screenTime, setScreenTime] = useState(4); // hours

  // Timeframes
  const [timeframe, setTimeframe] = useState(1); // 1, 12 (1y), 60 (5y)

  // Simulation state
  const [simulationState, setSimulationState] = useState("idle"); // idle, loading, result
  const [narrative, setNarrative] = useState("");

  // Simple logic to determine future state
  const isExtremeElectricity = electricity >= 1000;
  const isExtremeMeat = meat >= 14;
  const isExtremeWater = electricity >= 800 && meat >= 10; // proxy for drought/desert
  
  const isDystopian = commute >= 4 || meat >= 10 || electricity > 500;
  const isUtopian = commute <= 2 && meat <= 3 && publicTransport >= 3 && delivery <= 1;

  let currentImage = "/utopian.png"; 
  let currentLabel = "Balanced Future";
  
  if (simulationState === "result") {
    if (isExtremeWater) {
      currentImage = "/desert_wasteland.png";
      currentLabel = "Desert Wasteland";
    } else if (isExtremeElectricity) {
      currentImage = "/flooded_city.png";
      currentLabel = "Flooded Coastal City";
    } else if (isDystopian) {
      currentImage = "/dystopian.png";
      currentLabel = "Smoggy Dystopia";
    } else if (isUtopian) {
      currentImage = "/utopian.png";
      currentLabel = "Utopian Eco-City";
    } else {
      currentImage = "https://images.unsplash.com/photo-1511497584788-876760111969?w=400&q=80"; // stable
      currentLabel = "Stable Environment";
    }
  }

  const resultStats = [
    { label: "Carbon Reduction", value: isDystopian ? "-15%" : "+42%", color: isDystopian ? "text-orange-400" : "text-green-400" },
    { label: "Trees Equivalent", value: isDystopian ? "Lost 50" : "Saved 120", color: isDystopian ? "text-orange-400" : "text-green-400" },
    { label: "Money Saved", value: isDystopian ? "-$300" : "+$850", color: isDystopian ? "text-red-400" : "text-yellow-400" },
  ];

  // Math models per month
  // Negative behaviors generate CO2, positive behaviors save CO2 (relative to baseline)
  const monthlyCarbonFootprintGrams = 
    (commute * 4 * 4000) + // car commute
    (meat * 4 * 2000) + // meat
    (delivery * 4 * 1000) + // packaging/delivery
    (electricity * 500) + // grid electricity
    (screenTime * 30 * 60) - // daily screen time
    (publicTransport * 4 * 1000); // offset

  const baselineMonthly = 500000; // 500kg
  const monthlySavings = baselineMonthly - monthlyCarbonFootprintGrams;

  const totalCarbonReduced = (monthlySavings * timeframe) / 1000; // in kg
  const treesEquivalent = Math.max(0, Math.floor(totalCarbonReduced / 20)); // ~20kg per tree
  const moneySaved = Math.max(0, Math.floor((monthlySavings * timeframe) * 0.005)); // rough monetary savings

  const handleSimulate = () => {
    setSimulationState("loading");
    
    setTimeout(() => {
      setSimulationState("result");
      const year = 2026 + (timeframe / 12);
      
      if (isDystopian) {
        setNarrative(`Based on your heavy reliance on personal vehicles and high energy use, by ${Math.floor(year)} the environment has suffered. Global temperatures continue to rise, and local air quality is heavily compromised by smog.`);
      } else if (isUtopian) {
        setNarrative(`Incredible work! By ${Math.floor(year)}, your sustainable choices have contributed to a lush, green urban environment. Clean air and thriving ecosystems are the norm.`);
      } else {
        setNarrative(`By ${Math.floor(year)}, your moderate efforts have helped stabilize the climate. However, continued commitment to reducing electricity usage and meat consumption is needed to reach a true green future.`);
      }
    }, 2500);
  };

  return (
    <div className="p-6 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Future Earth Simulator</h1>
        <p className="text-sm text-slate-400">Refined modeling of your lifestyle impacts.</p>
      </header>

      {/* Timeframe Toggles */}
      <div className="flex bg-white/5 rounded-xl p-1 mb-8 border border-glass-border" role="radiogroup" aria-label="Simulation Timeframe">
        {[
          { label: "1 Month", value: 1 },
          { label: "1 Year", value: 12 },
          { label: "5 Years", value: 60 }
        ].map(tf => (
          <button
            key={tf.value}
            role="radio"
            aria-checked={timeframe === tf.value}
            onClick={() => setTimeframe(tf.value)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              timeframe === tf.value ? "bg-purple-500 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {simulationState === "result" && (
        <div className="mb-8 animate-in zoom-in-95 fade-in duration-700" role="status" aria-live="polite">
          <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-4 shadow-2xl border border-white/10">
            <img src={currentImage} alt="Future Earth" loading="lazy" className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-xl font-bold text-white mb-1">
                {currentLabel}
              </h2>
              <div className="flex items-center gap-1 text-xs font-semibold text-purple-300 bg-purple-900/50 w-fit px-2 py-1 rounded-md backdrop-blur-md">
                <Planet size={14} /> AI Generated Vision
              </div>
            </div>
          </div>
          <div className="cyber-panel p-4 mb-4">
            <p className="text-sm text-slate-200 leading-relaxed italic">{narrative}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="cyber-panel p-3 text-center border-t-2 border-green-500">
              <p className="text-xs text-slate-400 mb-1">CO₂ Reduced</p>
              <p className="text-lg font-bold text-white">{totalCarbonReduced > 0 ? totalCarbonReduced.toFixed(0) : 0}<span className="text-xs">kg</span></p>
            </div>
            <div className="cyber-panel p-3 text-center border-t-2 border-emerald-500">
              <p className="text-xs text-slate-400 mb-1">Trees Eq.</p>
              <p className="text-lg font-bold text-white">{treesEquivalent}</p>
            </div>
            <div className="cyber-panel p-3 text-center border-t-2 border-yellow-500">
              <p className="text-xs text-slate-400 mb-1">Money Saved</p>
              <p className="text-lg font-bold text-white">${moneySaved}</p>
            </div>
          </div>

          <button 
            onClick={() => setSimulationState("idle")}
            className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-colors"
          >
            Tweak Habits
          </button>
        </div>
      )}

      <div className={`space-y-4 transition-all duration-500 ${simulationState === "result" ? "opacity-30 pointer-events-none hidden" : "opacity-100"}`}>
        
        <div className="cyber-panel p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white font-medium">
              <Car className="text-blue-400" weight="duotone" /> Drive to Work (Days/wk)
            </div>
            <span className="text-lg font-bold text-white">{commute}</span>
          </div>
          <input type="range" aria-label="Drive to work days per week" min="0" max="7" value={commute} onChange={e => setCommute(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
        </div>

        <div className="cyber-panel p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white font-medium">
              <Bus className="text-indigo-400" weight="duotone" /> Public Transit (Days/wk)
            </div>
            <span className="text-lg font-bold text-white">{publicTransport}</span>
          </div>
          <input type="range" aria-label="Public transit days per week" min="0" max="7" value={publicTransport} onChange={e => setPublicTransport(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"/>
        </div>

        <div className="cyber-panel p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white font-medium">
              <Plant className="text-orange-400" weight="duotone" /> Meat Meals (Per week)
            </div>
            <span className="text-lg font-bold text-white">{meat}</span>
          </div>
          <input type="range" aria-label="Meat meals per week" min="0" max="21" value={meat} onChange={e => setMeat(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"/>
        </div>

        <div className="cyber-panel p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white font-medium">
              <ShoppingBag className="text-pink-400" weight="duotone" /> Food Delivery (Per week)
            </div>
            <span className="text-lg font-bold text-white">{delivery}</span>
          </div>
          <input type="range" aria-label="Food delivery per week" min="0" max="10" value={delivery} onChange={e => setDelivery(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"/>
        </div>

        <div className="cyber-panel p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white font-medium">
              <Lightning className="text-yellow-400" weight="duotone" /> Electricity (kWh/mo)
            </div>
            <span className="text-lg font-bold text-white">{electricity}</span>
          </div>
          <input type="range" aria-label="Electricity usage in kWh" min="100" max="1000" step="50" value={electricity} onChange={e => setElectricity(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"/>
        </div>

        <button 
          onClick={handleSimulate}
          disabled={simulationState === "loading"}
          className="w-full py-4 cyber-button font-bold text-white flex justify-center items-center gap-2 mt-4"
        >
          {simulationState === "loading" ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>Generate Future Earth <ArrowRight size={20} /></>
          )}
        </button>
      </div>
    </div>
  );
}
