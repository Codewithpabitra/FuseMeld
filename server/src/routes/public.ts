import { Router, type Request, type Response } from "express";
import { Analysis } from "../models/Analysis.js";

const router = Router();

// Returns last 5 analyzed repos - no auth required
router.get("/recent", async (_req: Request, res: Response): Promise<void> => {
  try {
    const recent = await Analysis.find()
      .sort({ cachedAt: -1 })
      .limit(5)
      .select("owner repo totalIssues clusters cachedAt")
      .lean();

    const formatted = recent.map((a) => ({
      owner: a.owner,
      repo: a.repo,
      repoUrl: `https://github.com/${a.owner}/${a.repo}`,
      totalIssues: a.totalIssues,
      clustersFound: a.clusters.length,
      analyzedAt: a.cachedAt,
    }));

    res.json({ recent: formatted });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch recent analyses";
    res.status(500).json({ error: message });
  }
});

export default router;