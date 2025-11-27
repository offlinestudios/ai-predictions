export default function PredictionLoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated Globe Container */}
      <div className="relative w-40 h-40 mb-6">
        {/* Outer Glow Rings - Multiple layers for depth */}
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" 
             style={{ animationDuration: '2s' }} />
        <div className="absolute inset-2 rounded-full bg-primary/15 animate-ping" 
             style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
        
        {/* Rotating Globe Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/globe-logo.png" 
            alt="Generating prediction" 
            className="w-32 h-32 animate-spin-slow drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]"
            style={{ 
              animationDuration: '4s',
              animation: 'spin 4s linear infinite, pulse 2s ease-in-out infinite'
            }}
          />
        </div>
        
        {/* Orbiting Particles */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s' }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full"
              style={{
                left: `${50 + 45 * Math.cos((i * Math.PI * 2) / 6)}%`,
                top: `${50 + 45 * Math.sin((i * Math.PI * 2) / 6)}%`,
                transform: 'translate(-50%, -50%)',
                opacity: 0.6 + (i * 0.1),
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
