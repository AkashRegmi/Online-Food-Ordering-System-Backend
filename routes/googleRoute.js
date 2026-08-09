import express, { Router } from "express";
import {
  googleCallback,
  googleLogin,
} from "../controller/googleAuthController.js";
const router = Router();
router.get("/google", googleLogin);

export default router;
