import { asyncHandler, type ApiResponseInput,createAPIResponse } from "@nexus/shared";

import authService from "../services/auth.js";
import type { Tokens } from "@nexus/shared";
import { cookieOptions } from "../utils/minor.js";

export const register = asyncHandler(async (req, res) => {
  const {email,password,...others} = req.body;
  await authService.register(email,password,others);
  const apiResponse: ApiResponseInput = {
    success: true,
    message: "User Created Successfully",
  };
  return res.status(201).json(createAPIResponse(apiResponse));
});
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const tokens: Tokens = await authService.login(email, password);
  const apiResponse: ApiResponseInput = {
    success: true,
    message: "User logged in Succesfully",
  };
  res.cookie("tokens", tokens, cookieOptions);
  return res.status(200).json(createAPIResponse(apiResponse));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const token: string = req.params["token"] as string;
  await authService.verifyEmail(token);
  const apiResponse: ApiResponseInput = {
    success: true,
    message: "User email verified successfully",
  };
  return res.status(200).json(createAPIResponse(apiResponse));
});

export const refresh = asyncHandler(async (req, res) => {
  const tokens: Tokens = req.signedCookies["tokens"];
  const newTokens: Tokens = await authService.refresh(tokens.refreshToken);
  res.cookie("tokens", newTokens, cookieOptions);
  res.status(204).end();
});

export const logout = asyncHandler(async (req, res) => {
  const tokens: Tokens = req.signedCookies["tokens"];
  await authService.logout(tokens);
  res.clearCookie("tokens", cookieOptions);
  res.status(204).end();
});

export const initiatePasswordChange = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  await authService.initiatePasswordChange(userId);
  res.status(200).json(
    createAPIResponse({
      success: true,
      message: "A code has been sent to your email",
    })
  );
});

export const confirmPasswordResetCode = asyncHandler(async (req, res) => {
  const { userId, code } = req.body;
  await authService.confirmPasswordResetCode(userId, code);
  res.status(200).json(
    createAPIResponse({
      success: true,
      message: "Code verified",
    })
  );
});

export const changePassword = asyncHandler(async (req, res) => {
  const { userId, password } = req.body;
  await authService.changePassword(userId, password);
  res.status(200).json(
    createAPIResponse({
      success: true,
      message: "Password changed successfully",
    })
  );
});
