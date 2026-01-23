import express, { type Router } from "express";
import {
  changePassword,
  confirmPasswordResetCode,
  initiatePasswordChange,
  login,
  logout,
  refresh,
  register,
  verifyEmail,
} from "../controllers/auth.js";
import { validateSchema } from "@nexus/shared";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
} from "../validations/auth.js";

const router: Router = express.Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("login", validateSchema(loginSchema), login);
router.get("/refresh", refresh);
router.get("/verify/:token", verifyEmail);
router.post("/logout", logout);
router.post("/password/forgot", initiatePasswordChange);
router.post("/password/forgot/confirm", confirmPasswordResetCode);
router.put("/password", validateSchema(forgotPasswordSchema), changePassword);

export default router;
