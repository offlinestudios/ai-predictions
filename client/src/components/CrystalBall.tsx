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
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-sm" />
      
      {/* Main globe sphere with gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-primary/40 to-primary/60 border-2 border-primary/50 shadow-lg shadow-primary/20" />
      
      {/* Highlight (top-left shine) */}
      <div className="absolute top-[12%] left-[18%] w-[30%] h-[30%] rounded-full bg-gradient-to-br from-white/25 to-transparent blur-[2px]" />
      
      {/* Bold continent outlines - Americas and Africa/Europe view */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}
      >
        {/* North America - bold, recognizable shape */}
        <path 
          d="M 15 20 Q 12 18 10 22 L 8 28 Q 10 32 12 35 L 18 38 Q 22 40 26 38 L 30 35 Q 32 32 33 28 L 35 24 Q 34 20 30 18 L 25 17 Q 20 18 15 20 Z
             M 28 30 Q 26 32 24 30 Q 26 28 28 30 Z" 
          fill="currentColor" 
          opacity="0.75"
          className="text-secondary"
        />
        
        {/* Central America */}
        <path 
          d="M 26 42 L 28 45 Q 29 47 27 48 L 25 47 Q 24 45 26 42 Z" 
          fill="currentColor" 
          opacity="0.75"
          className="text-secondary"
        />
        
        {/* South America - distinctive shape */}
        <path 
          d="M 25 50 Q 23 52 24 56 L 26 62 Q 28 68 30 72 Q 32 75 34 73 L 36 68 Q 37 62 36 56 L 35 52 Q 33 48 30 48 Q 27 48 25 50 Z" 
          fill="currentColor" 
          opacity="0.75"
          className="text-secondary"
        />
        
        {/* Africa - bold recognizable shape */}
        <path 
          d="M 48 28 Q 46 30 46 34 L 47 40 Q 48 46 50 52 L 52 58 Q 54 64 56 68 Q 58 72 60 70 L 62 65 Q 63 60 62 54 L 60 46 Q 58 38 56 32 L 54 28 Q 52 26 50 26 Q 48 26 48 28 Z" 
          fill="currentColor" 
          opacity="0.75"
          className="text-secondary"
        />
        
        {/* Europe - upper right */}
        <path 
          d="M 52 18 Q 50 20 52 22 L 56 24 Q 60 25 64 24 L 68 22 Q 70 20 68 18 L 64 17 Q 58 16 52 18 Z" 
          fill="currentColor" 
          opacity="0.75"
          className="text-secondary"
        />
        
        {/* Greenland/Iceland */}
        <path 
          d="M 38 12 Q 36 14 38 16 L 42 17 Q 44 16 44 14 Q 42 12 38 12 Z" 
          fill="currentColor" 
          opacity="0.7"
          className="text-secondary"
        />
        
        {/* Latitude lines for depth */}
        <ellipse cx="50" cy="50" rx="47" ry="20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.12" className="text-secondary" />
        <ellipse cx="50" cy="50" rx="47" ry="35" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.12" className="text-secondary" />
      </svg>
      
      {/* Trophy/pedestal base */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full"
      >
        {/* Base stand */}
        <path 
          d="M 35 85 L 38 92 L 62 92 L 65 85 Z" 
          fill="currentColor" 
          opacity="0.6"
          className="text-primary"
        />
        {/* Stem */}
        <path 
          d="M 45 75 L 42 85 L 58 85 L 55 75 Z" 
          fill="currentColor" 
          opacity="0.5"
          className="text-primary"
        />
      </svg>
      
      {/* Bottom shadow (gives sphere depth) */}
      <div className="absolute bottom-[8%] left-[20%] right-[20%] h-[15%] bg-gradient-to-t from-black/30 to-transparent rounded-full blur-sm" />
    </div>
  );
}
