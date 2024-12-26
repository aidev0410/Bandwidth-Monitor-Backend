import { Router, Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { router as authRouter } from "./auth.routes";
import { router as userRouter } from "./user.routes";
import { router as bandwidthRouter } from "./bandwidth.routes";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_: Request, res: Response) => {
    res.send("Server is healthy.");
  })
);
router.use("/auth", authRouter);
router.use("/network", bandwidthRouter);
router.use("/users", userRouter);

export default router;
