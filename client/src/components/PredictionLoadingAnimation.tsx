export default function PredictionLoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated Crystal Ball Container */}
      <div className="relative w-48 h-48 mb-6">
        {/* Outer Mystical Glow Rings */}
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" 
             style={{ animationDuration: '3s' }} />
        <div className="absolute inset-4 rounded-full bg-primary/15 animate-ping" 
             style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
        
        {/* Crystal Ball Base/Stand */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-12">
          <svg width="96" height="48" viewBox="0 0 96 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ornate Base */}
            <ellipse cx="48" cy="40" rx="40" ry="8" fill="url(#baseGradient)" opacity="0.8" />
            <path d="M 20 40 L 30 20 L 66 20 L 76 40 Z" fill="url(#standGradient)" stroke="url(#frameGradient)" strokeWidth="1.5" />
            
            <defs>
              <linearGradient id="baseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#581c87" />
                <stop offset="100%" stopColor="#3b0764" />
              </linearGradient>
              <linearGradient id="standGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="50%" stopColor="#6d28d9" />
                <stop offset="100%" stopColor="#5b21b6" />
              </linearGradient>
              <linearGradient id="frameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Main Crystal Ball */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-32">
          <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ball Shadow/Base */}
            <ellipse cx="64" cy="110" rx="50" ry="10" fill="rgba(88, 28, 135, 0.3)" className="blur-sm" />
            
            {/* Crystal Ball Sphere - Outer Glass */}
            <circle 
              cx="64" 
              cy="64" 
              r="58" 
              fill="url(#ballGradient)" 
              stroke="url(#glowGradient)" 
              strokeWidth="2"
              className="drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]"
            />
            
            {/* Inner Swirling Mist - Multiple Layers */}
            <g className="animate-spin" style={{ transformOrigin: '64px 64px', animationDuration: '8s' }}>
              <ellipse cx="64" cy="64" rx="40" ry="30" fill="url(#mistGradient1)" opacity="0.6" />
              <ellipse cx="64" cy="64" rx="35" ry="40" fill="url(#mistGradient2)" opacity="0.5" />
            </g>
            
            <g className="animate-spin" style={{ transformOrigin: '64px 64px', animationDuration: '6s', animationDirection: 'reverse' }}>
              <ellipse cx="64" cy="64" rx="30" ry="35" fill="url(#mistGradient3)" opacity="0.4" />
            </g>
            
            {/* Mystical Energy Core */}
            <circle 
              cx="64" 
              cy="64" 
              r="15" 
              fill="url(#coreGradient)" 
              className="animate-pulse"
              style={{ animationDuration: '2s' }}
            />
            
            {/* Glass Highlights */}
            <ellipse cx="50" cy="45" rx="20" ry="15" fill="rgba(255, 255, 255, 0.3)" className="blur-sm" />
            <ellipse cx="75" cy="50" rx="10" ry="8" fill="rgba(255, 255, 255, 0.2)" className="blur-sm" />
            
            {/* Sparkles Inside Ball */}
            <circle cx="45" cy="60" r="2" fill="#e879f9" className="animate-ping" style={{ animationDuration: '1.5s' }} />
            <circle cx="80" cy="65" r="1.5" fill="#c084fc" className="animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
            <circle cx="60" cy="75" r="2" fill="#a855f7" className="animate-ping" style={{ animationDuration: '1.8s', animationDelay: '0.6s' }} />
            <circle cx="70" cy="55" r="1.5" fill="#e879f9" className="animate-ping" style={{ animationDuration: '2.2s', animationDelay: '0.9s' }} />
            
            <defs>
              <radialGradient id="ballGradient">
                <stop offset="0%" stopColor="rgba(139, 92, 246, 0.2)" />
                <stop offset="50%" stopColor="rgba(124, 58, 237, 0.3)" />
                <stop offset="100%" stopColor="rgba(91, 33, 182, 0.5)" />
              </radialGradient>
              
              <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#e879f9" />
              </linearGradient>
              
              <radialGradient id="mistGradient1">
                <stop offset="0%" stopColor="rgba(232, 121, 249, 0.6)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.1)" />
              </radialGradient>
              
              <radialGradient id="mistGradient2">
                <stop offset="0%" stopColor="rgba(192, 132, 252, 0.5)" />
                <stop offset="100%" stopColor="rgba(124, 58, 237, 0.1)" />
              </radialGradient>
              
              <radialGradient id="mistGradient3">
                <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
                <stop offset="100%" stopColor="rgba(91, 33, 182, 0.1)" />
              </radialGradient>
              
              <radialGradient id="coreGradient">
                <stop offset="0%" stopColor="#e879f9" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.5)" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        
        {/* Floating Magical Particles Around Ball */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => {
            const angle = (i * 360) / 12;
            const radius = 70;
            const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
            
            return (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full animate-ping"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  background: i % 3 === 0 ? '#e879f9' : i % 3 === 1 ? '#c084fc' : '#a855f7',
                  animationDuration: `${1.5 + (i % 3) * 0.3}s`,
                  animationDelay: `${i * 0.15}s`,
                  opacity: 0.6,
                }}
              />
            );
          })}
        </div>
        
        {/* Floating Animation for Entire Ball */}
        <div 
          className="absolute inset-0 animate-bounce"
          style={{ 
            animationDuration: '3s',
            animationTimingFunction: 'ease-in-out'
          }}
        />
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
