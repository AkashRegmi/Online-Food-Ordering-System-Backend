import { Router } from "express";
import {
  loginUserSchema,
  otpVerifyRegistration,
  registerUserSchema,
} from "../Validator/userValidator.js";
import {
  login,
  registerUser,
  verifyOtpAfterRegister,
} from "../controller/userController.js";
import { validateRequest } from "../middleware/zodValidation.js";
import { LimitRequest } from "../helper/rateLimiter.js";
const router = Router();
router.post("/register", validateRequest(registerUserSchema), registerUser);
router.post(
  "/verifyOtp",
  validateRequest(otpVerifyRegistration),
  LimitRequest(4),
  verifyOtpAfterRegister,
);
router.post("/login", validateRequest(loginUserSchema), LimitRequest(2), login);
export default router;
