import Joi, { type CustomHelpers } from "joi";
import passwordComplexity from "../utils/password.js";

export const registerSchema = Joi.object({
  name: Joi.string()
    .required()
    .custom((value: string, helpers: CustomHelpers) => {
      const words = value.trim().split(/\s+/);
      if (words.length < 2 || words[0] === "") {
        return helpers.error("Name must contain at least 2 names");
      }
      return value;
    }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().custom(passwordComplexity).messages({
    "any.required": "Password is required",
    "string.passwordComplexity": "Password must satisfy {{#failures}}",
  }),
}).unknown();

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

export const forgotPasswordSchema = Joi.object({
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
  id: Joi.string()
    .required()
    .messages({ "any.required": "Password is required" }),
});
