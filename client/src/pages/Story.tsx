import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import { fetchCommitStory, setAuthToken } from "@/lib/api";
import type { CommitPhase } from "@/types/index";
import Navbar from "@/components/Navbar";
import CommitTimeline from "@/components/CommitTimeline";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Story() {
  const [searchParams] = useSearchParams();
  const repo = searchParams.get("repo") ?? "";
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [phases, setPhases] = useState<CommitPhase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ useCallback so useEffect dependency is stable
  const fetchStory = useCallback(
    async (refresh = false) => {
      setLoading(true);
      setError("");
      try {
        const token = await getToken();
        if (token) setAuthToken(token);
        const result = await fetchCommitStory(repo, refresh);
        setPhases(result.commitStory);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to fetch story.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [repo, getToken]
  );

  useEffect(() => {
    if (!repo) {
      navigate("/");
      return;
    }
    void fetchStory();
  }, [fetchStory, navigate, repo]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div>
            <Link
              to={`/dashboard?repo=${encodeURIComponent(repo)}`}
              className="text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              ← Back to dashboard
            </Link>
            <h1 className="text-2xl font-semibold text-foreground mt-2">
              The story of{" "}
              <span className="font-mono text-primary">{repo}</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              A narrative of how this project evolved — told through its commits.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => void fetchStory(true)}
            disabled={loading}
          >
            Refresh story
          </Button>
        </div>

        {loading && (
          <div className="space-y-8 pl-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative">
                <Skeleton className="absolute -left-12 top-1 w-8 h-8 rounded-full" />
                <Skeleton className="h-36 rounded-xl" />
              </div>
            ))}
            <p className="text-center text-muted-foreground text-sm animate-pulse">
              Generating your repo's story...
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="text-destructive text-sm mb-3">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void fetchStory()}
            >
              Try again
            </Button>
          </div>
        )}

        {phases.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CommitTimeline phases={phases} />
          </motion.div>
        )}
      </main>
    </div>
  );
}