import mongoose, { type Document, type Model } from "mongoose";

export interface IHistory extends Document {
  userId: string;
  owner: string;
  repo: string;
  repoUrl: string;
  totalIssues: number;
  clustersFound: number;
  analyzedAt: Date;
}

const historySchema = new mongoose.Schema<IHistory>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    owner: { type: String, required: true },
    repo: { type: String, required: true },
    repoUrl: { type: String, required: true },
    totalIssues: { type: Number, default: 0 },
    clustersFound: { type: Number, default: 0 },
    analyzedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound index for fast per-user history lookup sorted by date
historySchema.index({ userId: 1, analyzedAt: -1 });

// Prevent duplicate entries for same user + repo within 1 hour
historySchema.index(
  { userId: 1, owner: 1, repo: 1, analyzedAt: 1 },
  { unique: false }
);

export const History: Model<IHistory> = mongoose.model<IHistory>(
  "History",
  historySchema
);