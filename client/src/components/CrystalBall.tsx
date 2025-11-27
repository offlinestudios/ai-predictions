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

const dotSizeClasses = {
  sm: "w-1 h-1",
  md: "w-1.5 h-1.5",
  lg: "w-2 h-2",
  xl: "w-3 h-3",
};

export function CrystalBall({ size = "md", className = "" }: CrystalBallProps) {
  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-primary/30 blur-md" />
      
      {/* Main sphere with gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 via-primary/60 to-primary border-2 border-primary/50 shadow-lg shadow-primary/30" />
      
      {/* Highlight */}
      <div className="absolute top-[20%] left-[25%] w-[30%] h-[30%] rounded-full bg-gradient-to-br from-white/40 to-transparent blur-[1px]" />
      
      {/* Center dot (mystical core) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`${dotSizeClasses[size]} rounded-full bg-secondary shadow-lg shadow-secondary/50`} />
      </div>
    </div>
  );
}
