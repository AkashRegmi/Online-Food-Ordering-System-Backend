import { Router } from "express";
import { registerUserSchema } from "../Validator/userValidator.js";
import { registerUser } from "../controller/userController.js";
import { validateRequest } from "../middleware/zodValidation.js";
const router = Router();
router.post("/register", validateRequest(registerUserSchema), registerUser);
export default router;
