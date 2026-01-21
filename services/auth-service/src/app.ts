import express, { type Express } from "express";

import router from "./routes/auth.js";
import { errormiddleWare } from "@nexus/shared";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", router);

app.use(errormiddleWare);
export default app;
