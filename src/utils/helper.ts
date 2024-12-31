import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import * as ping from "ping";

import { UserRole } from "./type";
import { ENV, UNIT } from "./constants";
import Logger from "./logger";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (
  userId: string,
  role: UserRole,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign({ id: userId, role: role }, secret, { expiresIn });
};

export const loginRocketChatServer = async () => {
  try {
    const res = await axios.post(
      `${ENV.ROCKET_CHAT_SERVER_URL}/login`,
      {
        user: ENV.ROCKET_CHAT_USER,
        password: ENV.ROCKET_CHAT_PASSWORD,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data["data"];
  } catch (error) {
    Logger.error(`Rocket Chat Server Login failed: ${error}`);
    return null;
  }
};

export const sendRocketChatMessage = async (user: string, message: string) => {
  const info = await loginRocketChatServer();
  if (info === null) {
    return;
  }

  try {
    const userId = info["userId"];
    const authToken = info["authToken"];
    await axios.post(
      `${ENV.ROCKET_CHAT_SERVER_URL}/chat.postMessage`,
      { channel: ENV.ROCKET_CHAT_CHANNEL, text: `@${user}, ${message}` },
      {
        headers: {
          "X-Auth-Token": authToken,
          "X-User-Id": userId,
        },
      }
    );
  } catch (error) {
    Logger.error(`Failed to send message: ${error}`);
  }
};

export const bytesToGB = (bytes: number) => {
  return Math.floor(bytes / UNIT.HALF_GB) * 0.5;
};

export const pingIp = async (ip: string) => {
  try {
    const res = await ping.promise.probe(ip);
    return res.alive;
  } catch (error) {
    return false;
  }
};
