import { Router, Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { router as authRouter } from "./auth.routes";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_: Request, res: Response) => {
    res.send("Server is healthy.");
  })
);
router.use("/auth", authRouter);

export default router;
