import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { getMe, removeRepo, setAuthToken } from "@/lib/api";
import type { User } from "@/types/index";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingRepo, setRemovingRepo] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      if (token) setAuthToken(token);
      const data = await getMe();
      setUser(data);
    } catch {
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const handleRemove = async (repoUrl: string) => {
    setRemovingRepo(repoUrl);
    try {
      const token = await getToken();
      if (token) setAuthToken(token);
      await removeRepo(repoUrl);
      // Optimistically remove from UI
      setUser((prev) =>
        prev
          ? { ...prev, savedRepos: prev.savedRepos.filter((r) => r !== repoUrl) }
          : prev
      );
    } catch {
      // silently fail
    } finally {
      setRemovingRepo(null);
    }
  };

  const repoToShorthand = (repoUrl: string) => {
    // Convert "https://github.com/owner/repo" → "owner/repo"
    return repoUrl.replace("https://github.com/", "");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your saved repositories and account details.
          </p>
        </motion.div>

        {/* User info card */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="rounded-xl border border-border bg-card p-5 mb-6 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-semibold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {user.username}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xl font-semibold text-foreground">
                {user.savedRepos.length}
              </p>
              <p className="text-xs text-muted-foreground">saved repos</p>
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="text-destructive text-sm mb-3">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void loadProfile()}>
              Try again
            </Button>
          </div>
        )}

        {/* Saved repos */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-sm font-medium text-foreground mb-3">
              Saved repositories
            </h2>

            {user?.savedRepos.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-10 text-center">
                <p className="text-2xl mb-3">📭</p>
                <p className="text-foreground font-medium mb-1 text-sm">
                  No saved repos yet
                </p>
                <p className="text-muted-foreground text-xs mb-4">
                  Analyze a repo and click "Save repo" to bookmark it here.
                </p>
                <Button size="sm" onClick={() => navigate("/")} className="cursor-pointer">
                  Analyze a repo
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {user?.savedRepos.map((repoUrl, i) => {
                  const shorthand = repoToShorthand(repoUrl);
                  const isRemoving = removingRepo === repoUrl;

                  return (
                    <motion.div
                      key={repoUrl}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4"
                    >
                      {/* Repo info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <span className="text-xs">📦</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-mono font-medium text-foreground truncate">
                            {shorthand}
                          </p>
                          <a
                            href={repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            View on GitHub ↗
                          </a>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(
                              `/dashboard?repo=${encodeURIComponent(shorthand)}`
                            )
                          }
                          className="cursor-pointer"
                        >
                          Re-analyze
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isRemoving}
                          onClick={() => void handleRemove(repoUrl)}
                          className="text-muted-foreground hover:text-destructive
                          cursor-pointer"
                        >
                          {isRemoving ? "..." : "Remove"}
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}