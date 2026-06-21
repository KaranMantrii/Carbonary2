export default function CyberLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-purple-400">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full animate-ping"></div>
        <div className="w-12 h-12 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-xs font-mono tracking-widest uppercase animate-pulse">Initializing...</p>
    </div>
  );
}
