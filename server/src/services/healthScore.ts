export interface HealthScoreResult {
  score: number;
  label: "Excellent" | "Good" | "Needs Attention" | "Critical";
  breakdown: {
    duplicateRatio: number;
    issueVolume: number;
    clusterSeverity: number;
  };
  summary: string;
}

interface Cluster {
  issues: unknown[];
  similarityScore: number;
}

export const calculateHealthScore = (
  totalIssues: number,
  clusters: Cluster[]
): HealthScoreResult => {
  // Factor 1: Duplicate ratio (50 points max)
  const totalIssuesInClusters = clusters.reduce(
    (acc, c) => acc + c.issues.length,
    0
  );
  const duplicateRatio =
    totalIssues > 0 ? totalIssuesInClusters / totalIssues : 0;
  const duplicateScore = Math.round((1 - duplicateRatio) * 50);

  // Factor 2: Issue volume (30 points max)
  // 0 issues = 30pts, 100 = 28pts, 500 = 20pts, 1000+ = 0pts
  const volumeScore =
    totalIssues === 0
      ? 30
      : Math.max(0, Math.round(30 - (totalIssues / 1000) * 30));

  //Factor 3: Cluster severity (20 points max)
  // High similarity scores = more severe duplicates = fewer points
  const avgSeverity =
    clusters.length > 0
      ? clusters.reduce((acc, c) => acc + c.similarityScore, 0) /
        clusters.length
      : 0;
  const severityScore = Math.round((1 - avgSeverity) * 20);

  const score = Math.min(
    100,
    Math.max(0, duplicateScore + volumeScore + severityScore)
  );

  // Label
  let label: HealthScoreResult["label"];
  if (score >= 90) label = "Excellent";
  else if (score >= 70) label = "Good";
  else if (score >= 50) label = "Needs Attention";
  else label = "Critical";

  // Human summary
  let summary: string;
  if (clusters.length === 0 && totalIssues === 0) {
    summary = "No open issues — perfectly clean tracker.";
  } else if (clusters.length === 0) {
    summary = `All ${totalIssues} open issues appear unique. Great hygiene.`;
  } else if (score >= 70) {
    summary = `${clusters.length} duplicate cluster${clusters.length > 1 ? "s" : ""} found across ${totalIssues} issues. Minor cleanup needed.`;
  } else if (score >= 50) {
    summary = `${clusters.length} clusters with ${totalIssuesInClusters} duplicate issues detected. Recommend a triage session.`;
  } else {
    summary = `High duplicate density — ${totalIssuesInClusters} of ${totalIssues} issues may be duplicates. Needs immediate attention.`;
  }

  return {
    score,
    label,
    breakdown: {
      duplicateRatio: Math.round(duplicateRatio * 100),
      issueVolume: totalIssues,
      clusterSeverity: Math.round(avgSeverity * 100),
    },
    summary,
  };
};