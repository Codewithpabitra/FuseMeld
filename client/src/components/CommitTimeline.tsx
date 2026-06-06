import { motion } from "framer-motion";
import type { CommitPhase } from "@/types/index";

interface Props {
  phases: CommitPhase[];
}

export default function CommitTimeline({ phases }: Props) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-10 pl-12">
        {phases.map((phase, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="relative"
          >
            {/* Dot on timeline */}
            <div className="absolute -left-12 top-1 w-8 h-8 rounded-full border-2 border-primary bg-background flex items-center justify-center">
              <span className="text-xs font-mono text-primary font-medium">
                {i + 1}
              </span>
            </div>

            {/* Phase card */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-medium text-foreground text-sm">
                  {phase.title}
                </h3>
                <span className="text-xs text-muted-foreground font-mono shrink-0">
                  {phase.period}
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {phase.story}
              </p>

              {/* Commit list */}
              {phase.commits.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">
                    Key commits
                  </p>
                  {phase.commits.slice(0, 4).map((commit, j) => (
                    <div
                      key={j}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <span className="text-primary mt-0.5 shrink-0">▸</span>
                      <span className="font-mono leading-relaxed">{commit}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}