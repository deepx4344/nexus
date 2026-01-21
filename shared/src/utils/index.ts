import { ServiceError, type ApiResponseInput } from "../types/index.js";

export function createServiceError(
  message: string,
  statusCode: number,
  code?: string,
  details?: any
): ServiceError {
  return new ServiceError(message, statusCode, code, details);
}

export function createAPIResponse(input: ApiResponseInput) {
  return input;
}