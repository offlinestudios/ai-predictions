interface CrystalBallProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

export function CrystalBall({ size = "md", className = "" }: CrystalBallProps) {
  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <svg 
        viewBox="0 0 100 140" 
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
      >
        {/* Globe circle outline */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary" opacity="0.8" />
        
        {/* Globe background with gradient */}
        <defs>
          <radialGradient id="globeGrad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" className="text-primary" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" className="text-primary" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#globeGrad)" />
        
        {/* Highlight shine */}
        <ellipse cx="38" cy="35" rx="15" ry="18" fill="white" opacity="0.2" />
        
        {/* BOLD Continents - High contrast, filled shapes matching reference */}
        
        {/* Greenland/Arctic */}
        <path 
          d="M 35 10 Q 30 12 28 16 L 30 20 Q 33 22 38 21 L 42 18 Q 43 14 40 11 Q 37 9 35 10 Z" 
          fill="currentColor" 
          opacity="0.85"
          className="text-secondary"
        />
        
        {/* North America - Very bold and recognizable */}
        <path 
          d="M 15 25 Q 10 27 8 32 L 7 38 Q 9 44 14 48 L 20 52 Q 25 54 30 52 L 35 48 Q 38 44 39 38 L 40 32 Q 39 27 35 24 L 30 22 Q 25 21 20 23 Q 17 24 15 25 Z
             M 28 35 Q 26 37 24 35 Q 26 33 28 35 Z
             M 20 42 Q 18 44 16 42 Q 18 40 20 42 Z" 
          fill="currentColor" 
          opacity="0.9"
          className="text-secondary"
        />
        
        {/* Central America/Caribbean */}
        <path 
          d="M 26 55 L 28 58 Q 29 60 27 61 L 24 60 Q 23 58 24 56 Z" 
          fill="currentColor" 
          opacity="0.85"
          className="text-secondary"
        />
        
        {/* South America - Bold triangular shape */}
        <path 
          d="M 25 63 Q 22 66 23 72 L 25 80 Q 27 87 30 92 Q 33 96 36 94 L 39 88 Q 41 80 40 72 L 38 65 Q 36 61 32 61 Q 28 61 25 63 Z" 
          fill="currentColor" 
          opacity="0.9"
          className="text-secondary"
        />
        
        {/* Africa - Large bold shape */}
        <path 
          d="M 52 32 Q 49 35 49 40 L 50 48 Q 52 56 54 64 L 56 72 Q 58 80 61 86 Q 64 91 67 88 L 70 82 Q 72 74 71 66 L 69 56 Q 67 46 64 38 L 61 32 Q 58 29 55 29 Q 52 29 52 32 Z" 
          fill="currentColor" 
          opacity="0.9"
          className="text-secondary"
        />
        
        {/* Europe - Upper portion */}
        <path 
          d="M 55 20 Q 52 23 54 26 L 58 29 Q 63 31 68 30 L 73 27 Q 76 24 74 21 L 70 19 Q 63 17 55 20 Z" 
          fill="currentColor" 
          opacity="0.85"
          className="text-secondary"
        />
        
        {/* Asia (partial - right edge) */}
        <path 
          d="M 75 30 Q 73 33 74 38 L 77 45 Q 80 50 83 52 Q 85 50 86 46 L 87 40 Q 86 35 83 32 Q 80 29 75 30 Z" 
          fill="currentColor" 
          opacity="0.8"
          className="text-secondary"
        />
        
        {/* Australia (bottom right) */}
        <path 
          d="M 78 68 Q 76 71 78 74 L 82 76 Q 86 75 88 72 Q 89 69 86 67 Q 82 66 78 68 Z" 
          fill="currentColor" 
          opacity="0.8"
          className="text-secondary"
        />
        
        {/* Trophy/Hands Base - Prominent silhouette */}
        {/* Left hand/arm */}
        <path 
          d="M 20 95 Q 15 98 12 105 L 10 115 Q 12 120 18 122 L 25 123 Q 30 122 35 118 L 40 112 Q 42 108 40 102 L 35 98 Q 30 96 25 97 Z" 
          fill="currentColor" 
          opacity="0.7"
          className="text-primary"
        />
        
        {/* Right hand/arm */}
        <path 
          d="M 80 95 Q 85 98 88 105 L 90 115 Q 88 120 82 122 L 75 123 Q 70 122 65 118 L 60 112 Q 58 108 60 102 L 65 98 Q 70 96 75 97 Z" 
          fill="currentColor" 
          opacity="0.7"
          className="text-primary"
        />
        
        {/* Center pedestal/stem */}
        <path 
          d="M 42 100 L 40 110 L 38 125 L 35 135 L 65 135 L 62 125 L 60 110 L 58 100 Z" 
          fill="currentColor" 
          opacity="0.65"
          className="text-primary"
        />
        
        {/* Base platform */}
        <path 
          d="M 30 135 L 28 140 L 72 140 L 70 135 Z" 
          fill="currentColor" 
          opacity="0.75"
          className="text-primary"
        />
      </svg>
    </div>
  );
}
