import { useState, useRef, useEffect, useCallback } from "react";
import { PaperPlaneRight, Robot } from "@phosphor-icons/react";

export default function Coach() {
  const [messages, setMessages] = useState([
    { id: crypto.randomUUID(), text: "Hi! I'm your Carbon Coach. Ready to plan some eco-friendly changes this week?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const timeoutRef = useRef(null);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: crypto.randomUUID(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Mock Gemini API Response
    timeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "That's a great goal! Taking the train instead of driving for your weekend trip can reduce your footprint by about 75%.",
        "Interesting point. Did you know a plant-based meal saves roughly 2kg of CO2 compared to a beef burger?",
        "I can help you track that. Small habits compound into massive environmental savings!",
        "Excellent idea. Let me know how that goes."
      ];
      setMessages((prev) => [
        ...prev,
        { 
          id: crypto.randomUUID(), 
          text: responses[Math.floor(Math.random() * responses.length)], 
          sender: "bot" 
        }
      ]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <header className="p-6 pb-4 border-b border-glass-border bg-glass backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <Robot size={24} weight="duotone" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Carbon Coach</h1>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[80%] p-4 rounded-2xl ${
                msg.sender === "user" 
                  ? "bg-purple-600 text-white rounded-tr-sm" 
                  : "cyber-panel text-slate-200 rounded-tl-sm"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="cyber-panel p-4 rounded-2xl rounded-tl-sm w-16 flex justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900/80 backdrop-blur-lg border-t border-glass-border pb-safe">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your coach anything..."
            aria-label="Type a message"
            className="w-full bg-white/5 border border-glass-border rounded-full py-3 pl-5 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
          />
          <button 
            type="submit"
            aria-label="Send message"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
          >
            <PaperPlaneRight size={16} weight="fill" />
          </button>
        </form>
      </div>
    </div>
  );
}
