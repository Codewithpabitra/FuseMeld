import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";

const QUICK_REPOS = [
  "facebook/react",
  "vercel/next.js",
  "microsoft/vscode",
  "vitejs/vite",
];

export default function Home() {
  const [repo, setRepo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const handleAnalyze = () => {
    const trimmed = repo.trim();
    if (!trimmed) {
      setError("Please enter a repo.");
      return;
    }

    // Accept both "owner/repo" and full GitHub URLs
    const isValid =
      /^[\w.-]+\/[\w.-]+$/.test(trimmed) ||
      trimmed.includes("github.com");

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
            <span className="text-muted-foreground">Read your repo's story.</span>
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
            <Button onClick={handleAnalyze} className="sm:w-auto w-full">
              Analyze
            </Button>
          </div>

          {error && (
            <p className="text-destructive text-sm mb-3">{error}</p>
          )}

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
                className="text-xs px-3 py-1 rounded-full border border-border bg-muted hover:bg-accent hover:text-accent-foreground transition-colors font-mono"
              >
                {r}
              </button>
            ))}
          </div>
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
              desc: "Finds duplicates by meaning, not just matching words.",
            },
            {
              icon: "🧠",
              title: "AI merge suggestions",
              desc: "Groq tells you which issue to keep and why.",
            },
            {
              icon: "📖",
              title: "Commit storyteller",
              desc: "Your repo's history narrated as a human story.",
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
    </div>
  );
}