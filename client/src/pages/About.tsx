import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const techStack = [
  { category: "Frontend", items: ["React 19", "TypeScript", "Tailwind CSS v4", "shadcn/ui", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "Express 5", "TypeScript", "ESM Modules"] },
  { category: "Database", items: ["MongoDB Atlas", "Mongoose"] },
  { category: "AI & Embeddings", items: ["Groq (Llama 3.3 70B)", "all-MiniLM-L6-v2", "@xenova/transformers"] },
  { category: "Auth & APIs", items: ["Clerk", "Octokit", "GitHub REST API"] },
];

const features = [
  {
    icon: "⚡",
    title: "Semantic Duplicate Detection",
    desc: "Uses the all-MiniLM-L6-v2 embedding model to convert issue text into vectors, then applies cosine similarity to find issues that mean the same thing — even when phrased completely differently. No keyword matching.",
  },
  {
    icon: "🧠",
    title: "AI Merge Suggestions",
    desc: "Once duplicate clusters are found, Groq's Llama 3.3 70B generates a human-readable merge suggestion — explaining why they are duplicates, which issue to keep as primary, and how to close the others.",
  },
  {
    icon: "📖",
    title: "Commit Storyteller",
    desc: "Fetches the latest commits from any repo and sends them to Groq, which groups them into meaningful development phases and narrates each one as a human story. Great for onboarding new contributors.",
  },
  {
    icon: "💾",
    title: "Smart Caching",
    desc: "Analysis results are cached in MongoDB for one hour. Re-visiting the same repo within that window returns instant results — no re-embedding needed. Refresh manually anytime.",
  },
  {
    icon: "🕐",
    title: "Analysis History",
    desc: "Every repo you analyze is saved to your personal history, grouped by date. One click takes you back to any previous analysis.",
  },
  {
    icon: "⭐",
    title: "Saved Repositories",
    desc: "Bookmark repos you care about for quick re-analysis from your profile page. Remove them anytime.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Enter a GitHub repo",
    desc: "Paste any public GitHub repo URL or use the owner/repo shorthand. FuseMeld validates it exists before proceeding.",
  },
  {
    step: "02",
    title: "Issues get embedded",
    desc: "Every open issue's title and body is converted into a 384-dimensional vector using the all-MiniLM-L6-v2 model running locally in Node.js — no external embedding API needed.",
  },
  {
    step: "03",
    title: "Similarity matrix built",
    desc: "Cosine similarity is computed between every pair of issue vectors. Pairs scoring above 0.82 are flagged as potential duplicates and grouped into clusters using a Union-Find algorithm.",
  },
  {
    step: "04",
    title: "Groq generates suggestions",
    desc: "Each duplicate cluster is sent to Groq's Llama 3.3 70B with a structured prompt. The model returns a concise merge suggestion explaining which issue to keep and why.",
  },
  {
    step: "05",
    title: "Results cached and returned",
    desc: "The full analysis is saved to MongoDB and returned to the frontend. Future requests within one hour are served from cache instantly.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-muted-foreground text-xs mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Open source · Built for maintainers
            </div>

            <h1 className="text-4xl sm:text-5xl font-semibold text-foreground tracking-tight leading-tight mb-4">
              About FuseMeld
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              FuseMeld was built to solve a real problem — open source maintainers
              spending hours manually identifying duplicate issues across repos with
              hundreds or thousands of open items.
            </p>
          </motion.div>
        </section>

        <Separator />

        {/* The problem */}
        <section className="max-w-4xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              The problem
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: "😩",
                  title: "Duplicate issues are everywhere",
                  desc: "Popular repos receive the same bug report filed dozens of times with slightly different wording. Maintainers spend hours triaging instead of building.",
                },
                {
                  icon: "🔍",
                  title: "Keyword search isn't enough",
                  desc: '"App crashes on login" and "Sign-in page broken" are the same issue. A keyword search would never catch that. Semantic search does.',
                },
                {
                  icon: "📜",
                  title: "Commit history is unreadable",
                  desc: "New contributors can't understand how a project evolved just from reading raw commit logs. There's no narrative context.",
                },
                {
                  icon: "⏱️",
                  title: "Maintainer time is precious",
                  desc: "Every minute spent on duplicate triage is a minute not spent reviewing real PRs, fixing bugs, or writing documentation.",
                },
              ].map((p) => (
                <div
                  key={p.title}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <div className="text-2xl mb-3">{p.icon}</div>
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <Separator />

        {/* How it works */}
        <section className="max-w-4xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-foreground mb-8">
              How it works
            </h2>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border hidden sm:block" />

              <div className="space-y-8 sm:pl-12">
                {howItWorks.map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="relative"
                  >
                    <div className="hidden sm:flex absolute -left-12 top-1 w-8 h-8 rounded-full border-2 border-primary bg-background items-center justify-center">
                      <span className="text-xs font-mono text-primary font-medium">
                        {i + 1}
                      </span>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-muted-foreground sm:hidden">
                          {step.step}
                        </span>
                        <h3 className="text-sm font-medium text-foreground">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <Separator />

        {/* Features */}
        <section className="max-w-4xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-foreground mb-8">
              Features
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <div className="text-2xl mb-3">{f.icon}</div>
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <Separator />

        {/* Tech Stack */}
        <section className="max-w-4xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-foreground mb-8">
              Tech stack
            </h2>

            <div className="space-y-5">
              {techStack.map((layer, i) => (
                <motion.div
                  key={layer.category}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <span className="text-xs text-muted-foreground w-32 shrink-0 font-medium">
                    {layer.category}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {layer.items.map((item) => (
                      <Badge
                        key={item}
                        variant="secondary"
                        className="text-xs font-mono"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <Separator />

        {/* Author */}
        <section className="max-w-4xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-border bg-card p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground text-xl font-bold">P</span>
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground mb-1">
                Pabitra Maity
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Full-stack developer specializing in the MERN stack and TypeScript.
                Built FuseMeld as an open-source tool for the developer community.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://github.com/Codewithpabitra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  GitHub
                </a>
                <span className="text-muted-foreground text-xs">·</span>
                <a
                  href="https://codewithpabitradev.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  Portfolio
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        <Separator />

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 py-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Ready to clean up your issues?
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Paste any public GitHub repo and see the results in under a minute.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Try FuseMeld →
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}