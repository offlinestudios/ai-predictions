import { useEffect, useState } from "react";

const loadingMessages = [
  "Analyzing your question...",
  "Consulting the AI oracle...",
  "Gathering cosmic insights...",
  "Generating your prediction...",
  "Almost there...",
];

export function PredictionLoader() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      {/* Animated Orb */}
      <div className="relative w-32 h-32">
        {/* Outer glow rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-20 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-30 animate-pulse" />
        
        {/* Main orb */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 shadow-2xl animate-spin-slow">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
        </div>
        
        {/* Center logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/logo.svg" alt="Predicsure AI" className="w-16 h-16 animate-pulse" />
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-float-1" />
        <div className="absolute bottom-0 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-float-2" />
        <div className="absolute top-1/2 right-0 w-2 h-2 bg-orange-400 rounded-full animate-float-3" />
      </div>

      {/* Loading text */}
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-foreground animate-fade-in">
          {loadingMessages[messageIndex]}
        </p>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
