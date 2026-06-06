import { Router, type Request, type Response } from "express";
import { requireAuth } from "../middleware/auth.js";
import { fetchCommits, parseRepoUrl, validateRepo } from "../services/octokit.js";
import { generateCommitStory } from "../services/groq.js";
import { Analysis } from "../models/Analysis.js";

const router = Router();

router.get("/story", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { repo: repoInput, refresh } = req.query;

  if (!repoInput || typeof repoInput !== "string") {
    res.status(400).json({ error: "repo query param is required. e.g. ?repo=facebook/react" });
    return;
  }

  try {
    const { owner, repo } = parseRepoUrl(repoInput);

    // Check cached story
    if (refresh !== "true") {
      const cached = await Analysis.findOne({ owner, repo });
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      if (
        cached &&
        cached.cachedAt > oneHourAgo &&
        cached.commitStory.length > 0
      ) {
        res.json({
          source: "cache",
          owner,
          repo,
          commitStory: cached.commitStory,
        });
        return;
      }
    }

    // Validate repo
    const { valid } = await validateRepo(owner, repo);
    if (!valid) {
      res.status(404).json({ error: `Repo "${owner}/${repo}" not found or is private.` });
      return;
    }

    // Fetch commits
    console.log(`Fetching commits for ${owner}/${repo}...`);
    const commits = await fetchCommits(owner, repo);

    if (commits.length === 0) {
      res.json({
        source: "live",
        owner,
        repo,
        commitStory: [],
        message: "No commits found.",
      });
      return;
    }

    // Generate story via Groq
    console.log(`Generating commit story for ${owner}/${repo}...`);
    const commitStory = await generateCommitStory(commits, `${owner}/${repo}`);

    // Update the Analysis doc with the story
    await Analysis.findOneAndUpdate(
      { owner, repo },
      {
        $set: {
          commitStory,
          cachedAt: new Date(),
        },
      },
      { upsert: true }
    );

    res.json({
      source: "live",
      owner,
      repo,
      commitStory,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    console.error("/commits/story error:", message);
    res.status(500).json({ error: message });
  }
});

export default router;