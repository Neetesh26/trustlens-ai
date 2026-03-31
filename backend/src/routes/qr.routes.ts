import { Router } from "express";
import { createQr, listUserQr } from "../controllers/qr.controller";
import { protect } from "../middlewares/auth.middleware";
import { qrValidator } from "../validators/qr.validator";

const router = Router();

router.post("/generate", protect, qrValidator, createQr);
router.get("/mine", protect, listUserQr);

export default router;