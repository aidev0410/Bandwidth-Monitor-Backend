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
};
