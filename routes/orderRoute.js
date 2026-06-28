import { Router } from "express";
import { authenticateToken } from "../middleware/validateToken.js";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
} from "../controller/orderController.js";
const router = Router();
router.post("/order", authenticateToken, createOrder);
router.get("/order", authenticateToken, getOrders);
router.get("/order/:id", authenticateToken, getOrderById);
router.delete("/order/:id", authenticateToken, deleteOrder);

export default router;
