import { Router } from "express";
import {
  contactusController,
  getAllContactus,
  getByIdContactUs,
} from "../controller/contactusController.js";

const router = Router();

router.post("/contact", contactusController);
router.get("/contact", getAllContactus);
router.get("/contact/:id", getByIdContactUs);
export default router;
