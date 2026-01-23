import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "@nexus/shared";

import apiGatewayProxy from "./configs/proxy.js";
import corsOptions from "./middlewares/cors.js";
import processConfig from "./configs/env.js";
import authMiddleware from "./middlewares/auth.js";
const app: Express = express();

app.use(helmet());
app.use(cookieParser(processConfig.COOKIE.SECRET));
app.use(cors(corsOptions));

app.use(authMiddleware);

app.use("/api", apiGatewayProxy);

app.use(errorMiddleware);

export default app;
