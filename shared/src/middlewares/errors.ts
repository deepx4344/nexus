import { ServiceError } from "../types/index.js";
import { failureDataFormat } from "../utils/minorUtils.js";
import { createAPIResponse } from "../utils/index.js";
import type { Request, Response, NextFunction } from "express";

export const errormiddleWare = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = 500;
  let message: string = "An Error Occured";

  if (err instanceof ServiceError) {
    statusCode = err.statusCode;
    const defaults: Record<number, string> = {
      400: "Bad Request",
      401: "Unauthorized",
      403: "Unauthorized",
      404: "Not Found",
      409: "Conflict",
      502: "Bad Gateway",
      503: "Service Error",
    };
    message = err.message || defaults[statusCode] || message;
  } else if (err && typeof err === "object" && "statusCode" in (err as any)) {
    const anyErr = err as any;
    statusCode = anyErr.statusCode || statusCode;
    message = anyErr.message || message;
    console.error("Handled error object with statusCode", { error: anyErr });
  } else {
    console.error(err);
  }
  const apiResponse = failureDataFormat;
  apiResponse.message = message;

  return res.status(statusCode).json(createAPIResponse(apiResponse));
};
