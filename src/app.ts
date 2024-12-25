import express, { Express } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import errorHandler from "./middlewares/errorHandler";
import httpLogger from "./middlewares/httpLogger";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(cookieParser());
app.use(httpLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", router);
app.use(errorHandler);

export default app;
