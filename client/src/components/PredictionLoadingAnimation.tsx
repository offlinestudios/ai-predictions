export default function PredictionLoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated Hourglass Container */}
      <div className="relative w-40 h-40 mb-6">
        {/* Outer Glow Rings */}
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" 
             style={{ animationDuration: '2s' }} />
        <div className="absolute inset-2 rounded-full bg-primary/15 animate-ping" 
             style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
        
        {/* Hourglass SVG */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]"
          >
            {/* Hourglass Frame - Top */}
            <path
              d="M 30 15 L 90 15 L 85 25 L 60 50 L 35 25 Z"
              fill="url(#glassGradient)"
              stroke="url(#frameGradient)"
              strokeWidth="2"
            />
            
            {/* Hourglass Frame - Bottom */}
            <path
              d="M 30 105 L 90 105 L 85 95 L 60 70 L 35 95 Z"
              fill="url(#glassGradient)"
              stroke="url(#frameGradient)"
              strokeWidth="2"
            />
            
            {/* Hourglass Frame - Middle Connection */}
            <line x1="60" y1="50" x2="60" y2="70" stroke="url(#frameGradient)" strokeWidth="2" />
            
            {/* Top Sand (depleting) */}
            <path
              d="M 38 25 L 82 25 L 75 35 L 60 45 L 45 35 Z"
              fill="url(#sandGradient)"
              opacity="0.8"
              className="animate-pulse"
              style={{ animationDuration: '1.5s' }}
            />
            
            {/* Bottom Sand (filling) */}
            <path
              d="M 38 95 L 82 95 L 82 100 L 38 100 Z"
              fill="url(#sandGradient)"
              className="animate-pulse"
              style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}
            />
            
            {/* Falling Sand Stream */}
            <rect
              x="58"
              y="50"
              width="4"
              height="20"
              fill="url(#sandStreamGradient)"
              className="animate-pulse"
              style={{ animationDuration: '0.8s' }}
            />
            
            {/* Cosmic Sparkles */}
            <circle cx="45" cy="30" r="2" fill="#a855f7" className="animate-ping" style={{ animationDuration: '1.5s' }} />
            <circle cx="75" cy="35" r="1.5" fill="#c084fc" className="animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
            <circle cx="50" cy="85" r="2" fill="#a855f7" className="animate-ping" style={{ animationDuration: '1.8s', animationDelay: '0.5s' }} />
            <circle cx="70" cy="90" r="1.5" fill="#c084fc" className="animate-ping" style={{ animationDuration: '2.2s', animationDelay: '0.7s' }} />
            
            {/* Gradients */}
            <defs>
              <linearGradient id="glassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(139, 92, 246, 0.1)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.05)" />
              </linearGradient>
              
              <linearGradient id="frameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              
              <linearGradient id="sandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e879f9" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              
              <linearGradient id="sandStreamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(232, 121, 249, 0.8)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.4)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Floating Cosmic Particles */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full animate-ping"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDuration: `${1.5 + Math.random() * 1}s`,
                animationDelay: `${Math.random() * 1}s`,
                opacity: 0.4 + Math.random() * 0.4,
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
