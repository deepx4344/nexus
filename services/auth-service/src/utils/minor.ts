import type { CookieOptions } from "express";
import processConfig from "../configs/env.js";
import { setAndGetCookieOptions } from "@nexus/shared";

export const cookieSigned: boolean = Boolean(processConfig.COOKIE.SECRET)
export const ProductionEnviroment: boolean = processConfig.ENVIROMENT === "production"


export const cookieOptions: CookieOptions = setAndGetCookieOptions(
  cookieSigned,
  "7d",
  ProductionEnviroment,
  "lax"
);