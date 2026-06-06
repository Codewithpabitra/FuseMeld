import type { GitHubIssue } from "./octokit.js";

export interface SimilarPair {
  issueA: GitHubIssue;
  issueB: GitHubIssue;
  score: number;
}

export interface DuplicateCluster {
  issues: GitHubIssue[];
  similarityScore: number; // highest score in the cluster
}

// Core math - measures angle between two vectors
// Returns 0 (completely different) to 1 (identical meaning)
export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length) return 0;

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < vecA.length; i++) {
    const a = vecA[i] ?? 0;
    const b = vecB[i] ?? 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  }

  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
  if (magnitude === 0) return 0;

  return dot / magnitude;
};

// Find all pairs above the similarity threshold
export const findSimilarPairs = (
  issues: GitHubIssue[],
  vectors: number[][],
  threshold = 0.82
): SimilarPair[] => {
  const pairs: SimilarPair[] = [];

  // Compare every issue against every other issue (complexity n² but fine for <500 issues)
  for (let i = 0; i < issues.length; i++) {
    for (let j = i + 1; j < issues.length; j++) {
      const vecA = vectors[i];
      const vecB = vectors[j];

      if (!vecA || !vecB) continue;

      const score = cosineSimilarity(vecA, vecB);

      if (score >= threshold) {
        pairs.push({
          issueA: issues[i] as GitHubIssue,
          issueB: issues[j] as GitHubIssue,
          score: Math.round(score * 100) / 100,
        });
      }
    }
  }

  // Sort by highest similarity first
  return pairs.sort((a, b) => b.score - a.score);
};

// Group similar pairs into clusters
// e.g. if A~B and B~C, they form one cluster [A, B, C]
export const buildClusters = (pairs: SimilarPair[]): DuplicateCluster[] => {
  // Union-Find algorithm - groups connected issues together
  const parent = new Map<number, number>();

  const find = (id: number): number => {
    if (!parent.has(id)) parent.set(id, id);
    const p = parent.get(id)!;
    if (p !== id) {
      const root = find(p);
      parent.set(id, root);
      return root;
    }
    return p;
  };

  const union = (a: number, b: number) => {
    parent.set(find(a), find(b));
  };

  // Track best score per cluster root
  const clusterScore = new Map<number, number>();
  const issueMap = new Map<number, GitHubIssue>();

  for (const pair of pairs) {
    const idA = pair.issueA.id;
    const idB = pair.issueB.id;

    issueMap.set(idA, pair.issueA);
    issueMap.set(idB, pair.issueB);

    union(idA, idB);

    const root = find(idA);
    const existing = clusterScore.get(root) ?? 0;
    clusterScore.set(root, Math.max(existing, pair.score));
  }

  // Group issues by their root
  const groups = new Map<number, GitHubIssue[]>();

  for (const [id] of issueMap) {
    const root = find(id);
    const issue = issueMap.get(id);
    if (!issue) continue;

    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(issue);
  }

  // Build final cluster objects
  const clusters: DuplicateCluster[] = [];

  for (const [root, issues] of groups) {
    if (issues.length >= 2) {
      clusters.push({
        issues,
        similarityScore: clusterScore.get(root) ?? 0,
      });
    }
  }

  return clusters.sort((a, b) => b.similarityScore - a.similarityScore);
};