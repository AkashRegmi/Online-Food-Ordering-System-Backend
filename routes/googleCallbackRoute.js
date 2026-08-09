import { Router } from "express";
import { googleCallback } from "../controller/googleAuthController.js";

const router = Router();
router.get("/callback", googleCallback);
export default router;
