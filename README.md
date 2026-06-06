<div align="center">

<img src="https://img.shields.io/badge/FuseMeld-v1.0.0-black?style=for-the-badge&logo=github" alt="FuseMeld" />

</br>

<div align="center">
  <img src="./assets/Applogo.png" alt="FuseMeld Logo" width="40" style="vertical-align: middle;" />
  &nbsp;
  <span style="font-size: 2rem; font-weight: 700; vertical-align: middle;">FuseMeld</span>
</div>
</br>

**Semantic duplicate issue detection + commit storyteller for open source maintainers.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-F55036?style=flat-square)](https://groq.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

[Live Demo](https://fusemeld-git.onrender.com) · [Report Bug](https://github.com/Codewithpabitra/FuseMeld/issues/new?template=bug_report.md) · [Request Feature](https://github.com/Codewithpabitra/FuseMeld/issues/new?template=feature_request.md)

</div>

---

![FuseMeld Home Page](./assets/screenshot-home.png)

---

## 📌 What is FuseMeld?

FuseMeld is a full-stack developer tool that helps open-source maintainers manage large GitHub repositories more effectively. It solves two real problems:

**Problem 1 — Duplicate issues drown maintainers.** Popular repos get the same bug report filed dozens of times with slightly different wording. Keyword search misses them. FuseMeld uses AI embeddings to detect issues that mean the same thing, even when phrased completely differently.

**Problem 2 — New contributors don't know a repo's history.** Commit logs are hard to read. FuseMeld uses Groq's Llama 3.3 70B to turn a repo's commit history into a human-readable narrative timeline — like reading the story of how a project was built.

---

## ✨ Features

- 🔍 **Semantic duplicate detection** — Finds similar issues by meaning using `all-MiniLM-L6-v2` embeddings, not just keyword matching
- 🧠 **AI merge suggestions** — Groq generates actionable recommendations on which issue to keep and how to close the others
- 📖 **Commit Storyteller** — Transforms raw commit history into a narrative timeline grouped by development phases
- 💾 **Smart caching** — Analysis results cached in MongoDB for 1 hour to avoid redundant API calls
- 🔐 **GitHub OAuth** — Secure authentication via Clerk with JWT-protected API routes
- ⭐ **Saved repos** — Users can bookmark repos for quick re-analysis
- 📊 **Repo health stats** — At-a-glance metrics: total issues, duplicate clusters, issues in clusters

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion |
| Backend | Node.js, Express 5, TypeScript, ESM modules |
| Database | MongoDB Atlas, Mongoose |
| AI / Embeddings | Groq API (Llama 3.3 70B), `@xenova/transformers` (all-MiniLM-L6-v2) |
| Auth | Clerk (GitHub OAuth + JWT) |
| GitHub Data | Octokit REST API |
| Deploy | Render (backend), Render (frontend) |

---

## 🏗️ Architecture
For a detailed breakdown of request flows, data models, and technical decisions → [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- npm 10+
- A MongoDB Atlas account (free M0 cluster works)
- A Groq account (free tier)
- A GitHub account (for OAuth + PAT)
- A Clerk account (free tier)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/fusemeld.git
cd fusemeld
```

### 2. Setup the backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/fusemeld
GROQ_API_KEY=your_groq_api_key_here
GITHUB_TOKEN=your_github_pat_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

Start the backend:

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected
⏳ Loading embedding model (first time only)...
✅ Embedding model ready
🚀 Server running on http://localhost:5000
```

### 3. Setup the frontend

```bash
cd ../client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
```

Start the frontend:

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (`server/.env`)

| Variable | Description | Where to get |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | [cloud.mongodb.com](https://cloud.mongodb.com) |
| `GROQ_API_KEY` | Groq API key | [console.groq.com](https://console.groq.com) |
| `GITHUB_TOKEN` | GitHub Personal Access Token (needs `public_repo`) | GitHub → Settings → Developer settings |
| `CLERK_SECRET_KEY` | Clerk backend secret key | [clerk.com](https://clerk.com) dashboard |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` in dev |

### Frontend (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (safe to expose) |

---

## 📁 Project Structure

```
fusemeld/
├── client/                        # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                # shadcn components
│   │   │   ├── CommitTimeline.tsx
│   │   │   ├── DuplicateCluster.tsx
│   │   │   ├── IssueCard.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── RepoStats.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Home.tsx
│   │   │   └── Story.tsx
│   │   ├── lib/
│   │   │   └── api.ts
│   │   └── types/
│   │       └── index.ts
│   └── ...
│
└── server/                        # Express backend
    ├── src/
    │   ├── config/
    │   │   └── db.ts
    │   ├── middleware/
    │   │   └── auth.ts
    │   ├── models/
    │   │   ├── Analysis.ts
    │   │   └── User.ts
    │   ├── routes/
    │   │   ├── commits.ts
    │   │   ├── issues.ts
    │   │   └── user.ts
    │   ├── services/
    │   │   ├── embeddings.ts
    │   │   ├── groq.ts
    │   │   ├── octokit.ts
    │   │   └── similarity.ts
    │   └── index.ts
    └── ...
```

---

## 🔌 API Reference

### Issues

```
GET /api/issues/analyze?repo=owner/repo&refresh=true
Authorization: Bearer <clerk_jwt>
```

Fetches all open issues, embeds them, finds duplicate clusters, and generates AI merge suggestions.

### Commits

```
GET /api/commits/story?repo=owner/repo
Authorization: Bearer <clerk_jwt>
```

Fetches recent commits and generates a narrative story grouped into development phases.

### User

```
POST /api/user/sync          # Sync Clerk user to MongoDB
GET  /api/user/me            # Get user profile + saved repos
POST /api/user/repos/save    # Save a repo
DEL  /api/user/repos/remove  # Remove a saved repo
```

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a PR.

```bash
# Fork the repo, then:
git checkout -b feat/your-feature
git commit -m "feat: add your feature"
git push origin feat/your-feature
# Open a Pull Request
```

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

##  Author

**Pabitra Maity** - [@Codewithpabitra](https://github.com/Codewithpabitra) · [Portfolio](https://codewithpabitradev.vercel.app)

<div align="center">

If FuseMeld helped you, consider giving it a ⭐

</div>