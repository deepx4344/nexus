import express, { type Express } from "express";

import { errorMiddleware } from "@nexus/shared";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(errorMiddleware);
export default app;
