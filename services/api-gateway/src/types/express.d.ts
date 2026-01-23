import { JWTPayload } from "@nexus/shared";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
    interface Locals {
    }
  }
}
