import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

import { createServiceError } from "./index.js";
import { mapJwtError } from "./mapJwt.js";
import type { JWTPayload } from "../types/index.js";
import type { Logger } from "pino";

export const generateToken = async (
  payload: JWTPayload,
  key: string,
  duration: string,
  logger: Logger
): Promise<string> => {
  const options: SignOptions = {
    expiresIn: duration as any,
  };
  let token: string;
  try {
    token = jwt.sign(payload, key, options);
  } catch (err: unknown) {
    logger.error(`Error generating token ${err}`);
    throw createServiceError("Could not generate token", 500);
  }
  return token;
};
export const verifyToken = async (
  token: string,
  key: string,
  logger: Logger
): Promise<JWTPayload> => {
  let verified: any;
  try {
    verified = jwt.verify(token, key);
  } catch (err: unknown) {
    mapJwtError(err, logger);
  }
  return verified;
};

export const decodeToken = async (
  token: string,
  logger: Logger
): Promise<JwtPayload> => {
  let verified: any;
  try {
    verified = jwt.decode(token);
  } catch (err: unknown) {
    mapJwtError(err, logger);
  }
  return verified;
};
