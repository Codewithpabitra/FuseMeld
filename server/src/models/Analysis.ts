import mongoose, { type Model, type Document } from "mongoose";

interface IIssue {
  id: number;
  title: string;
  body: string;
  url: string;
  number: number;
  labels: string[];
  state: string;
}

interface IDuplicateCluster {
  issues: IIssue[];
  similarityScore: number;
  mergeSuggestion: string;
}

interface ICommitPhase {
  title: string;
  period: string;
  commits: string[];
  story: string;
}

export interface IAnalysis extends Document {
  repoUrl: string;
  owner: string;
  repo: string;
  clusters: IDuplicateCluster[];
  commitStory: ICommitPhase[];
  totalIssues: number;
  cachedAt: Date;
}

const analysisSchema = new mongoose.Schema<IAnalysis>(
  {
    repoUrl: { type: String, required: true },
    owner: { type: String, required: true },
    repo: { type: String, required: true },
    clusters: [
      {
        issues: [
          {
            id: Number,
            title: String,
            body: String,
            url: String,
            number: Number,
            labels: [String],
            state: String,
          },
        ],
        similarityScore: Number,
        mergeSuggestion: String,
      },
    ],
    commitStory: [
      {
        title: String,
        period: String,
        commits: [String],
        story: String,
      },
    ],
    totalIssues: { type: Number, default: 0 },
    cachedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Index for fast lookup by repo
analysisSchema.index({ owner: 1, repo: 1 });

export const Analysis: Model<IAnalysis> = mongoose.model<IAnalysis>(
  "Analysis",
  analysisSchema
);
