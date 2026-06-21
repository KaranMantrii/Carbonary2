import { useState, useEffect, useRef, useCallback } from "react";
import { Footprints, Desktop, Lightning, Leaf, Play, WarningCircle, Info } from "@phosphor-icons/react";
import { useAppContext } from "../context/AppContext";

export default function Activity() {
  const { steps, setSteps, screenTimeMinutes, setScreenTimeMinutes, setCarbonSaved, setCarbonGenerated, addXp } = useAppContext();
  
  // Pedometer State
  const [isTracking, setIsTracking] = useState(false);
  const [motionError, setMotionError] = useState("");
  const lastStepTime = useRef(0);
  
  // Screen Time State
  const [inputHours, setInputHours] = useState(Math.floor(screenTimeMinutes / 60));
  const [inputMinutes, setInputMinutes] = useState(screenTimeMinutes % 60);

  // Manual Steps State
  const [manualSteps, setManualSteps] = useState("");

  // Carbon Math for Steps
  const carbonSavedGrams = (steps * 0.13).toFixed(1);
  const smartphoneCharges = Math.floor((steps * 0.13) / 8);

  // Carbon Math for Screen Time
  // Average digital usage emits ~1g CO2 per minute (server + device power).
  const screenCarbonFootprint = screenTimeMinutes * 1; 
  // 1 kettle boil = approx 15 grams CO2
  const kettlesEquivalent = Math.floor(screenCarbonFootprint / 15);

  const handleDeviceMotion = useCallback((event) => {
    // Simple peak detection for step counting
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;
    
    // Calculate vector magnitude
    const magnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
    
    // Roughly 9.8 is gravity. A spike > 12 usually indicates a step/jolt.
    if (magnitude > 12) {
      const now = Date.now();
      // Debounce: minimum 300ms between steps
      if (now - lastStepTime.current > 300) {
        setSteps(prev => prev + 1);
        setCarbonSaved(prev => prev + 0.13); // 0.13g saved per step
        lastStepTime.current = now;
      }
    }
  }, [setSteps, setCarbonSaved]);

  const startTracking = async () => {
    // Request permission for iOS 13+ devices
    if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        const permissionState = await DeviceMotionEvent.requestPermission();
        if (permissionState === "granted") {
          window.addEventListener("devicemotion", handleDeviceMotion);
          setIsTracking(true);
          setMotionError("");
        } else {
          setMotionError("Permission denied for motion sensors.");
        }
      } catch (error) {
        console.error(error);
        setMotionError("Error requesting motion permission.");
      }
    } else if ("DeviceMotionEvent" in window) {
      // Non iOS 13+ devices
      window.addEventListener("devicemotion", handleDeviceMotion);
      setIsTracking(true);
      setMotionError("");
    } else {
      setMotionError("Device motion not supported on this device/browser.");
    }
  };

  const stopTracking = () => {
    window.removeEventListener("devicemotion", handleDeviceMotion);
    setIsTracking(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener("devicemotion", handleDeviceMotion);
    };
  }, [handleDeviceMotion]);

  const handleScreenTimeUpdate = () => {
    let hours = parseInt(inputHours) || 0;
    let minutes = parseInt(inputMinutes) || 0;
    
    // Validation
    hours = Math.max(0, Math.min(24, hours));
    minutes = Math.max(0, Math.min(59, minutes));
    
    setInputHours(hours);
    setInputMinutes(minutes);

    const totalMinutes = hours * 60 + minutes;
    setScreenTimeMinutes(totalMinutes);
    // 1g CO2 per minute of screen time
    setCarbonGenerated(totalMinutes * 1);
    addXp(10); // Reward for logging
  };

  return (
    <div className="p-6 pt-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Live Activity</h1>
        <p className="text-sm text-slate-400">Your real-time movement and digital habits.</p>
      </header>

      <div className="space-y-6">
        {/* Pedometer */}
        <div className="cyber-panel p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                <Footprints size={28} weight="duotone" />
              </div>
              <div>
                <p className="text-2xl font-mono text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">{steps.toLocaleString()}</p>
                <p className="text-[10px] text-cyan-500/80 uppercase tracking-widest font-mono">[STEPS_TODAY]</p>
              </div>
            </div>
            {isTracking ? (
              <div className="flex items-center gap-2" role="status" aria-live="polite">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-xs text-green-400 font-medium">Tracking</span>
              </div>
            ) : (
               <button 
                onClick={startTracking}
                className="bg-white/10 hover:bg-white/20 border border-white/20 p-2 rounded-lg text-white transition-colors flex items-center gap-1 text-xs"
              >
                <Play size={14} weight="fill"/> Auto Track
              </button>
            )}
          </div>

          {/* Manual Step Input */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="manual-steps-input" className="text-xs text-slate-400 block mb-1">Add Steps Manually</label>
              <input 
                type="number" 
                min="0"
                placeholder="e.g. 500"
                id="manual-steps-input"
                value={manualSteps}
                onChange={(e) => setManualSteps(e.target.value)}
                className="w-full bg-white/5 border border-glass-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500/50"
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={() => {
                  const val = Math.min(100000, Math.max(0, parseInt(manualSteps) || 0));
                  if(val > 0) {
                    setSteps(prev => prev + val);
                    setCarbonSaved(prev => prev + (val * 0.13));
                    setManualSteps("");
                    addXp(5);
                  }
                }}
                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {motionError && (
            <div className="mb-4 text-xs text-red-400 flex items-center gap-1 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
              <WarningCircle size={16} /> {motionError}
            </div>
          )}
          
          <div className="bg-white/5 rounded-xl p-4 border border-glass-border">
            <h2 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Leaf size={16} className="text-green-400" /> Carbon Saved
            </h2>
            <p className="text-2xl font-bold text-green-400 mb-1">{carbonSavedGrams}g CO₂</p>
            <p className="text-sm text-slate-400">
              Equivalent to charging your smartphone <strong className="text-white">{smartphoneCharges} times</strong>!
            </p>
          </div>
        </div>

        {/* Screen Time Input */}
        <div className="cyber-panel p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Desktop size={28} weight="duotone" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Info className="text-blue-400 shrink-0" size={16} weight="duotone" /> Screen Time Tracker</h2>
              <p className="text-sm text-slate-300">Enter your usage today</p>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="input-hours" className="text-xs text-slate-400 block mb-1">Hours</label>
              <input 
                id="input-hours"
                type="number" 
                min="0"
                max="24"
                value={inputHours}
                onChange={(e) => setInputHours(e.target.value)}
                className="w-full bg-white/5 border border-glass-border rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="input-minutes" className="text-xs text-slate-400 block mb-1">Minutes</label>
              <input 
                id="input-minutes"
                type="number" 
                min="0"
                max="59"
                value={inputMinutes}
                onChange={(e) => setInputMinutes(e.target.value)}
                className="w-full bg-white/5 border border-glass-border rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={handleScreenTimeUpdate}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                Update
              </button>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-glass-border">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Lightning size={16} className="text-orange-400" /> Digital Carbon Footprint
            </h3>
            <p className="text-2xl font-bold text-orange-400 mb-1">{screenCarbonFootprint}g CO₂</p>
            <p className="text-sm text-slate-400">
              Your screen time today has generated emissions equivalent to boiling a kettle <strong className="text-white">{kettlesEquivalent} times</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
