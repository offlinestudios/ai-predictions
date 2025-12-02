import { Calendar, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface TrajectoryTimelineProps {
  predictionText: string;
  trajectoryType: "30day" | "90day" | "yearly" | "instant";
  confidenceScore?: number;
}

export function TrajectoryTimeline({ predictionText, trajectoryType, confidenceScore }: TrajectoryTimelineProps) {
  // Parse the prediction text to extract timeline phases
  const phases = extractTimelinePhases(predictionText, trajectoryType);
  
  if (trajectoryType === "instant") {
    // For instant predictions, just show the text without timeline
    return (
      <div className="space-y-4">
        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">{predictionText}</p>
        </div>
        {confidenceScore !== undefined && confidenceScore !== null && (
          <div className="flex items-center gap-2 pt-4 border-t border-purple-500/20">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">
              Confidence Score: <span className="text-purple-400 font-semibold">{confidenceScore}%</span>
            </span>
          </div>
        )}
      </div>
    );
  }

  const timelineConfig = {
    "30day": { icon: Clock, color: "from-purple-500 to-pink-500", label: "30-Day Path" },
    "90day": { icon: Calendar, color: "from-purple-500 to-blue-500", label: "90-Day Journey" },
    "yearly": { icon: TrendingUp, color: "from-purple-500 to-amber-500", label: "Yearly Trajectory" },
  };

  const config = timelineConfig[trajectoryType];
  const Icon = config.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-purple-500/20">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${config.color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{config.label}</h3>
          <p className="text-sm text-gray-400">Your personalized prediction timeline</p>
        </div>
      </div>

      {/* Timeline Phases */}
      {phases.length > 0 ? (
        <div className="space-y-6">
          {phases.map((phase, index) => (
            <div key={index} className="relative pl-8">
              {/* Timeline line */}
              {index < phases.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 to-transparent" />
              )}
              
              {/* Timeline dot */}
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                {phase.type === "milestone" && <CheckCircle2 className="w-3 h-3 text-white" />}
                {phase.type === "challenge" && <AlertCircle className="w-3 h-3 text-white" />}
                {phase.type === "phase" && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>

              {/* Phase content */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-purple-400">{phase.timeframe}</span>
                  {phase.type === "milestone" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                      Milestone
                    </span>
                  )}
                  {phase.type === "challenge" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Challenge
                    </span>
                  )}
                </div>
                <p className="text-gray-300 leading-relaxed">{phase.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Fallback: show full text if parsing fails
        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">{predictionText}</p>
        </div>
      )}

      {/* Confidence Score */}
      {confidenceScore !== undefined && confidenceScore !== null && (
        <div className="flex items-center gap-2 pt-4 border-t border-purple-500/20">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-gray-400">
            Confidence Score: <span className="text-purple-400 font-semibold">{confidenceScore}%</span>
          </span>
        </div>
      )}
    </div>
  );
}

// Helper function to extract timeline phases from prediction text
function extractTimelinePhases(text: string, trajectoryType: "30day" | "90day" | "yearly" | "instant") {
  const phases: Array<{ timeframe: string; content: string; type: "phase" | "milestone" | "challenge" }> = [];
  
  // Define patterns based on trajectory type
  const patterns = {
    "30day": [
      /Week\s+(\d+)\s*\(Days?\s+\d+-\d+\):?\s*([^\n]+(?:\n(?!Week\s+\d)[^\n]+)*)/gi,
      /Day\s+(\d+):?\s*([^\n]+)/gi,
      /Around\s+Day\s+(\d+):?\s*([^\n]+)/gi,
    ],
    "90day": [
      /Month\s+(\d+)\s*\(Days?\s+\d+-\d+\):?\s*([^\n]+(?:\n(?!Month\s+\d)[^\n]+)*)/gi,
      /Day\s+(\d+):?\s*([^\n]+)/gi,
      /Around\s+Day\s+(\d+):?\s*([^\n]+)/gi,
    ],
    "yearly": [
      /Q(\d+)\s*\(([^)]+)\):?\s*([^\n]+(?:\n(?!Q\d)[^\n]+)*)/gi,
      /Month\s+(\d+):?\s*([^\n]+)/gi,
      /Quarter\s+(\d+):?\s*([^\n]+)/gi,
    ],
  };

  const relevantPatterns = trajectoryType === "instant" ? [] : patterns[trajectoryType] || [];
  
  for (const pattern of relevantPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const timeframe = match[1] ? `${match[0].split(':')[0]}` : match[0];
      const content = match[2] || match[3] || match[1];
      
      // Determine phase type based on keywords
      let type: "phase" | "milestone" | "challenge" = "phase";
      const lowerContent = content.toLowerCase();
      if (lowerContent.includes("milestone") || lowerContent.includes("achievement") || lowerContent.includes("breakthrough")) {
        type = "milestone";
      } else if (lowerContent.includes("challenge") || lowerContent.includes("obstacle") || lowerContent.includes("warning")) {
        type = "challenge";
      }
      
      phases.push({
        timeframe: timeframe.trim(),
        content: content.trim(),
        type,
      });
    }
  }
  
  return phases;
}
