import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import { analyzeRepo, saveRepo, setAuthToken } from "@/lib/api";
import type { AnalysisResult } from "@/types/index";
import Navbar from "@/components/Navbar";
import RepoStats from "@/components/RepoStats";
import DuplicateCluster from "@/components/DuplicateCluster";
import HealthScoreCard from "@/components/HealthScore";
import AnalysisDiffCard from "@/components/AnalysisDiff";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const repo = searchParams.get("repo") ?? "";
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // useCallback so useEffect dependency is stable
  const fetchAnalysis = useCallback(
    async (refresh = false) => {
      setLoading(true);
      setError("");
      try {
        const token = await getToken();
        if (token) setAuthToken(token);
        const result = await analyzeRepo(repo, refresh);
        setData(result);
      } catch (err) {
        // Extract backend error message if available
        const axiosError = err as {
          response?: { data?: { error?: string }; status?: number };
        };
        if (axiosError.response?.data?.error) {
          setError(axiosError.response.data.error);
        } else if (axiosError.response?.status === 404) {
          setError(
            `"${repo}" does not exist on GitHub or is a private repository.`,
          );
        } else {
          setError(
            err instanceof Error ? err.message : "Failed to analyze repo.",
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [repo, getToken],
  );

  useEffect(() => {
    if (!repo) {
      navigate("/");
      return;
    }
    void fetchAnalysis();
  }, [fetchAnalysis, navigate, repo]);

  const handleSave = async () => {
    try {
      await saveRepo(`https://github.com/${repo}`);
      setSaved(true);
    } catch {
      // silently fail
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <button
              onClick={() => navigate("/")}
              className="text-muted-foreground text-sm hover:text-foreground transition-colors mb-1"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-semibold text-foreground font-mono">
              {repo}
            </h1>
            {data?.description && (
              <p className="text-muted-foreground text-sm mt-1">
                {data.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={saved}
            >
              {saved ? "✓ Saved" : "Save repo"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void fetchAnalysis(true)}
              disabled={loading}
            >
              Refresh
            </Button>
            <Link to={`/story?repo=${encodeURIComponent(repo)}`}>
              <Button size="sm">View story →</Button>
            </Link>
          </div>
        </div>

        {loading && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
            <p className="text-center text-muted-foreground text-sm mt-6 animate-pulse">
              Embedding {repo} issues... this takes ~20s on first run
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="text-destructive text-sm mb-3">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void fetchAnalysis()}
            >
              Try again
            </Button>
          </div>
        )}

        {data && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Health score sits at the top */}
            {data.health && <HealthScoreCard health={data.health} />}

            {/* Diff - only shown after a refresh */}
            {data.diff && <AnalysisDiffCard diff={data.diff} />}

            <RepoStats data={data} />

            {data.clusters.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-10 text-center">
                <p className="text-2xl mb-3">🎉</p>
                <p className="text-foreground font-medium mb-1">
                  No duplicate issues found
                </p>
                <p className="text-muted-foreground text-sm">
                  All {data.totalIssues} open issues appear to be unique.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-foreground">
                    {data.clusters.length} duplicate cluster
                    {data.clusters.length !== 1 ? "s" : ""} found
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    Sorted by similarity score
                  </span>
                </div>
                {data.clusters.map((cluster, i) => (
                  <DuplicateCluster key={i} cluster={cluster} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
