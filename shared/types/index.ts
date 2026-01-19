import type { Logger } from "pino";
import type { HttpLogger } from "pino-http";

export interface ApiResponseInput {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  errors?: Record<string, string[]>;
}
export class ServiceError extends Error {
  statusCode: number;
  code?: string;
  details?: any;
  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: any
  ) {
    super(message);
    this.name = "ServiceError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export interface JWTPayload {
  email: string;
  id: string;
  isAdmin: boolean;
}
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export type IsSameSite = "lax" | "strict";

export interface LoggerConfig {
  serviceName: string;
  env?: "production" | "development";
  [key: string]: any;
}

export interface LoggerReturn {
  logger: Logger;
  httpMiddleware: HttpLogger;
}
