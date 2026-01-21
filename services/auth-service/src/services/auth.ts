import bcrypt from "bcrypt";

import processConfig from "../configs/env.js";
import Users from "../models/auth.model.js";
import { createServiceError } from "@nexus/shared";
import { JwtService } from "@nexus/shared";
import type { JWTPayload, Tokens } from "@nexus/shared";
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
  private jwt = new JwtService(logger)
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
    const user = await Users.findOne({ email: email }).select("+password");
    if (!user) {
      throw createServiceError("Invalid Credentials", 404);
    }
    if (!user.isVerified) {
      throw createServiceError(
        "Please verify your email before loggin in",
        403
      );
    }
    const match = await bcrypt.compare(password, user.password as string);
    if (!match) {
      throw createServiceError("Invalid Credentials", 400);
    }
    const payload: JWTPayload = {
      email: user.email,
      id: user.id,
      isAdmin: user.isAdmin,
    };
    const generateAccessToken = this.jwt.generateToken(
      payload,
      this.accessSecret,
      this.accessSecretDuration
    );
    const generateRefreshToken = this.jwt.generateToken(
      payload,
      this.refreshSecret,
      this.refreshSecretDuration
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
    await this.jwt.verifyToken(token, this.verificationSecret,);
  };
  refresh = async (token: string): Promise<Tokens> => {
    const data = await this.jwt.verifyToken(token, this.refreshSecret);
    const newAccessToken: string = await this.jwt.generateToken(
      data,
      this.accessSecret,
      this.accessSecretDuration,
    );
    const tokens: Tokens = {
      accessToken: newAccessToken,
      refreshToken: token,
    };
    return tokens;
  };
  logout = async (tokens: Tokens): Promise<void> => {
    const unResolvedresults = [
      this.jwt.decodeToken(tokens.accessToken),
      this.jwt.decodeToken(tokens.refreshToken),
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
