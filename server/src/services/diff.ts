interface Cluster {
  issues: { id: number; number: number; title: string }[];
  similarityScore: number;
}

export interface AnalysisDiffResult {
  hasChanges: boolean;
  issuesDelta: number; // positive = more issues, negative = closed
  clustersDelta: number; // positive = more duplicates, negative = resolved
  resolvedClusters: number; // clusters that no longer exist
  newClusters: number; // clusters that are brand new
  avgSimilarityDelta: number; // change in average similarity score
  previousAnalyzedAt: Date;
}

export const computeDiff = (
  previousClusters: Cluster[],
  currentClusters: Cluster[],
  previousTotalIssues: number,
  currentTotalIssues: number,
  previousAnalyzedAt: Date,
): AnalysisDiffResult => {
  // Issue count delta
  const issuesDelta = currentTotalIssues - previousTotalIssues;

  // Cluster count delta
  const clustersDelta = currentClusters.length - previousClusters.length;

  // Find resolved clusters — clusters whose issue numbers no longer appear together
  const previousIssueGroups = previousClusters.map(
    (c) => new Set(c.issues.map((i) => i.number)),
  );
  const currentIssueGroups = currentClusters.map(
    (c) => new Set(c.issues.map((i) => i.number)),
  );

  // A cluster is "resolved" if none of its issue numbers appear together in current
  let resolvedClusters = 0;
  for (const prevGroup of previousIssueGroups) {
    const stillExists = currentIssueGroups.some((currGroup) => {
      const overlap = [...prevGroup].filter((n) => currGroup.has(n));
      return overlap.length >= 2;
    });
    if (!stillExists) resolvedClusters++;
  }

  // A cluster is "new" if its issues didn't appear together in previous
  let newClusters = 0;
  for (const currGroup of currentIssueGroups) {
    const existedBefore = previousIssueGroups.some((prevGroup) => {
      const overlap = [...currGroup].filter((n) => prevGroup.has(n));
      return overlap.length >= 2;
    });
    if (!existedBefore) newClusters++;
  }

  // Average similarity delta
  const prevAvg =
    previousClusters.length > 0
      ? previousClusters.reduce((acc, c) => acc + c.similarityScore, 0) /
        previousClusters.length
      : 0;

  const currAvg =
    currentClusters.length > 0
      ? currentClusters.reduce((acc, c) => acc + c.similarityScore, 0) /
        currentClusters.length
      : 0;

  const avgSimilarityDelta = Math.round((currAvg - prevAvg) * 100);

  const hasChanges =
    issuesDelta !== 0 ||
    clustersDelta !== 0 ||
    resolvedClusters > 0 ||
    newClusters > 0;

  return {
    hasChanges,
    issuesDelta,
    clustersDelta,
    resolvedClusters,
    newClusters,
    avgSimilarityDelta,
    previousAnalyzedAt,
  };
};
