import { useEffect, useRef } from 'react';

interface RadarChartProps {
  data: {
    risk_appetite?: number;
    emotional_reactivity?: number;
    time_consistency?: number;
    data_orientation?: number;
    volatility_tolerance?: number;
  };
  size?: number;
  color?: string;
}

// Labels for the radar chart dimensions
const DIMENSION_LABELS: Record<string, string> = {
  risk_appetite: "Risk Appetite",
  emotional_reactivity: "Emotional",
  time_consistency: "Consistency",
  data_orientation: "Data-Driven",
  volatility_tolerance: "Volatility"
};

export default function PersonalityRadarChart({ 
  data, 
  size = 200,
  color = "#8b5cf6"
}: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up high DPI canvas
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;

    // Get the dimensions we want to display
    const dimensions = ['risk_appetite', 'emotional_reactivity', 'time_consistency', 'data_orientation', 'volatility_tolerance'];
    const numPoints = dimensions.length;
    const angleStep = (Math.PI * 2) / numPoints;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw background circles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw axis lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '10px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const labelRadius = radius + 20;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;
      
      ctx.fillText(DIMENSION_LABELS[dimensions[i]] || dimensions[i], x, y);
    }

    // Draw data polygon
    const values = dimensions.map(dim => {
      const val = data[dim as keyof typeof data];
      return typeof val === 'number' ? val : 0.5;
    });

    // Fill polygon
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const value = values[i];
      const x = centerX + Math.cos(angle) * radius * value;
      const y = centerY + Math.sin(angle) * radius * value;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();

    // Create gradient fill
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, `${color}40`);
    gradient.addColorStop(1, `${color}20`);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw polygon outline
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw data points
    ctx.fillStyle = color;
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const value = values[i];
      const x = centerX + Math.cos(angle) * radius * value;
      const y = centerY + Math.sin(angle) * radius * value;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow effect
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = `${color}40`;
      ctx.fill();
      ctx.fillStyle = color;
    }

  }, [data, size, color]);

  return (
    <div className="flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        style={{ width: size, height: size }}
        className="max-w-full"
      />
    </div>
  );
}

// Alternative: Simple bar-based visualization for mobile
export function PersonalityBars({ 
  data,
  color = "#8b5cf6"
}: { 
  data: RadarChartProps['data'];
  color?: string;
}) {
  const dimensions = [
    { key: 'risk_appetite', label: 'Risk Appetite' },
    { key: 'emotional_reactivity', label: 'Emotional Intensity' },
    { key: 'time_consistency', label: 'Consistency' },
    { key: 'data_orientation', label: 'Data-Driven' },
    { key: 'volatility_tolerance', label: 'Volatility Comfort' },
  ];

  return (
    <div className="space-y-3">
      {dimensions.map(({ key, label }) => {
        const value = data[key as keyof typeof data] ?? 0.5;
        const percentage = Math.round(value * 100);
        
        return (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{percentage}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: color
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
