import { Router } from "express";
import {
  loginUserSchema,
  otpVerifyRegistration,
  registerUserSchema,
  resetPasswordSchema,
} from "../Validator/userValidator.js";
import {
  forgotPassword,
  login,
  registerUser,
  resendOtp,
  verifyOtpAfterRegister,
} from "../controller/userController.js";
import { validateRequest } from "../middleware/zodValidation.js";
import { LimitRequest } from "../helper/rateLimiter.js";
const router = Router();

router.post(
  "/register",
  validateRequest(registerUserSchema),
  LimitRequest(7),
  registerUser,
);

router.post(
  "/verifyOtp",
  validateRequest(otpVerifyRegistration),
  LimitRequest(4),
  verifyOtpAfterRegister,
);
router.post("/login", validateRequest(loginUserSchema), LimitRequest(2), login);
router.post("resendOtp", LimitRequest(2), resendOtp);
router.post(
  "/resetPassword",
  validateRequest(resetPasswordSchema),
  LimitRequest(5),
  forgotPassword,
);

export default router;
