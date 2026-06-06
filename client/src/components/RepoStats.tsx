import type { AnalysisResult } from "@/types/index";

interface Props {
  data: AnalysisResult;
}

export default function RepoStats({ data }: Props) {
  const stats = [
    { label: "Total issues", value: data.totalIssues },
    { label: "Duplicate clusters", value: data.clusters.length },
    {
      label: "Issues in clusters",
      value: data.clusters.reduce((acc, c) => acc + c.issues.length, 0),
    },
    {
      label: "Source",
      value: data.source === "cache" ? "Cached" : "Live",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="text-xl font-semibold text-foreground mb-1">
            {s.value}
          </div>
          <div className="text-xs text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  );
}