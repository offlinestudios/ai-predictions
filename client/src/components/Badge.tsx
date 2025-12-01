import { Crown, Zap, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type TierBadgeProps = {
  tier: "free" | "starter" | "pro" | "premium";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
};

export function TierBadge({ tier, size = "md", showLabel = true }: TierBadgeProps) {
  const configs = {
    free: {
      icon: Star,
      label: "Free",
      bgColor: "bg-gray-500/10",
      textColor: "text-gray-400",
      borderColor: "border-gray-500/20",
    },
    starter: {
      icon: TrendingUp,
      label: "Starter",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
      borderColor: "border-blue-500/20",
    },
    pro: {
      icon: Zap,
      label: "Pro",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
      borderColor: "border-purple-500/20",
    },
    premium: {
      icon: Crown,
      label: "Premium",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-400",
      borderColor: "border-amber-500/20",
    },
  };

  const config = configs[tier];
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      container: "px-2 py-0.5 text-xs gap-1",
      icon: "w-3 h-3",
    },
    md: {
      container: "px-2.5 py-1 text-sm gap-1.5",
      icon: "w-3.5 h-3.5",
    },
    lg: {
      container: "px-3 py-1.5 text-base gap-2",
      icon: "w-4 h-4",
    },
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold border",
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeClasses[size].container
      )}
    >
      <Icon className={sizeClasses[size].icon} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

type AchievementBadgeProps = {
  achievement: "first_prediction" | "streak_7" | "streak_30" | "predictions_10" | "predictions_50" | "predictions_100" | "deep_mode_master";
  size?: "sm" | "md" | "lg";
};

export function AchievementBadge({ achievement, size = "md" }: AchievementBadgeProps) {
  const achievements = {
    first_prediction: {
      label: "First Prediction",
      emoji: "🎯",
      bgColor: "bg-green-500/10",
      textColor: "text-green-400",
      borderColor: "border-green-500/20",
    },
    streak_7: {
      label: "7-Day Streak",
      emoji: "🔥",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-400",
      borderColor: "border-orange-500/20",
    },
    streak_30: {
      label: "30-Day Streak",
      emoji: "⚡",
      bgColor: "bg-red-500/10",
      textColor: "text-red-400",
      borderColor: "border-red-500/20",
    },
    predictions_10: {
      label: "10 Predictions",
      emoji: "🌟",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
      borderColor: "border-blue-500/20",
    },
    predictions_50: {
      label: "50 Predictions",
      emoji: "💫",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
      borderColor: "border-purple-500/20",
    },
    predictions_100: {
      label: "100 Predictions",
      emoji: "✨",
      bgColor: "bg-pink-500/10",
      textColor: "text-pink-400",
      borderColor: "border-pink-500/20",
    },
    deep_mode_master: {
      label: "Deep Mode Master",
      emoji: "🧠",
      bgColor: "bg-indigo-500/10",
      textColor: "text-indigo-400",
      borderColor: "border-indigo-500/20",
    },
  };

  const config = achievements[achievement];

  const sizeClasses = {
    sm: {
      container: "px-2 py-0.5 text-xs gap-1",
      emoji: "text-xs",
    },
    md: {
      container: "px-2.5 py-1 text-sm gap-1.5",
      emoji: "text-sm",
    },
    lg: {
      container: "px-3 py-1.5 text-base gap-2",
      emoji: "text-base",
    },
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold border",
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeClasses[size].container
      )}
      title={config.label}
    >
      <span className={sizeClasses[size].emoji}>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
}
