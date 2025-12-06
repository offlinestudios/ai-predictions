export default function PredictionLoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated Logo Container */}
      <div className="relative w-32 h-32 mb-6">
        {/* Outer glow rings */}
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" 
             style={{ animationDuration: '2s' }} />
        <div className="absolute inset-4 rounded-full bg-primary/30 animate-ping" 
             style={{ animationDuration: '1.5s', animationDelay: '0.3s' }} />
        
        {/* Rotating logo */}
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
          <img src="/logo.svg" alt="Predicsure AI" className="w-24 h-24" />
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-float-1" />
        <div className="absolute bottom-0 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-float-2" />
        <div className="absolute top-1/2 right-0 w-2 h-2 bg-purple-400 rounded-full animate-float-3" />
      </div>
      
      {/* Loading Text */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground animate-pulse">
          Generating Your Prediction
        </h3>
        <p className="text-sm text-muted-foreground">
          The AI is analyzing your question and context...
        </p>
      </div>
    </div>
  );
}
