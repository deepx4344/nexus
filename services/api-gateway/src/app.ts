import express, {type Express } from "express";
import helmet from "helmet";
import cors from "cors"

import apiGatewayProxy from "./configs/proxy.js";
import corsOptions from "./middlewares/cors.js";
const app: Express = express();

app.use(helmet());
app.use(cors(corsOptions))


app.use("/api", apiGatewayProxy);

export default app;
