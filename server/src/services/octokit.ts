import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN!,
});

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  url: string;
  state: string;
  labels: string[];
}

export interface GitHubCommit {
  sha: string;
  message: string;
  date: string | null;
  author: string | null;
}

export const parseRepoUrl = (
  input: string,
): { owner: string; repo: string } => {
  // Handle full URL: https://github.com/owner/repo
  const urlMatch = input.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (urlMatch) {
    return {
      owner: urlMatch[1] ?? "",
      repo: (urlMatch[2] ?? "").replace(/\.git$/, ""),
    };
  }

  // Handle short form: owner/repo
  const parts = input.split("/");
  if (parts.length === 2) {
    return {
      owner: parts[0] ?? "",
      repo: parts[1] ?? "",
    };
  }

  throw new Error("Invalid repo format. Use 'owner/repo' or a GitHub URL.");
};

// Fetch all open issues(skips pull requests)
export const fetchIssues = async (
  owner: string,
  repo: string,
): Promise<GitHubIssue[]> => {
  const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner,
    repo,
    state: "open",
    per_page: 100,
  });

  // GitHub returns PRs mixed in with issues - filter them out
  return issues
    .filter((issue) => !issue.pull_request)
    .map((issue) => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body ?? null,
      url: issue.html_url,
      state: issue.state,
      labels: issue.labels.map((l) =>
        typeof l === "string" ? l : (l.name ?? ""),
      ),
    }));
};


// Fetch latest 200 commits (enough for a good story)
export const fetchCommits = async (
  owner: string,
  repo: string
): Promise<GitHubCommit[]> => {
  const commits = await octokit.paginate(
    octokit.rest.repos.listCommits,
    {
      owner,
      repo,
      per_page: 100,
    },
    (response) => response.data.slice(0, 200)
  );

  return commits.map((commit) => ({
    sha: commit.sha,
    message: commit.commit.message.split("\n")[0] ?? "", // first line only
    date: commit.commit.author?.date ?? null,
    author: commit.commit.author?.name ?? null,
  }));
};

// Check if repo exists and is accessible
export const validateRepo = async (
  owner: string,
  repo: string
): Promise<{ valid: boolean; stars: number; description: string | null }> => {
  try {
    const { data } = await octokit.rest.repos.get({ owner, repo });
    return {
      valid: true,
      stars: data.stargazers_count,
      description: data.description,
    };
  } catch {
    return { valid: false, stars: 0, description: null };
  }
};
