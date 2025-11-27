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
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-primary/50 to-primary/70 border border-primary/40 shadow-lg shadow-primary/20" />
      
      {/* Highlight (top-left shine) */}
      <div className="absolute top-[15%] left-[20%] w-[35%] h-[35%] rounded-full bg-gradient-to-br from-white/30 to-transparent blur-[2px]" />
      
      {/* Continent outlines - simplified stylized continents */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}
      >
        {/* Latitude/longitude grid lines */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15" className="text-secondary" />
        <ellipse cx="50" cy="50" rx="48" ry="24" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15" className="text-secondary" />
        <ellipse cx="50" cy="50" rx="48" ry="12" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" className="text-secondary" />
        <line x1="50" y1="2" x2="50" y2="98" stroke="currentColor" strokeWidth="0.5" opacity="0.1" className="text-secondary" />
        
        {/* Stylized continents - abstract shapes */}
        {/* North America */}
        <path 
          d="M 20 25 Q 18 28 20 32 L 25 35 Q 28 33 30 30 L 32 25 Q 30 22 25 23 Z" 
          fill="currentColor" 
          opacity="0.4"
          className="text-secondary"
        />
        
        {/* South America */}
        <path 
          d="M 28 40 Q 26 45 28 52 Q 30 55 32 52 L 33 45 Q 32 42 30 41 Z" 
          fill="currentColor" 
          opacity="0.4"
          className="text-secondary"
        />
        
        {/* Europe/Africa */}
        <path 
          d="M 45 20 Q 48 22 52 20 L 55 25 Q 56 30 54 35 L 52 42 Q 50 48 48 52 Q 46 55 44 52 L 42 45 Q 43 38 45 35 L 46 28 Q 45 24 45 20 Z" 
          fill="currentColor" 
          opacity="0.4"
          className="text-secondary"
        />
        
        {/* Asia */}
        <path 
          d="M 58 18 Q 62 20 68 22 L 72 28 Q 74 35 72 40 L 68 45 Q 65 42 62 40 L 60 35 Q 58 30 58 25 Z" 
          fill="currentColor" 
          opacity="0.4"
          className="text-secondary"
        />
        
        {/* Australia */}
        <path 
          d="M 70 55 Q 72 58 75 58 Q 78 56 78 53 Q 76 50 72 52 Z" 
          fill="currentColor" 
          opacity="0.4"
          className="text-secondary"
        />
      </svg>
      
      {/* Bottom shadow (gives sphere depth) */}
      <div className="absolute bottom-0 left-[15%] right-[15%] h-[20%] bg-gradient-to-t from-black/20 to-transparent rounded-full blur-sm" />
    </div>
  );
}
