import { motion } from "framer-motion";
import type { AnalysisDiff } from "@/types/index";

interface Props {
  diff: AnalysisDiff;
}

const Delta = ({
  value,
  label,
  inverse = false,
}: {
  value: number;
  label: string;
  inverse?: boolean;
}) => {
  // inverse = true means positive number is bad (more clusters = bad)
  const isPositive = value > 0;
  const isBad = inverse ? isPositive : !isPositive && value !== 0;
  const isGood = inverse ? !isPositive && value !== 0 : isPositive;

  const color =
    value === 0
      ? "text-muted-foreground"
      : isGood
        ? "text-green-500"
        : isBad
          ? "text-red-500"
          : "text-muted-foreground";

  const prefix = value > 0 ? "+" : "";

  return (
    <div className="text-center">
      <p className={`text-base font-semibold font-mono ${color}`}>
        {value === 0 ? "—" : `${prefix}${value}`}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
};

export default function AnalysisDiff({ diff }: Props) {
  if (!diff.hasChanges) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-border bg-muted/40 px-5 py-3 mb-4 flex items-center gap-3"
      >
        <span className="text-sm">✅</span>
        <p className="text-xs text-muted-foreground">
          No changes since last analysis{" "}
          <span className="font-medium text-foreground">
            {timeAgo(diff.previousAnalyzedAt)}
          </span>
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border bg-card p-5 mb-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm">📊</span>
        <p className="text-xs font-medium text-foreground">
          Changes since last analysis
        </p>
        <span className="text-xs text-muted-foreground ml-auto">
          {timeAgo(diff.previousAnalyzedAt)}
        </span>
      </div>

      {/* Deltas grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Delta value={diff.issuesDelta} label="Issues" inverse={true} />
        <Delta value={diff.clustersDelta} label="Clusters" inverse={true} />
        <Delta
          value={-diff.resolvedClusters}
          label="Resolved"
          inverse={false}
        />
        <Delta value={diff.newClusters} label="New clusters" inverse={true} />
        <Delta
          value={diff.avgSimilarityDelta}
          label="Avg similarity %"
          inverse={true}
        />
      </div>

      {/* Summary sentence */}
      <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
        {buildSummary(diff)}
      </p>
    </motion.div>
  );
}

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
};

const buildSummary = (diff: AnalysisDiff): string => {
  const parts: string[] = [];

  if (diff.issuesDelta > 0) parts.push(`${diff.issuesDelta} new issues opened`);
  else if (diff.issuesDelta < 0)
    parts.push(`${Math.abs(diff.issuesDelta)} issues closed`);

  if (diff.resolvedClusters > 0)
    parts.push(
      `${diff.resolvedClusters} duplicate cluster${diff.resolvedClusters > 1 ? "s" : ""} resolved`,
    );

  if (diff.newClusters > 0)
    parts.push(
      `${diff.newClusters} new duplicate cluster${diff.newClusters > 1 ? "s" : ""} appeared`,
    );

  if (diff.avgSimilarityDelta > 0)
    parts.push(`average similarity increased by ${diff.avgSimilarityDelta}%`);
  else if (diff.avgSimilarityDelta < 0)
    parts.push(
      `average similarity decreased by ${Math.abs(diff.avgSimilarityDelta)}%`,
    );

  return parts.length > 0 ? parts.join(" · ") + "." : "Minor changes detected.";
};
