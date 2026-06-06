import { Router, type Request, type Response } from "express";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { User, type IUser } from "../models/User.js";
import type { Types } from "mongoose";

const router = Router();

// Helper — extract and validate userId from request
const getUserId = (req: Request): string | null => {
  const userId = (req as AuthenticatedRequest).userId;
  return userId ?? null;
};

// Sync Clerk user into MongoDB (call this on first login from frontend)
router.post("/sync", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { email, username } = req.body as { email?: string; username?: string };

  if (!email || !username) {
    res.status(400).json({ error: "email and username are required" });
    return;
  }

  try {
    const user = await User.findOneAndUpdate<IUser>(
      { clerkId: userId },
      { clerkId: userId, email, username },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    res.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    res.status(500).json({ error: message });
  }
});

// Get current user profile + saved repos
router.get("/me", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const user = await User.findOne<IUser>({ clerkId: userId }).lean();

    if (!user) {
      res.status(404).json({ error: "User not found. Call /sync first." });
      return;
    }

    res.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch user";
    res.status(500).json({ error: message });
  }
});

// Save a repo to user's list
router.post("/repos/save", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { repoUrl } = req.body as { repoUrl?: string };

  if (!repoUrl) {
    res.status(400).json({ error: "repoUrl is required" });
    return;
  }

  try {
    const user = await User.findOneAndUpdate<IUser>(
      { clerkId: userId },
      { $addToSet: { savedRepos: repoUrl } },
      { new: true, runValidators: true }
    ).lean();

    const savedRepos: string[] = user?.savedRepos ?? [];
    res.json({ savedRepos });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save repo";
    res.status(500).json({ error: message });
  }
});

// Remove a repo from user's list
router.delete("/repos/remove", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { repoUrl } = req.body as { repoUrl?: string };

  if (!repoUrl) {
    res.status(400).json({ error: "repoUrl is required" });
    return;
  }

  try {
    const user = await User.findOneAndUpdate<IUser>(
      { clerkId: userId },
      { $pull: { savedRepos: repoUrl } },
      { new: true }
    ).lean();

    const savedRepos: string[] = user?.savedRepos ?? [];
    res.json({ savedRepos });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to remove repo";
    res.status(500).json({ error: message });
  }
});

export default router;