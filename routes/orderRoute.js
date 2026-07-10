import { Router } from "express";
import { authenticateToken } from "../middleware/validateToken.js";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from "../controller/orderController.js";
import { updateOrderSchema } from "../Validator/orderValidator.js";
import { validateRequest } from "../middleware/zodValidation.js";
const router = Router();
router.post("/order", authenticateToken, createOrder);
router.get("/order", authenticateToken, getOrders);
router.get("/order/:id", authenticateToken, getOrderById);
router.delete("/order/:id", authenticateToken, deleteOrder);
router.put(
  "/order/:id",
  authenticateToken,
  validateRequest(updateOrderSchema),
  updateOrder,
);

export default router;
