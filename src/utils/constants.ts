import dotenv from "dotenv";
dotenv.config();

export const enum MODE {
  DEV = "development",
  PROD = "production",
}

export const ENV = {
  HOST: process.env.HOST || "127.0.0.1",
  PORT: Number(process.env.PORT || "5000"),
  MODE: process.env.NODE_ENV || MODE.DEV,

  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,

  JWT_SECRET: process.env.JWT_SECRET ?? "",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? "",

  ROCKET_CHAT_USER: process.env.ROCKET_CHAT_USER ?? "",
  ROCKET_CHAT_PASSWORD: process.env.ROCKET_CHAT_PASSWORD ?? "",
  ROCKET_CHAT_CHANNEL: process.env.ROCKET_CHAT_CHANNEL ?? "",
  ROCKET_CHAT_SERVER_URL: process.env.ROCKET_CHAT_SERVER_URL ?? "",
};

export const ACCESS_TOKEN_EXPIRES_IN = "15m";
export const REFRESH_TOKEN_EXPIRES_IN = "7d";

export const UNIT = {
  ONE_MB: 1024 * 1024,
  HALF_GB: 512 * 1024 * 1024,
};

export const LIMITS = [500, 200, 100];
