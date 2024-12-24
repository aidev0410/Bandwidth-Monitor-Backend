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
};
