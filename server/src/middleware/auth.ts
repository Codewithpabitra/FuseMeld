import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({
        error: "Malformed token",
      });
      return;
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    if (!payload.sub) {
      res.status(401).json({
        error: "Invalid token payload",
      });
      return;
    }
    
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
