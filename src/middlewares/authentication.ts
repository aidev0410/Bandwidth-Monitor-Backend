import { NextFunction, Response } from "express";
import asyncHander from "express-async-handler";
import jwt from "jsonwebtoken";

import { ENV } from "../utils/constants";

export const authenticateToken = asyncHander(
  async (req: any, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      res.status(401).json({ message: "Access token not provided" });
      return;
    }

    jwt.verify(accessToken, ENV.JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ message: "Access token expired or invalid" });
        return;
      }

      req.user = decoded;
      next();
    });
  }
);

export const authorizeRole = (roles: string[]) => {
  return asyncHander((req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "You don't have permission to access." });
      return;
    }
    next();
  });
};
