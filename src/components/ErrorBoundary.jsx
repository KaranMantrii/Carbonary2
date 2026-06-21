import React from "react";
import { WarningCircle } from "@phosphor-icons/react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-red-500 mb-4 animate-pulse">
            <WarningCircle size={64} weight="duotone" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">SYSTEM FAILURE</h1>
          <p className="text-sm text-slate-400 mb-6 max-w-md">
            A critical error occurred in the simulation. The anomaly has been logged.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/30 transition-colors font-mono uppercase text-sm tracking-wider"
          >
            Reboot System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
