import { useState, useRef } from "react";
import { Camera, UploadSimple, Receipt, Leaf, WarningCircle, Question } from "@phosphor-icons/react";
import { useAppContext } from "../context/AppContext";

export default function Scan() {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const { addXp } = useAppContext();

  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsScanning(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const response = await fetch(`${API_URL}/scan-receipt/`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to process receipt. Make sure the Python backend is running.");
        }

        const data = await response.json();
        
        let totalXp = 0;
        const processedItems = data.items.map(item => {
          totalXp += item.xp;
          let iconProps;
          
          if (item.impact === "low" || item.icon === "eco") {
            iconProps = { icon: Leaf, color: "text-green-400", bg: "bg-green-500/20", ecoText: "Excellent" };
          } else if (item.impact === "high" || item.icon === "warning") {
            iconProps = { icon: WarningCircle, color: "text-orange-400", bg: "bg-orange-500/20", ecoText: "High Impact" };
          } else {
            iconProps = { icon: Question, color: "text-blue-400", bg: "bg-blue-500/20", ecoText: "Neutral" };
          }

          return {
            item: item.name,
            eco: iconProps.ecoText,
            icon: iconProps.icon,
            color: iconProps.color,
            bg: iconProps.bg,
            xp: item.xp
          };
        });

        setResults(processedItems);
        addXp(totalXp);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsScanning(false);
      }
    }
  };

  return (
    <div className="p-6 pt-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Scan Receipt</h1>
        <p className="text-sm text-slate-400">Discover the hidden impact of your purchases</p>
      </header>

      {!results ? (
        <div className="flex flex-col items-center justify-center space-y-6 mt-12">
          {error && (
            <div role="alert" className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-4 rounded-xl text-center w-full max-w-md">
              {error}
            </div>
          )}

          <div className="relative">
            {/* Animated scanning ring */}
            {isScanning && (
              <div className="absolute inset-0 rounded-3xl border-2 border-purple-500 animate-ping opacity-20"></div>
            )}
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              aria-label={isScanning ? "Analyzing receipt" : "Tap to scan receipt"}
              className="relative w-48 h-64 cyber-panel flex flex-col items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all overflow-hidden"
            >
              {isScanning ? (
                <>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
                  <Receipt size={48} weight="duotone" className="animate-pulse text-purple-400 mb-4" />
                  <span className="font-medium">Analyzing...</span>
                </>
              ) : (
                <>
                  <Camera size={48} weight="duotone" className="mb-4 text-purple-400" />
                  <span className="font-medium">Tap to Scan</span>
                </>
              )}
            </button>
          </div>
          
          <div className="flex items-center gap-4 w-full max-w-[200px]">
            <div className="h-px bg-glass-border flex-1"></div>
            <span className="text-xs text-slate-500 uppercase tracking-wider">or</span>
            <div className="h-px bg-glass-border flex-1"></div>
          </div>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-glass-border bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
          >
            <UploadSimple size={20} weight="duotone" />
            Upload Image
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            aria-label="Upload receipt image"
            onChange={handleFileUpload}
          />
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-8 fade-in duration-500">
          <h2 className="text-lg font-semibold mb-4 text-white">Impact Insights</h2>
          <div className="space-y-3">
            {results.map((res, idx) => (
              <div key={`${res.item}-${idx}`} className="cyber-panel p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${res.bg} flex items-center justify-center ${res.color}`}>
                    <res.icon size={20} weight="duotone" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{res.item}</p>
                    <p className="text-xs text-slate-400">Sustainability: {res.eco}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full border border-glass-border text-xs font-semibold ${res.color}`}>
                  +{res.xp} XP
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setResults(null)}
            className="w-full mt-8 py-4 cyber-button font-bold text-white"
          >
            Scan Another
          </button>
        </div>
      )}
    </div>
  );
}
