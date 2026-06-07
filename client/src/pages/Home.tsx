import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchRecentRepos } from "@/lib/api";
import { type RecentRepo } from "@/types";

const QUICK_REPOS = [
  "facebook/react",
  "vercel/next.js",
  "microsoft/vscode",
  "vitejs/vite",
];

export default function Home() {
  const [repo, setRepo] = useState("");
  const [error, setError] = useState("");
  const [recent, setRecent] = useState<RecentRepo[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const data = await fetchRecentRepos();
        setRecent(data);
      } catch {
        // silently fail - not critical
      } finally {
        setRecentLoading(false);
      }
    };
    void loadRecent();
  }, []);

  const handleAnalyze = () => {
    const trimmed = repo.trim();
    if (!trimmed) {
      setError("Please enter a repo.");
      return;
    }

    // Accept both "owner/repo" and full GitHub URLs
    const isValid =
      /^[\w.-]+\/[\w.-]+$/.test(trimmed) || trimmed.includes("github.com");

    if (!isValid) {
      setError('Use format "owner/repo" or paste a GitHub URL.');
      return;
    }

    setError("");

    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }

    navigate(`/dashboard?repo=${encodeURIComponent(trimmed)}`);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days}d ago`;
    if (hrs > 0) return `${hrs}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "just now";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-muted-foreground text-xs mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Semantic duplicate detection for open source
          </div>

          <h1 className="text-4xl sm:text-5xl font-semibold text-foreground tracking-tight leading-tight mb-4">
            Find duplicate issues.
            <br />
            <span className="text-muted-foreground">
              Read your repo's story.
            </span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-10">
            FuseMeld uses AI embeddings to detect semantically similar GitHub
            issues - not just keyword matches. Plus a narrative timeline of your
            repo's commit history.
          </p>

          {/* Input */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-3">
            <Input
              placeholder="facebook/react or paste a GitHub URL"
              value={repo}
              onChange={(e) => {
                setRepo(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1 bg-card border-border"
            />
            <Button
              onClick={handleAnalyze}
              className="sm:w-auto w-full cursor-pointer"
            >
              Analyze
            </Button>
          </div>

          {error && <p className="text-destructive text-sm mb-3">{error}</p>}

          {/* Quick fill */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="text-muted-foreground text-xs mt-1">Try:</span>
            {QUICK_REPOS.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRepo(r);
                  setError("");
                }}
                className="text-xs px-3 py-1 rounded-full border border-border bg-muted hover:bg-accent hover:text-accent-foreground transition-colors font-mono cursor-pointer"
              >
                {r}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recently Analyzed */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full max-w-2xl mt-14"
        >
          {(recentLoading || recent.length > 0) && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground font-medium">
                  Recently analyzed
                </span>
              </div>

              <div className="space-y-2">
                {recentLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-14 rounded-lg" />
                    ))
                  : recent.map((r) => (
                      <button
                        key={`${r.owner}/${r.repo}`}
                        onClick={() => {
                          if (!isSignedIn) {
                            navigate("/sign-in");
                            return;
                          }
                          navigate(
                            `/dashboard?repo=${encodeURIComponent(`${r.owner}/${r.repo}`)}`,
                          );
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent/40 transition-colors text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono text-foreground group-hover:text-primary transition-colors">
                            {r.owner}/{r.repo}
                          </span>
                          <span className="text-xs text-muted-foreground hidden sm:block">
                            {r.totalIssues} issues · {r.clustersFound} clusters
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {timeAgo(r.analyzedAt)}
                        </span>
                      </button>
                    ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full mt-20"
        >
          {[
            {
              icon: "⚡",
              title: "Semantic detection",
              desc: "Finds duplicate issues by meaning using AI embeddings — not just keyword matching.",
            },
            {
              icon: "🧠",
              title: "AI merge suggestions",
              desc: "Groq's Llama 3.3 70B tells you which issue to keep and how to close the others.",
            },
            {
              icon: "📖",
              title: "Commit storyteller",
              desc: "Your repo's commit history narrated as a human story, grouped into development phases.",
            },
            {
              icon: "💊",
              title: "Repo health score",
              desc: "A 0–100 score showing how healthy your issue tracker is — updated on every analysis.",
            },
            {
              icon: "📊",
              title: "Analysis diff",
              desc: "Refresh anytime to see exactly what changed — new clusters, resolved issues, trend direction.",
            },
            {
              icon: "🕐",
              title: "Analysis history",
              desc: "Every repo you've analyzed saved automatically, grouped by date for quick re-access.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-medium text-foreground text-sm mb-1">
                {f.title}
              </div>
              <div className="text-muted-foreground text-xs leading-relaxed">
                {f.desc}
              </div>
            </div>
          ))}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
