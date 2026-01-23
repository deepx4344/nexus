import bcrypt from "bcrypt";

import processConfig from "../configs/env.js";
import Users from "../models/auth.model.js";
import { createServiceError } from "@nexus/shared";
import { JwtService, generateRandomCodeWithGivenLength } from "@nexus/shared";
import type { JWTPayload, Tokens } from "@nexus/shared";
import redisService from "./redis.js";
import { logger } from "../configs/logger.js";
import kafkaServices from "./kafka.js";

class AuthService {
  private readonly accessSecret: string = processConfig.JWTs.ACCESS.SECRET!;
  private readonly accessSecretDuration = processConfig.JWTs.ACCESS.DURATION!;
  private readonly refreshSecret: string = processConfig.JWTs.REFRESH.SECRET!;
  private readonly refreshSecretDuration: string =
    processConfig.JWTs.REFRESH.DURATION!;
  private readonly bcryptRounds: number = Number(processConfig.BCRYPTROUNDS);
  private readonly verificationSecret: string =
    processConfig.JWTs.VERIFICATION.SECRET!;
  private jwt = new JwtService(logger);
  private hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, this.bcryptRounds);
  };
  register = async (
    email: string,
    password: string,
    others: any
  ): Promise<void> => {
    const exists: boolean = !!(await Users.exists({ email: email }));
    if (exists) {
      throw createServiceError("User already exists", 409);
    }
    const hashedPassword: string = await this.hashPassword(password);
    const user = new Users({
      email: email,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    const dataTosend = {
      authId: savedUser.id,
      email: email,
      ...others,
    };
    await kafkaServices.produceUserRegistrationMessage(dataTosend)
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
    const user = await this.jwt.verifyToken(token, this.verificationSecret);
    await Users.findByIdAndUpdate(user.id, {
      isVerified: true,
    });
  };
  refresh = async (token: string): Promise<Tokens> => {
    const blacklisted: boolean = await redisService.isTokenBlacklisted(
      token,
      false
    );
    if (blacklisted) {
      throw createServiceError("Invalid Refresh Token", 401);
    }
    const data = await this.jwt.verifyToken(token, this.refreshSecret);
    const newAccessToken: string = await this.jwt.generateToken(
      data,
      this.accessSecret,
      this.accessSecretDuration
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
  initiatePasswordChange = async (userId: string): Promise<void> => {
    const code: number = generateRandomCodeWithGivenLength(8);
    await redisService.setPasswordRecoveryCode(userId, code);
    return;
  };
  confirmPasswordResetCode = async (
    userId: string,
    code: number
  ): Promise<void> => {
    const codeReceivedIsEqual: boolean =
      (await redisService.getPasswordRecoveryCode(userId)) === code;
    if (!codeReceivedIsEqual) {
      throw createServiceError("Invalid Code", 422);
    }
  };
  changePassword = async (userId: string, password: string): Promise<void> => {
    const hashedPassword: string = await this.hashPassword(password);
    await Users.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
  };
}

const authService = new AuthService();
export default authService;
