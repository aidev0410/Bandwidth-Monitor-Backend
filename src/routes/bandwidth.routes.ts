import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";

import { getUserByIp } from "../services/user.services";
import {
  addBandwidth,
  checkStatus,
  getBandwidthMonthlyData,
} from "../services/bandwidth.services";
import Logger from "../utils/logger";

export const router = Router();

router.post(
  "/add",
  asyncHandler(async (req: Request, res: Response) => {
    const { ip, infos } = req.body;
    Logger.info(req.body);
    const user = await getUserByIp(ip);
    if (!user) {
      res.status(404).send("User is not existing.");
      return;
    }
    await addBandwidth(ip, infos, user);
    res.send("Add bandwith information successfully.");
  })
);

router.get(
  "/status",
  asyncHandler(async (_: Request, res: Response) => {
    res.json(await checkStatus());
  })
);

router.get(
  "/:year/:month",
  asyncHandler(async (req: Request, res: Response) => {
    const { year, month } = req.params;
    res.json(await getBandwidthMonthlyData(Number(year), Number(month)));
  })
);
