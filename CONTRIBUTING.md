# Contributing to FuseMeld

Thank you for your interest in contributing! FuseMeld is an open-source project and contributions of all kinds are welcome — bug fixes, features, documentation, and more.

---

### For a full breakdown of the system design, request flows, and technical decisions, see [ARCHITECTURE.md](../ARCHITECTURE.md).

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming](#branch-naming)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Project Structure](#project-structure)

---

## Code of Conduct

This project follows a simple rule: **be respectful**. Harassment, discrimination, or toxic behavior of any kind will not be tolerated. Treat everyone as a collaborator, not a competitor.

---

## Getting Started

### 1. Fork and clone

```bash
# Fork via GitHub UI, then:
git clone https://github.com/YOUR_USERNAME/fusemeld.git
cd fusemeld
```

### 2. Set up the project

Follow the setup instructions in [README.md](README.md) to get both the server and client running locally.

### 3. Create your branch from `main`

```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

> ⚠️ Always branch from `main`, never from another feature branch.

---

## Development Workflow

```
1. Pick an issue (or open one describing what you want to build)
2. Branch from main
3. Write your code
4. Test manually — make sure existing flows still work
5. Commit with a conventional commit message
6. Push and open a PR against main
```

---

## Branch Naming

Use one of these prefixes:

| Prefix | When to use |
|---|---|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `docs/` | Documentation only |
| `refactor/` | Code change with no behavior change |
| `chore/` | Build process, deps, config |
| `test/` | Adding or fixing tests |

Examples:
```
feat/analysis-history
fix/embedding-model-warmup
docs/api-reference
refactor/similarity-service
```

---

## Commit Convention

FuseMeld uses [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, missing semicolons, etc. |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `chore` | Build process or dependency updates |

### Examples

```bash
git commit -m "feat(issues): add similarity threshold config option"
git commit -m "fix(auth): handle expired clerk token gracefully"
git commit -m "docs(readme): add API reference section"
git commit -m "refactor(embeddings): use singleton pattern for model loading"
```

---

## Pull Request Process

1. Make sure your branch is up to date with `main` before opening a PR:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. Fill out the PR template completely — describe what you changed and why.

3. Link the issue your PR resolves using `Closes #<issue_number>` in the PR description.

4. Keep PRs focused — one feature or fix per PR. Large PRs are harder to review and slower to merge.

5. Make sure the app still runs correctly before submitting.

6. A maintainer will review your PR within 48 hours. Be responsive to feedback.

### PR Title Format

Follow the same convention as commits:
```
feat(dashboard): add repo health score display
fix(octokit): handle repos with no commits
```

---

## Reporting Bugs

Before opening a bug report, check if the issue already exists.

When opening a bug report, include:

- **What you expected to happen**
- **What actually happened**
- **Steps to reproduce**
- **Environment** — OS, Node version, browser
- **Error messages or screenshots** if available

Use the Bug Report issue template when available.

---

## Suggesting Features

Open a Feature Request issue and include:

- **The problem you're trying to solve** — not just "add X"
- **Your proposed solution**
- **Alternatives you considered**
- **Who would benefit from this**

Features that solve real open-source maintainer problems are prioritized.

---

## Project Structure

```
fusemeld/
├── client/          # React frontend — Vite + TypeScript + Tailwind v4
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Route-level page components
│       ├── lib/          # API client and utilities
│       └── types/        # Shared TypeScript interfaces
│
└── server/          # Express backend — Node.js + TypeScript ESM
    └── src/
        ├── config/       # Database connection
        ├── middleware/    # Auth middleware
        ├── models/        # Mongoose models
        ├── routes/        # API route handlers
        └── services/      # Core business logic
```

### Key services to understand before contributing

| File | What it does |
|---|---|
| `server/src/services/embeddings.ts` | Loads `all-MiniLM-L6-v2` model, converts issue text to vectors |
| `server/src/services/similarity.ts` | Cosine similarity math + Union-Find clustering |
| `server/src/services/groq.ts` | Groq API calls for merge suggestions and commit story |
| `server/src/services/octokit.ts` | GitHub REST API wrapper for issues and commits |

---

## Need Help?

Open a [Discussion](../../discussions) or comment on the relevant issue. We're happy to help you get unstuck.