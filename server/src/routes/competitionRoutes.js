import express from "express";
import { createCompetition,getCompetitions,getCompetitionById,updateCompetition,deleteCompetition,getCompetitionParticipants } from "../controllers/competitionController.js";
import { protect, adminOnly,optionalAuth } from "../middlewares/authMiddleware.js";
import {registerForCompetition,getMyRegistrations,cancelRegistration} from "../controllers/registrationController.js"
const router = express.Router();

router.get( "/my-registrations",protect,getMyRegistrations);
router.post("/", protect,adminOnly,createCompetition);
// for delete registration
router.delete("/registrations/:registrationId",protect, cancelRegistration);
// Get all competitions
router.get("/", getCompetitions);

// Get single competition
router.get("/:id",optionalAuth, getCompetitionById);

router.post( "/:competitionId/register",protect,registerForCompetition);

//for admin
router.put( "/:id",protect,adminOnly, updateCompetition);
router.delete( "/:id",  protect,  adminOnly,  deleteCompetition);
router.get("/:id/participants",protect,adminOnly,getCompetitionParticipants);
export default router;