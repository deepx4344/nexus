import {
  registerSchema,
  ServiceError,
  type ApiResponseInput,
  type UserRegistationInterface,
} from "../types/index.js";

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

export const KafkaTopicToSchemaMapping = {
  "user-registered": registerSchema,
};

export const KafkaTopicToInterfaceMapping = {
  "user-registered": {} as UserRegistationInterface,
};
export const allTopicsType = Object.keys(KafkaTopicToSchemaMapping);
