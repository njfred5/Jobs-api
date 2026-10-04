import express from "express";
import * as ctrl from "../controllers/savedController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router();
router.use(requireAuth);
router.get("/", asyncHandler(ctrl.list));
router.post("/", asyncHandler(ctrl.add));
router.delete("/:jobId", asyncHandler(ctrl.remove));
export default router;
