import express from "express";
import { listJobs, filters } from "../controllers/jobController.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router();
router.get("/", asyncHandler(listJobs));
router.get("/filters", asyncHandler(filters));
export default router;
