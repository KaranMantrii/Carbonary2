import { useState, useRef, useEffect } from "react";
import { Camera, Scan as ScanIcon, WarningCircle, Leaf, HandPointing, Crosshair } from "@phosphor-icons/react";
import { useAppContext } from "../context/AppContext";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Vision() {
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const { setCarbonGenerated } = useAppContext();

  // Initialize camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setErrorMsg("");
    } catch (err) {
      console.error("Camera access denied:", err);
      setErrorMsg("Camera access denied or unavailable.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get base64 image
    const base64Image = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API key missing. Using simulation fallback.");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are a cyberpunk environmental scanner HUD. Analyze this image. Identify the primary object. 
      Return ONLY a raw JSON object (no markdown formatting, no code blocks) with the following exact keys:
      {
        "object": "Name of object",
        "carbonCost": 500, // integer, estimated CO2 grams to produce it
        "impact": "High", // 'Low', 'Medium', 'High', or 'Critical'
        "explanation": "Brief 1 sentence cyberpunk-style analysis of why it costs this much carbon.",
        "alternatives": ["Greener alternative 1", "Greener alternative 2"]
      }`;

      const imageParts = [{
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg"
        }
      }];

      const result = await model.generateContent([prompt, ...imageParts]);
      let responseText = result.response.text().trim();
      // Clean markdown if model ignores instructions
      if(responseText.startsWith('\`\`\`json')) {
         responseText = responseText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
      }
      
      const data = JSON.parse(responseText);
      
      const impactConfig = {
        Low: { color: "text-green-400", bg: "bg-green-500/20" },
        Medium: { color: "text-yellow-400", bg: "bg-yellow-500/20" },
        High: { color: "text-orange-400", bg: "bg-orange-500/20" },
        Critical: { color: "text-red-500", bg: "bg-red-500/20" },
      };
      
      const conf = impactConfig[data.impact] || impactConfig.Medium;

      setResult({
        object: data.object.toUpperCase(),
        impact: data.impact.toUpperCase(),
        impactColor: conf.color,
        impactBg: conf.bg,
        explanation: data.explanation,
        alternatives: data.alternatives,
        carbonCost: data.carbonCost
      });
      
      // Update global context (Scanning costs carbon)
      setCarbonGenerated(prev => prev + data.carbonCost);

    } catch (err) {
      console.error(err);
      // Fallback Simulation if API fails
      setResult({
        object: "UNIDENTIFIED ANOMALY",
        impact: "CRITICAL",
        impactColor: "text-red-500",
        impactBg: "bg-red-500/20",
        explanation: "API Connection severed. Simulated target acquired. Heavy carbon dense materials detected.",
        alternatives: ["Re-establish connection.", "Attempt manual override."],
        carbonCost: 999
      });
      setCarbonGenerated(prev => prev + 999);
    } finally {
      setIsScanning(false);
      stopCamera();
    }
  };

  const handleReset = () => {
    setResult(null);
    startCamera();
  };

  return (
    <div className="p-6 pt-12 pb-24 animate-in fade-in duration-500 min-h-screen">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 tracking-wider uppercase font-mono">Vision<span className="text-cyan-500">_OS</span></h1>
          <p className="text-xs text-cyan-400/80 font-mono tracking-widest uppercase">Target Acquisition Active</p>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
        </div>
      </header>

      {errorMsg && (
        <div className="mb-4 p-3 border border-red-500/50 bg-red-500/10 rounded-lg text-xs text-red-400 font-mono">
          [SYS_ERR]: {errorMsg}
        </div>
      )}

      {/* Hidden Canvas for capture */}
      <canvas ref={canvasRef} className="hidden"></canvas>

      {!result ? (
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative w-full aspect-[3/4] cyber-panel overflow-hidden">
            {/* Live Camera Feed */}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 mix-blend-screen"
            ></video>

            {/* Cyberpunk HUD Overlays */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 opacity-50">
                <Crosshair size={120} weight="thin" className={isScanning ? "animate-spin" : "animate-pulse"} />
              </div>
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400"></div>
            </div>

            {isScanning && (
              <div className="absolute inset-0 bg-cyan-500/20 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="w-full h-1 bg-cyan-400 shadow-[0_0_15px_rgba(0,243,255,1)] animate-[scan_1.5s_ease-in-out_infinite] absolute top-0"></div>
                <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase animate-pulse mt-12 bg-black/50 px-4 py-1 rounded">Processing Data Stream...</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleCapture}
            disabled={isScanning || !isCameraActive}
            className="w-full py-4 cyber-button text-lg disabled:opacity-50 disabled:cursor-not-allowed glitch-hover"
          >
            {isScanning ? "UPLINKING..." : "[ INITIATE SCAN ]"}
          </button>
        </div>
      ) : (
        <div className="animate-in zoom-in-95 fade-in duration-500">
          <div className="cyber-panel p-6 mb-6">
            <div className="mb-6 border-b border-white/10 pb-4">
              <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase mb-1">Target Identified</p>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-wider">{result.object}</h2>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm font-mono text-xs font-bold border border-current ${result.impactBg} ${result.impactColor}`}>
                <WarningCircle size={16} weight="fill" /> CLASS: {result.impact}
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">Carbon Penalty Applied</p>
              <p className="text-4xl font-mono text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">+{result.carbonCost}g</p>
            </div>
            
            <div className="p-4 bg-black/40 border-l-2 border-cyan-500 mb-6 font-mono text-sm text-slate-300 leading-relaxed">
              <span className="text-cyan-500 mr-2">{">"}</span>{result.explanation}
            </div>

            <h3 className="text-[10px] text-green-400 font-mono tracking-widest uppercase mb-3 flex items-center gap-2">
              <Leaf weight="fill" /> Mitigation Protocols
            </h3>
            <ul className="space-y-3 mb-2 font-mono text-xs">
              {result.alternatives.map((alt, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-400 bg-white/5 p-3 rounded-sm border border-white/5">
                  <div className="mt-1 w-1.5 h-1.5 bg-green-400 shrink-0 shadow-[0_0_5px_#4ade80]"></div>
                  {alt}
                </li>
              ))}
            </ul>
          </div>
          
          <button 
            onClick={handleReset}
            className="w-full py-4 bg-transparent border border-cyan-500/50 text-cyan-400 font-mono text-sm tracking-widest uppercase hover:bg-cyan-500/10 transition-colors"
          >
            [ DISMISS REPORT ]
          </button>
        </div>
      )}
    </div>
  );
}
