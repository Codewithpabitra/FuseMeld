import mongoose, { type Model, type Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  username: string;
  savedRepos: string[];
  createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
     clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    savedRepos: {
      type: [String],
      default: [],
    },
}, { timestamps: true });

export const User: Model<IUser> = mongoose.model<IUser>("User",userSchema);
