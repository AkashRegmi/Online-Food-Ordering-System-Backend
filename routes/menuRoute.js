import { Router } from "express";
import { validateRequest } from "../middleware/zodValidation.js";
import { menuItemsSchema } from "../Validator/menuItemvalidator.js";
import { createUploader } from "../config/multerConfig.js";
import { createMenuItem } from "../controller/menuItemsController.js";
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
export default router;
