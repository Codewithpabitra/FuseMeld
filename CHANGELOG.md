# Changelog

All notable changes to FuseMeld will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-06-06

### Added

- Semantic duplicate issue detection using `all-MiniLM-L6-v2` embeddings
- Cosine similarity clustering with Union-Find algorithm (threshold: 0.82)
- AI-powered merge suggestions via Groq (Llama 3.3 70B)
- Commit Storyteller — narrative timeline of repo history grouped into development phases
- GitHub OAuth authentication via Clerk
- MongoDB caching of analysis results (1 hour TTL)
- Save/unsave repos to user profile
- Repo health stats dashboard (total issues, clusters, issues in clusters)
- Support for `owner/repo` shorthand and full GitHub URLs
- Quick-fill buttons for popular repos on the home page
- Friendly error messages for non-existent or private repos
- Responsive UI with dark mode support
- Lazy-loaded embedding model with warmup on server start