import { type CookieOptions } from "express";
import ms from "ms";

import { type IsSameSite } from "../types/index.js";

export const setAndGetCookieOptions = (
  isSigned: boolean = true,
  theMaxAge: string = "7d",
  isSecure: boolean = true,
  isSameSite: IsSameSite = "lax"
  ): CookieOptions => {
  const cookieOptions: CookieOptions = {
    signed: isSigned,
    maxAge: ms(theMaxAge as string),
    secure: isSecure,
    sameSite: isSameSite,
    httpOnly: true,
  };
  return cookieOptions;
};
