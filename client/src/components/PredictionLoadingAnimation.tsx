export default function PredictionLoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated Globe Container */}
      <div className="relative w-32 h-32 mb-6">
        {/* Outer Glow Ring */}
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        
        {/* Rotating Outer Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-spin" 
             style={{ animationDuration: '3s' }} />
        
        {/* Main Globe */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/40 to-primary/60 backdrop-blur-sm flex items-center justify-center animate-pulse">
          {/* Globe Image */}
          <img 
            src="/globe-logo.png" 
            alt="Generating prediction" 
            className="w-16 h-16 animate-spin-slow"
            style={{ animationDuration: '8s' }}
          />
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/60 rounded-full animate-float"
              style={{
                left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 8)}%`,
                top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 8)}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s',
              }}
            />
          ))}
        </div>
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
