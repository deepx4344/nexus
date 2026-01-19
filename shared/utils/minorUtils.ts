import { type ApiResponseInput } from "../types/index.js";

export const successDataFormat: ApiResponseInput = {
  success: true,
  message: "",
};

export const failureDataFormat: ApiResponseInput = {
  success: false,
  message: "",
};
