import { Router, type Request, type Response } from "express";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import {
  fetchIssues,
  parseRepoUrl,
  validateRepo,
} from "../services/octokit.js";
import { embedMany, prepareIssueText } from "../services/embeddings.js";
import { findSimilarPairs, buildClusters } from "../services/similarity.js";
import { generateMergeSuggestion } from "../services/groq.js";
import { calculateHealthScore } from "../services/healthScore.js";
import { computeDiff } from "../services/diff.js";
import { Analysis } from "../models/Analysis.js";
import { History } from "../models/History.js";

const router = Router();

router.get(
  "/analyze",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const { repo: repoInput, refresh } = req.query;

    const userId = (req as AuthenticatedRequest).userId;

    if (!repoInput || typeof repoInput !== "string") {
      res.status(400).json({
        error: "repo query param is required. e.g. ?repo=facebook/react",
      });
      return;
    }

    try {
      const { owner, repo } = parseRepoUrl(repoInput);

      // Fetch previous analysis before doing anything new (needed for diff)
      const previousAnalysis = await Analysis.findOne({ owner, repo })
        .sort({ cachedAt: -1 })
        .lean();

      // Check cache first - skip if ?refresh=true
      if (refresh !== "true" && previousAnalysis) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (previousAnalysis.cachedAt > oneHourAgo) {
          if (userId) {
            await saveToHistory({
              userId,
              owner,
              repo,
              totalIssues: previousAnalysis.totalIssues,
              clustersFound: previousAnalysis.clusters.length,
            });
          }

          const health = calculateHealthScore(
            previousAnalysis.totalIssues,
            previousAnalysis.clusters,
          );

          res.json({
            source: "cache",
            owner,
            repo,
            totalIssues: previousAnalysis.totalIssues,
            clusters: previousAnalysis.clusters,
            commitStory: previousAnalysis.commitStory,
            health,
            diff: null,
          });
          return;
        }
      }

      // Validate repo exists
      const { valid, stars, description } = await validateRepo(owner, repo);
      if (!valid) {
        res
          .status(404)
          .json({ error: `Repo "${owner}/${repo}" not found or is private.` });
        return;
      }

      // Fetch all open issues
      console.log(`Fetching issues for ${owner}/${repo}...`);
      const issues = await fetchIssues(owner, repo);

      if (issues.length === 0) {
        // Save to history even when no issues found
        if (userId) {
          await saveToHistory({
            userId,
            owner,
            repo,
            totalIssues: 0,
            clustersFound: 0,
          });
        }
        const health = calculateHealthScore(0, []);

        // Compute diff if previous exists
        const diff = previousAnalysis
          ? computeDiff(
              previousAnalysis.clusters,
              [],
              previousAnalysis.totalIssues,
              0,
              previousAnalysis.cachedAt,
            )
          : null;

        res.json({
          source: "live",
          owner,
          repo,
          stars,
          description,
          totalIssues: 0,
          clusters: [],
          commitStory: [],
          health,
          diff,
          message: "No open issues found in this repo.",
        });
        return;
      }

      // Embed all issues
      console.log(`Embedding ${issues.length} issues...`);
      const texts = issues.map((i) => prepareIssueText(i.title, i.body));
      const vectors = await embedMany(texts);

      // Find duplicates
      console.log("Finding duplicate clusters...");
      const pairs = findSimilarPairs(issues, vectors);
      const rawClusters = buildClusters(pairs);

      // Generate merge suggestion for each cluster via Groq
      console.log(
        `✨ Generating merge suggestions for ${rawClusters.length} clusters...`,
      );
      const clusters = await Promise.all(
        rawClusters.map(async (cluster) => {
          const mergeSuggestion = await generateMergeSuggestion(cluster.issues);
          return {
            issues: cluster.issues,
            similarityScore: cluster.similarityScore,
            mergeSuggestion,
          };
        }),
      );

      // Calculate health score
      const health = calculateHealthScore(issues.length, clusters);
      console.log(`Health score: ${health.score} — ${health.label}`);

      // Compute diff against previous analysis
      const diff = previousAnalysis
        ? computeDiff(
            previousAnalysis.clusters,
            clusters,
            previousAnalysis.totalIssues,
            issues.length,
            previousAnalysis.cachedAt,
          )
        : null;

      if (diff?.hasChanges) {
        console.log(
          `Diff: ${diff.issuesDelta > 0 ? "+" : ""}${diff.issuesDelta} issues, ${diff.clustersDelta > 0 ? "+" : ""}${diff.clustersDelta} clusters`,
        );
      }

      // Save to MongoDB
      await Analysis.findOneAndUpdate(
        { owner, repo },
        {
          repoUrl: `https://github.com/${owner}/${repo}`,
          owner,
          repo,
          clusters,
          commitStory: [], // filled by /api/commits/story
          totalIssues: issues.length,
          cachedAt: new Date(),
        },
        { upsert: true, new: true },
      );

      if (userId) {
        await saveToHistory({
          userId,
          owner,
          repo,
          totalIssues: issues.length,
          clustersFound: clusters.length,
        });
      }

      res.json({
        source: "live",
        owner,
        repo,
        stars,
        description,
        totalIssues: issues.length,
        clusters,
        health,
        diff,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      console.error("/issues/analyze error:", message);
      res.status(500).json({ error: message });
    }
  },
);

// Helper - saves a history entry, deduplicates within 1 hour
const saveToHistory = async ({
  userId,
  owner,
  repo,
  totalIssues,
  clustersFound,
}: {
  userId: string;
  owner: string;
  repo: string;
  totalIssues: number;
  clustersFound: number;
}) => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Don't save if already saved this repo in the last hour
    const recent = await History.findOne({
      userId,
      owner,
      repo,
      analyzedAt: { $gte: oneHourAgo },
    });

    if (recent) return;

    await History.create({
      userId,
      owner,
      repo,
      repoUrl: `https://github.com/${owner}/${repo}`,
      totalIssues,
      clustersFound,
      analyzedAt: new Date(),
    });
  } catch {
    // Non-critical - don't let history saving break the main response
  }
};

export default router;
