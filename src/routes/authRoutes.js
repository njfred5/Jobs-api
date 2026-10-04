import express from "express";
import rateLimit from "express-rate-limit";
import * as ctrl from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, try again later" }
});

router.post("/register", limiter, asyncHandler(ctrl.register));
router.post("/login", limiter, asyncHandler(ctrl.login));
router.get("/me", requireAuth, asyncHandler(ctrl.me));
export default router;
