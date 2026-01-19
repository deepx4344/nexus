import { pino, type Logger, type LoggerOptions } from "pino";
import { pinoHttp, type HttpLogger } from "pino-http";
import { randomUUID } from "node:crypto";

import { type LoggerConfig, type LoggerReturn } from "../types/index.js";

const createLogger = ({
  serviceName,
  env = "production",
  ...extra
}: LoggerConfig): LoggerReturn => {
  const isProduction: boolean = env === "production";
  const pinoOptions: LoggerOptions = {
    level: isProduction ? "info" : "debug",
    base: { service: serviceName, ...extra },
    redact: {
      paths: [
        "req.headers.authorization",
        "req.body.password",
        "user.email",
        "user.token",
      ],
      censor: "[redacted]",
    },
    formatters: {
      level: (label) => ({ level: label.toUpperCase() }),
    },
    transport: !isProduction
      ? {
          target: "pino-pretty",
          options: { colorize: true },
        }
      : undefined,
  };
  const logger: Logger = pino(pinoOptions);
  const httpMiddleware: HttpLogger = pinoHttp({
    logger,
    genReqId: (req) => req.headers["x-request-id"] || randomUUID(),
    customSuccessMessage: (req, res) =>
      `${req.method} ${req.url} completed ${req.statusCode}`,
    customErrorMessage: (req, res, err) =>
      `${req.method} ${req.url} failed ${err.message}`,
  });
  return { logger, httpMiddleware };
};

export default createLogger;
