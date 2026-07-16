import { Router } from "express";
import {
  contactusController,
  deleteContactUs,
  getAllContactus,
  getByIdContactUs,
  updateContactUs,
} from "../controller/contactusController.js";

const router = Router();

router.post("/contact", contactusController);
router.get("/contact", getAllContactus);
router.get("/contact/:id", getByIdContactUs);
router.delete("/delete/contactus/:id", deleteContactUs);
router.put("/contactus/:id", updateContactUs);
export default router;
