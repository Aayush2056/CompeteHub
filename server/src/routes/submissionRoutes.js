import express from "express";
import multer from "multer";

import { protect } from "../middlewares/authMiddleware.js";
import { createSubmission,getMySubmission } from "../controllers/submissionController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/",});

router.post( "/:competitionId/submission",  protect, upload.single("submission"),createSubmission);
router.get(  "/:competitionId", protect, getMySubmission);
export default router;