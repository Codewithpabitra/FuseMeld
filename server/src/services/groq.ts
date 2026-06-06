import Groq from "groq-sdk";
import type { GitHubIssue } from "./octokit.js";
import type { GitHubCommit } from "./octokit.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Generate a merge suggestion for a cluster of duplicate issues
export const generateMergeSuggestion = async (
  issues: GitHubIssue[]
): Promise<string> => {
  const issueList = issues
    .map((i) => `#${i.number}: ${i.title}\n${i.body?.slice(0, 300) ?? ""}`)
    .join("\n\n---\n\n");

  const prompt = `You are a senior open-source maintainer reviewing duplicate GitHub issues.

Here are ${issues.length} issues that appear to be duplicates:

${issueList}

Write a concise merge suggestion (3-5 sentences) that:
1. Confirms they are duplicates and explains why
2. Recommends which issue to keep as the primary (pick the most detailed one)
3. Suggests what to do with the others (close with a reference)

Be direct and practical. No markdown formatting.`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content?.trim() ?? "Unable to generate suggestion.";
};

export interface CommitPhase {
  title: string;
  period: string;
  commits: string[];
  story: string;
}

// Narrate commit history as a human-readable story
export const generateCommitStory = async (
  commits: GitHubCommit[],
  repoName: string
): Promise<CommitPhase[]> => {
  // Take last 80 commits for the story (most recent activity)
  const recent = commits.slice(0, 80);

  const commitLog = recent
    .map((c) => `[${c.date?.slice(0, 10) ?? "unknown"}] ${c.message}`)
    .join("\n");

  const prompt = `You are a technical writer narrating the development history of the "${repoName}" open-source project.

Here are the recent commits (newest first):

${commitLog}

Analyze this commit history and return ONLY a valid JSON array (no markdown, no explanation) with 3-5 development phases. Each phase should capture a meaningful period of work.

Format:
[
  {
    "title": "Short phase title (e.g. Initial Setup, Auth Overhaul, Bug Fix Sprint)",
    "period": "Date range (e.g. Jan 2024 - Mar 2024)",
    "commits": ["commit message 1", "commit message 2"],
    "story": "2-3 sentence narrative of what the team was building or fixing during this phase. Make it engaging and human."
  }
]`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1200,
    temperature: 0.6,
  });

  const raw = response.choices[0]?.message?.content?.trim() ?? "[]";

  try {
    // Strip any accidental markdown fences
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean) as CommitPhase[];
  } catch {
    console.error("Failed to parse Groq commit story JSON:", raw);
    return [];
  }
};