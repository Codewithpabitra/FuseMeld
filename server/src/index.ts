import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";
import issuesRouter from "./routes/issues.js";
import commitsRouter from "./routes/commits.js";
import userRouter from "./routes/user.js";
import { embedText } from "./services/embeddings.js";
import publicRouter from "./routes/public.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

await connectDB();

app.use(express.json());
app.use(cors({
    origin : process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));

// health check route
app.use("/health", (req: Request, res: Response) => {
    res.json({
        status : "OK",
        message : "FuseMeld API is Working"
    })
});

// Public Routes
app.use("/api/public", publicRouter);

// Protected Routes
app.use("/api/issues", issuesRouter);
app.use("/api/commits", commitsRouter);
app.use("/api/user", userRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

await embedText("warmup");

app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
})