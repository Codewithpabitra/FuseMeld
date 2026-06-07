import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { fetchHistory, clearHistory, setAuthToken } from "@/lib/api";
import type { HistoryEntry } from "@/types/index";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function History() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      if (token) setAuthToken(token);
      const data = await fetchHistory();
      setHistory(data);
    } catch {
      setError("Failed to load history.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const handleClear = async () => {
    setClearing(true);
    try {
      const token = await getToken();
      if (token) setAuthToken(token);
      await clearHistory();
      setHistory([]);
    } catch {
      // silently fail
    } finally {
      setClearing(false);
    }
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Group history by date
  const grouped = history.reduce<Record<string, HistoryEntry[]>>((acc, entry) => {
    const date = formatDate(entry.analyzedAt);
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-start justify-between mb-8 gap-4 flex-wrap"
        >
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Analysis History
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Every repo you've analyzed — most recent first.
            </p>
          </div>

          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleClear()}
              disabled={clearing}
              className="text-muted-foreground hover:text-destructive"
            >
              {clearing ? "Clearing..." : "Clear history"}
            </Button>
          )}
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, g) => (
              <div key={g}>
                <Skeleton className="h-4 w-24 mb-3" />
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="text-destructive text-sm mb-3">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void loadHistory()}>
              Try again
            </Button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && history.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <p className="text-2xl mb-3">🕐</p>
            <p className="text-foreground font-medium mb-1 text-sm">
              No history yet
            </p>
            <p className="text-muted-foreground text-xs mb-4">
              Analyze a repo to see it appear here.
            </p>
            <Button size="sm" onClick={() => navigate("/")}>
              Analyze a repo
            </Button>
          </div>
        )}

        {/* Grouped history */}
        {!loading && !error && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {Object.entries(grouped).map(([date, entries]) => (
              <div key={date}>
                {/* Date header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    {date}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Entries for this date */}
                <div className="space-y-2">
                  {entries.map((entry, i) => (
                    <motion.button
                      key={entry._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() =>
                        navigate(
                          `/dashboard?repo=${encodeURIComponent(`${entry.owner}/${entry.repo}`)}`
                        )
                      }
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card hover:bg-accent/40 transition-colors text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Cluster indicator */}
                        <div className={`w-2 h-2 rounded-full shrink-0 ${
                          entry.clustersFound > 0
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`} />

                        <div className="min-w-0">
                          <p className="text-sm font-mono font-medium text-foreground group-hover:text-primary transition-colors truncate">
                            {entry.owner}/{entry.repo}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {entry.totalIssues} issues ·{" "}
                            {entry.clustersFound > 0
                              ? `${entry.clustersFound} duplicate clusters`
                              : "no duplicates found"}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs text-muted-foreground shrink-0 ml-4">
                        {timeAgo(entry.analyzedAt)}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}

            <p className="text-center text-xs text-muted-foreground pb-4">
              Showing last {history.length} analyses
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}