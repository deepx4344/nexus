import { asyncHandler, createServiceError, type Tokens } from "@nexus/shared";
import redisService from "../services/redis.js";
import jwt from "../utils/jwt.js";
import processConfig from "../configs/env.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  if (req.url.startsWith("/api/auth")) {
    return next();
  }
  const tokens: Tokens = req.signedCookies["tokens"];
  if (!tokens || !tokens.accessToken) {
    throw createServiceError("Unauthorized", 401);
  }
  const blacklisted: boolean = await redisService.isTokenBlacklisted(
    tokens.accessToken
  );
  if (blacklisted) {
    throw createServiceError("Unauthorized", 401);
  }
  const user = await jwt.verifyToken(
    tokens.accessToken,
    processConfig.JWTs.ACCESS_SECRET as string
  );
  if (!user) {
    throw createServiceError("Invalid or Expired Token", 401);
  }
  req.user = user;
  next();
});

export default authMiddleware;
