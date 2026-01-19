import bcrypt from "bcrypt";

import processConfig from "../configs/env.js";
import Users from "../models/auth.model.js";
import { createServiceError } from "@shared/utils/index.js";
import { verifyToken, generateToken, decodeToken } from "@shared/utils/jwt.js";
import type { JWTPayload, Tokens } from "@shared/types/index.js";
import redisService from "./redis.js";
import { logger } from "../configs/logger.js";

class AuthService {
  private readonly accessSecret: string = processConfig.JWTs.ACCESS.SECRET!;
  private readonly accessSecretDuration = processConfig.JWTs.ACCESS.DURATION!;
  private readonly refreshSecret: string = processConfig.JWTs.REFRESH.SECRET!;
  private readonly refreshSecretDuration: string =
    processConfig.JWTs.REFRESH.DURATION!;
  private readonly bcryptRounds: number = Number(processConfig.BCRYPTROUNDS);
  private readonly verificationSecret: string =
    processConfig.JWTs.VERIFICATION.SECRET!;
  register = async (
    email: string,
    name: string,
    password: string
  ): Promise<void> => {
    const exists: boolean = !!(await Users.exists({ email: email }));
    if (exists) {
      throw createServiceError("User already exists", 409);
    }
    const hashedPassword: string = await bcrypt.hash(
      password,
      this.bcryptRounds
    );
    const user = new Users({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await user.save();
  };
  login = async (email: string, password: string): Promise<Tokens> => {
    const user = await Users.findOne({ email: email });
    if (!user) {
      throw createServiceError("Invalid Credentials", 404);
    }
    if (!user.isVerified) {
      throw createServiceError(
        "Please verify your email before loggin in",
        403
      );
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw createServiceError("Invalid Credentials", 400);
    }
    const payload: JWTPayload = {
      email: user.email,
      id: user.id,
      isAdmin: user.isAdmin,
    };
    const generateAccessToken = generateToken(
      payload,
      this.accessSecret,
      this.accessSecretDuration,
      logger
    );
    const generateRefreshToken = generateToken(
      payload,
      this.refreshSecret,
      this.refreshSecretDuration,
      logger
    );

    const unresolvedPromises = [generateAccessToken, generateRefreshToken];
    const resolvedPromises = await Promise.all(unresolvedPromises);
    const tokens: Tokens = {
      accessToken: resolvedPromises[0],
      refreshToken: resolvedPromises[1],
    };
    return tokens;
  };
  verifyEmail = async (token: string): Promise<void> => {
    await verifyToken(token, this.verificationSecret, logger);
  };
  refresh = async (token: string): Promise<Tokens> => {
    const data = await verifyToken(token, this.refreshSecret, logger);
    const newAccessToken: string = await generateToken(
      data,
      this.accessSecret,
      this.accessSecretDuration,
      logger
    );
    const tokens: Tokens = {
      accessToken: newAccessToken,
      refreshToken: token,
    };
    return tokens;
  };
  logout = async (tokens: Tokens): Promise<void> => {
    const unResolvedresults = [
      decodeToken(tokens.accessToken, logger),
      decodeToken(tokens.refreshToken, logger),
    ];
    const currentTime = Math.floor(Date.now() / 1000);
    const resolvedReults = await Promise.all(unResolvedresults);
    const accessTimeRemaining = resolvedReults[0].exp! - currentTime;
    const refreshTimeRemaining = resolvedReults[1].exp! - currentTime;
    const unresolvedInvalidatingTokens = [
      redisService.setTokenBlacklisted(
        tokens.accessToken,
        accessTimeRemaining,
        true
      ),
      redisService.setTokenBlacklisted(
        tokens.refreshToken,
        refreshTimeRemaining,
        false
      ),
    ];
    await Promise.all(unresolvedInvalidatingTokens);
  };
}

const authService = new AuthService();
export default authService;
