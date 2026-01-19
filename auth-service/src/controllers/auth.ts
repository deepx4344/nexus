import type { CookieOptions, Request, Response } from "express";

import asyncHandler from "@shared/utils/async.js";
import setAndGetCookieOptions from "@shared/utils/cookies.js";
import { successDataFormat } from "@shared/utils/minorUtils.js";
import { createAPIResponse } from "@shared/utils/index.js";

import authService from "../services/auth.js";
import type { Tokens } from "@shared/types/index.js";
import { cookieOptions } from "../utils/minor.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  await authService.register(email, name, password);
  const apiResponse = successDataFormat;
  apiResponse.message = "User Created Successfully";
  return res.status(201).json(createAPIResponse(apiResponse));
});
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const tokens: Tokens = await authService.login(email, password);
  const apiResponse = successDataFormat;
  apiResponse.message = "User logged in Succesfully";
  res.cookie("tokens", tokens, cookieOptions);
  return res.status(200).json(createAPIResponse(apiResponse));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const token: string = req.params["token"] as string;
  await authService.verifyEmail(token);
  const apiResponse = successDataFormat;
  apiResponse.message = "User email verified successfully";
  return res.status(200).json(createAPIResponse(apiResponse));
});

export const refresh = asyncHandler(async (req, res) => {
  const tokens: Tokens = req.signedCookies("tokens");
  const newTokens: Tokens = await authService.refresh(tokens.refreshToken);
  res.cookie("tokens", newTokens, cookieOptions);
  res.status(204).end();
});

export const logout = asyncHandler(async (req, res) => {
  const tokens: Tokens = req.signedCookies("tokens");
  await authService.logout(tokens);
  res.clearCookie("tokens", cookieOptions);
  res.status(204).end();
});
