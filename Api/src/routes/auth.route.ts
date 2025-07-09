import { Router } from "express";
import asyncHandler from "express-async-handler";
import { validate } from "../middlewares/validator.middleware";
import {
  register,
  login,
  verifyOTP,
  resendOTP,
  refreshToken,
  logout,
} from "../controllers/auth.controller";
import { registerUserSchema } from "../utils/validators/register.zod";
import { createOtpSchema, verifyOtpSchema } from "../utils/validators/otp.zod";
import { loginSchema } from "../utils/validators/login.zod";

const router = Router();

router.post("/register", validate(registerUserSchema), asyncHandler(register));

router.post("/login", validate(loginSchema), asyncHandler(login));

router.post("/verify-otp", validate(verifyOtpSchema), asyncHandler(verifyOTP));

router.post("/resend-otp", validate(createOtpSchema), asyncHandler(resendOTP));

router.post("/refresh-token", asyncHandler(refreshToken));

router.post("/logout", asyncHandler(logout));

export default router;
