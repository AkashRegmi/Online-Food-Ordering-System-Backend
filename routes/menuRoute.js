import { Router } from "express";
import { validateRequest } from "../middleware/zodValidation.js";
import { menuItemsSchema } from "../Validator/menuItemvalidator.js";
import { createUploader } from "../config/multerConfig.js";
import {
  createMenuItem,
  deleteMenuIteController,
  getAllMenuControlller,
  getMenuByIdController,
} from "../controller/menuItemsController.js";
import { authenticateToken } from "../middleware/validateToken.js";

const uploadMenuImage = createUploader({
  allowedTypes: ["image"],
  maxSize: 5,
});
const router = Router();
router.post(
  "/menu",
  uploadMenuImage.single("menuImage"),
  validateRequest(menuItemsSchema),
  createMenuItem,
);
router.get("/menu/:id", authenticateToken, getMenuByIdController);
router.get("/menu",  getAllMenuControlller);
router.delete("/menu/:id", authenticateToken, deleteMenuIteController);

export default router;
