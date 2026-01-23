import type { Logger } from "pino";
import type { HttpLogger } from "pino-http";
import type { KafkaTopicToSchemaMapping } from "../utils/index.js";

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
export const registerSchema = JSON.stringify({
  type: "record",
  name: "user-registered",
  namespace: "com.auth.events",
  fields: [
    { name: "authId", type: "string" },
    { name: "email", type: "string" },
    { name: "firstname", type: "string" },
    { name: "lastname", type: "string" },
    { name: "avatarUrl", type: "string" },
    { name: "phone", type: "string" },
    { name: "currency", type: "string" },
    { name: "language", type: "string" },
    { name: "label", type: "string" },
    { name: "street", type: "string" },
    { name: "city", type: "string" },
    { name: "state", type: "string" },
    { name: "postalCode", type: "number" },
    { name: "country", type: "string" },
  ],
});



export interface UserRegistationInterface {
  authId:string;
  email:string;
  firstname:string;
  lastname:string;
  avatarUrl:string;
  phone:string;
  currency:string;
  language:string;
  label:string;
  street:string;
  city:string;
  state:string;
  postalCode:number;
  country:string;
}

