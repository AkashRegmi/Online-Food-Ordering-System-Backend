import { getOrderInfo, recentOrder } from "../controller/dashboard.js";
import { block } from "../helper/blocker.js";
import { authenticateToken } from "../middleware/validateToken.js";
import { Router } from "express";
const router = Router();

router.get("/orderStatistics", getOrderInfo);
router.get("/recentOrder", authenticateToken, block(["admin"]), recentOrder);

export default router;
