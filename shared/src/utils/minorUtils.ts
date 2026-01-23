import { type ApiResponseInput } from "../types/index.js";

export const successDataFormat: ApiResponseInput = {
  success: true,
  message: "",
};

export const failureDataFormat: ApiResponseInput = {
  success: false,
  message: "",
};
export const generateRandomCodeWithGivenLength = (length: number): number => {
  let cummulativeNumberInString: string = "";
  for (let i = 0; i < length; i++) {
    cummulativeNumberInString += Math.floor(Math.random() * 10);
  }
  return Number(cummulativeNumberInString);
};
