import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../utils/types";
import { NextFunction, Response } from "express";


export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.cookies["access_token"];

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as {
      type: string;
      userid: string;
      role: string;
    };

    if (decoded.type !== "access") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.authUser = {
      userid: decoded.userid,
      role: decoded.role,
    };

    return next();
  } catch (err: any) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}