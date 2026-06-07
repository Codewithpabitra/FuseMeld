export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  url: string;
  state: string;
  labels: string[];
}

export interface DuplicateCluster {
  issues: GitHubIssue[];
  similarityScore: number;
  mergeSuggestion: string;
}

export interface CommitPhase {
  title: string;
  period: string;
  commits: string[];
  story: string;
}

export interface AnalysisResult {
  source: "live" | "cache";
  owner: string;
  repo: string;
  stars?: number;
  description?: string | null;
  totalIssues: number;
  clusters: DuplicateCluster[];
}

export interface StoryResult {
  source: "live" | "cache";
  owner: string;
  repo: string;
  commitStory: CommitPhase[];
}

export interface User {
  clerkId: string;
  email: string;
  username: string;
  savedRepos: string[];
}

// public recent repos
export interface RecentRepo {
  owner: string;
  repo: string;
  repoUrl: string;
  totalIssues: number;
  clustersFound: number;
  analyzedAt: string;
}

// User History Entry
export interface HistoryEntry {
  _id: string;
  owner: string;
  repo: string;
  repoUrl: string;
  totalIssues: number;
  clustersFound: number;
  analyzedAt: string;
}