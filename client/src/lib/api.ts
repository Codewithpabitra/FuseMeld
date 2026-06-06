import axios from "axios";
import type { AnalysisResult, StoryResult, User } from "../types/index.js";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach Clerk token to every request
// Call this once after Clerk loads in main.tsx
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Issues
export const analyzeRepo = async (
  repo: string,
  refresh = false
): Promise<AnalysisResult> => {
  const { data } = await api.get<AnalysisResult>("/api/issues/analyze", {
    params: { repo, refresh: refresh ? "true" : undefined },
  });
  return data;
};

// Commits
export const fetchCommitStory = async (
  repo: string,
  refresh = false
): Promise<StoryResult> => {
  const { data } = await api.get<StoryResult>("/api/commits/story", {
    params: { repo, refresh: refresh ? "true" : undefined },
  });
  return data;
};

// User
export const syncUser = async (payload: {
  email: string;
  username: string;
}): Promise<User> => {
  const { data } = await api.post<{ user: User }>("/api/user/sync", payload);
  return data.user;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<{ user: User }>("/api/user/me");
  return data.user;
};

export const saveRepo = async (repoUrl: string): Promise<string[]> => {
  const { data } = await api.post<{ savedRepos: string[] }>(
    "/api/user/repos/save",
    { repoUrl }
  );
  return data.savedRepos;
};

export const removeRepo = async (repoUrl: string): Promise<string[]> => {
  const { data } = await api.delete<{ savedRepos: string[] }>(
    "/api/user/repos/remove",
    { data: { repoUrl } }
  );
  return data.savedRepos;
};