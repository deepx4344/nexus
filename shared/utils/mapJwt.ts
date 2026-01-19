import jwt from "jsonwebtoken";
const { JsonWebTokenError, TokenExpiredError } = jwt;
import { createServiceError } from "./index.js";
import { ServiceError } from "../types/index.js";
import type { Logger } from "pino";

export function ensureServiceError(
  err: unknown,
  logger: Logger,
  context = ""
): never {
  if (err instanceof ServiceError) throw err;
  logger.error(context || `Unhandled error ${err}`);
  throw createServiceError("Something went wrong", 500);
}

export function mapJwtError(err: unknown, logger: Logger): never {
  if (err instanceof ServiceError) throw err;
  if (err instanceof TokenExpiredError) {
    throw createServiceError("Token expired", 401);
  }
  if (err instanceof JsonWebTokenError) {
    throw createServiceError("Invalid token", 401);
  }
  ensureServiceError(err, logger, "JWT verification");
}
