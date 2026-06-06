import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import IssueCard from "./IssueCard";
import type { DuplicateCluster as DuplicateClusterType } from "@/types/index";

interface Props {
  cluster: DuplicateClusterType;
  index: number;
}

export default function DuplicateCluster({ cluster, index }: Props) {
  const [expanded, setExpanded] = useState(index === 0);

  const scorePercent = Math.round(cluster.similarityScore * 100);
  const scoreColor =
    scorePercent >= 92
      ? "text-destructive"
      : scorePercent >= 85
        ? "text-yellow-500"
        : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between p-4 hover:bg-accent/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-mono text-xs">
            {cluster.issues.length} issues
          </Badge>
          <span className="text-sm text-foreground font-medium line-clamp-1">
            {cluster.issues[0]?.title}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className={`text-xs font-mono font-medium ${scoreColor}`}>
            {scorePercent}% match
          </span>
          <span className="text-muted-foreground text-xs">
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Separator />

            {/* Issue cards grid */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cluster.issues.map((issue, i) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  highlight={i === 0}
                />
              ))}
            </div>

            {/* Merge suggestion */}
            {cluster.mergeSuggestion && (
              <>
                <Separator />
                <div className="p-4 bg-muted/40">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-foreground">
                      🤖 AI Merge Suggestion
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {cluster.mergeSuggestion}
                  </p>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(cluster.mergeSuggestion)
                    }
                    className="mt-2 text-xs text-primary hover:underline"
                  >
                    Copy suggestion
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}