import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import type { Logger } from "pino";
import { createServiceError } from "./index.js";
import { ServiceError, type JWTPayload } from "../types/index.js";

const { JsonWebTokenError, TokenExpiredError } = jwt;

export class JwtService {
  constructor(private logger: Logger) {}

  public async generateToken(
    payload: JWTPayload,
    key: string,
    duration: string
  ): Promise<string> {
    const options: SignOptions = {
      expiresIn: duration as any,
    };
    try {
      return jwt.sign(payload, key, options);
    } catch (err: unknown) {
      this.logger.error(`Error generating token ${err}`);
      throw createServiceError("Could not generate token", 500);
    }
  }

  public async verifyToken(token: string, key: string): Promise<JWTPayload> {
    try {
      return jwt.verify(token, key) as JWTPayload;
    } catch (err: unknown) {
      this.handleJwtError(err);
    }
  }

  public async decodeToken(token: string): Promise<JwtPayload> {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (err: unknown) {
      this.handleJwtError(err);
    }
  }

  private handleJwtError(err: unknown): never {
    if (err instanceof ServiceError) throw err;
    if (err instanceof TokenExpiredError) {
      throw createServiceError("Token expired", 401);
    }
    if (err instanceof JsonWebTokenError) {
      throw createServiceError("Invalid token", 401);
    }
    this.ensureServiceError(err, "JWT verification");
  }

  private ensureServiceError(err: unknown, context = ""): never {
    if (err instanceof ServiceError) throw err;
    this.logger.error(context || `Unhandled error ${err}`);
    throw createServiceError("Something went wrong", 500);
  }
}
