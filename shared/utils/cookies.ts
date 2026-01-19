import { type CookieOptions } from "express";
import ms, { type StringValue } from "ms";

import { type IsSameSite } from "../types/index.js";

const setAndGetCookieOptions = (
  isSigned: boolean = true,
  theMaxAge: string = "7d",
  isSecure: boolean = true,
  isSameSite: IsSameSite = "lax"
): CookieOptions => {
  const cookieOptions: CookieOptions = {
    signed: isSigned,
    maxAge: ms(theMaxAge as StringValue),
    secure: isSecure,
    sameSite: isSameSite,
    httpOnly: true,
  };
  return cookieOptions;
};

export default setAndGetCookieOptions;
