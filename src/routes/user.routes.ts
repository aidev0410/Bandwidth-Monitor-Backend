import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";

import { updateUser, deleteUser, getAllUsers } from "../services/user.services";
import { authorizeRole } from "../middlewares/authentication";

export const router = Router();

router.get(
  "",
  authorizeRole(["admin"]),
  asyncHandler(async (_: Request, res: Response) => {
    res.json(await getAllUsers());
  })
);

router.put(
  "/:id",
  asyncHandler(async (req: any, res: Response) => {
    const { username, name, ip, limit } = req.body;
    const { id } = req.params;

    const user = await updateUser(id, username, name, ip, limit);
    if (!user) {
      res.status(404).send("Client is not existing");
      return;
    }

    res.json(user.getUser());
  })
);

router.delete(
  "/:id",
  authorizeRole(["admin"]),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await deleteUser(id);
    if (!user) {
      res.status(404).send("User is not existing");
      return;
    }

    res.send("Delete user successfully");
  })
);
