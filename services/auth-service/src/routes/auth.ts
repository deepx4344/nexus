import express, { type Router } from "express";
import {
  login,
  logout,
  refresh,
  register,
  verifyEmail,
} from "../controllers/auth.js";
import {validateSchema} from "@nexus/shared";
import { registerSchema, loginSchema } from "../validations/auth.js";

const router: Router = express.Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("login", validateSchema(loginSchema), login);
router.get("/refresh", refresh);
router.get("/verify/:token", verifyEmail);
router.post("/logout", logout);

export default router;
