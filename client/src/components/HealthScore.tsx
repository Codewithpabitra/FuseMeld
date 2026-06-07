import { motion } from "framer-motion";
import type { HealthScore } from "@/types/index";

interface Props {
  health: HealthScore;
}

const scoreConfig = {
  Excellent: { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", ring: "#22c55e" },
  Good: { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", ring: "#eab308" },
  "Needs Attention": { color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", ring: "#f97316" },
  Critical: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", ring: "#ef4444" },
};

export default function HealthScore({ health }: Props) {
  const config = scoreConfig[health.label];

  // SVG circle progress
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - health.score) / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl border ${config.border} ${config.bg} p-5 mb-6`}
    >
      <div className="flex items-center gap-5">
        {/* Circular score */}
        <div className="relative shrink-0">
          <svg width="72" height="72" viewBox="0 0 72 72">
            {/* Background circle */}
            <circle
              cx="36" cy="36" r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              className="text-border"
            />
            {/* Progress circle */}
            <motion.circle
              cx="36" cy="36" r={radius}
              fill="none"
              stroke={config.ring}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: progress }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              style={{ transformOrigin: "center", rotate: "-90deg" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold font-mono ${config.color}`}>
              {health.score}
            </span>
          </div>
        </div>

        {/* Label + summary */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-semibold ${config.color}`}>
              {health.label}
            </span>
            <span className="text-xs text-muted-foreground">
              Issue Health Score
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {health.summary}
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border/50">
        <div className="text-center">
          <p className={`text-base font-semibold font-mono ${config.color}`}>
            {health.breakdown.duplicateRatio}%
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Duplicate ratio
          </p>
        </div>
        <div className="text-center">
          <p className={`text-base font-semibold font-mono ${config.color}`}>
            {health.breakdown.issueVolume}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Open issues
          </p>
        </div>
        <div className="text-center">
          <p className={`text-base font-semibold font-mono ${config.color}`}>
            {health.breakdown.clusterSeverity}%
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Avg similarity
          </p>
        </div>
      </div>
    </motion.div>
  );
}