import { getOrderInfo } from "../controller/dashboard.js";
import { authenticateToken } from "../middleware/validateToken.js";
import { Router } from "express";
const router = Router();

router.get("/orderStatistics", getOrderInfo);

export default router;
