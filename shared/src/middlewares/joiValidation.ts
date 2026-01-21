import Joi from "joi";
import type { Response, Request, NextFunction } from "express";
import { createAPIResponse } from "../utils/index.js";
import { failureDataFormat } from "../utils/minorUtils.js";

export const validateSchema = (
  schema: Joi.Schema,
  property: "body" | "query" | "params" = "body",
  options: Joi.ValidationOptions = { abortEarly: false, stripUnknown: true }
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const target = (req as any)[property];
    const { error, value } = schema.validate(target, options);
    if (error) {
      const details = error.details.map((d: any) => d.message);
      failureDataFormat.message = "Invalid Data";
      failureDataFormat.errors = { general: details };
      return res.status(400).json(createAPIResponse(failureDataFormat));
    }
    (req as any)[property] = value;
    return next();
  };
};
