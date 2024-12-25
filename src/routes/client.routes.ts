import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";

import {
  createNewClient,
  deleteClient,
  getClients,
  updateClient,
} from "../services/client.servies";

export const router = Router();

router.get(
  "",
  asyncHandler(async (_: Request, res: Response) => {
    res.json(await getClients());
  })
);

router.post(
  "",
  asyncHandler(async (req: any, res: Response) => {
    const { name, ip } = req.body;
    const userId = req.user.id;
    const client = await createNewClient(name, ip, userId);
    res.json(client.getClient());
  })
);

router.put(
  "/:id",
  asyncHandler(async (req: any, res: Response) => {
    const { name, ip, limit } = req.body;
    const { id } = req.params;
    const userId = req.user.id;

    const client = await updateClient(id, name, ip, limit, userId);
    if (!client) {
      res.status(404).send("Client is not existing");
      return;
    }

    res.json(client.getClient());
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const client = await deleteClient(id);
    if (!client) {
      res.status(404).send("Client is not existing");
      return;
    }

    res.send("Delete client successfully");
  })
);
