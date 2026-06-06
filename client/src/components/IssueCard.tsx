import { Badge } from "@/components/ui/badge";
import type { GitHubIssue } from "@/types/index";

interface Props {
  issue: GitHubIssue;
  highlight?: boolean;
}

export default function IssueCard({ issue, highlight = false }: Props) {
  return (
    <a
      href={issue.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-lg border p-4 transition-colors hover:bg-accent/50 ${
        highlight
          ? "border-primary/40 bg-primary/5"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-mono text-muted-foreground">
          #{issue.number}
        </span>
        <Badge
          variant={issue.state === "open" ? "default" : "secondary"}
          className="text-xs shrink-0"
        >
          {issue.state}
        </Badge>
      </div>

      <p className="text-sm font-medium text-foreground leading-snug mb-3">
        {issue.title}
      </p>

      {issue.body && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {issue.body}
        </p>
      )}

      {issue.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {issue.labels.slice(0, 4).map((label) => (
            <span
              key={label}
              className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}