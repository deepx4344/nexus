import Joi, { type CustomHelpers } from "joi";

const passwordComplexity = (value: string, helpers: CustomHelpers) => {
  const failures: string[] = [];
  if (value.length < 8) failures.push("at least 8 characters");
  if (value.length > 128) failures.push("no more than 128 characters");
  if (!/[A-Z]/.test(value)) failures.push("an uppercase letter");
  if (!/[a-z]/.test(value)) failures.push("a lowercase letter");
  if (!/[0-9]/.test(value)) failures.push("a number");
  if (!/[^A-Za-z0-9]/.test(value)) failures.push("a special character");
  if (/\s/.test(value)) failures.push("no spaces");

  const parent = (helpers.state as any)?.ancestors?.[0] as
    | Record<string, unknown>
    | undefined;
  const name =
    parent && typeof parent["name"] === "string"
      ? (parent["name"] as string)
      : undefined;
  const email =
    parent && typeof parent["email"] === "string"
      ? (parent["email"] as string)
      : undefined;
  const normalized = value.trim().toLowerCase();

  if (name) {
    const fullName = name.trim().toLowerCase();
    if (normalized === fullName) {
      failures.push("must not be the same as your name");
    } else {
      const parts = fullName.split(/\s+/).filter((p) => p.length >= 3);
      if (parts.some((p) => normalized.includes(p))) {
        failures.push("must not contain parts of your name");
      }
    }
  }

  if (email) {
    const fullEmail = email.trim().toLowerCase();
    if (normalized === fullEmail) {
      failures.push("must not be the same as your email");
    } else {
      const local = fullEmail.split("@")[0] || "";
      if (local.length >= 3 && normalized.includes(local)) {
        failures.push("must not contain your email/local-part");
      }
    }
  }

  if (failures.length) {
    return helpers.error("string.passwordComplexity", {
      failures: failures.join(", "),
    });
  }
  return value;
};

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
