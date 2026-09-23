import mongoose from "mongoose";
import Submission from "../model/submission.model.js";
import Registration from "../model/registeration.model.js";
import Competition from "../model/compete.model.js";
import cloudinary from "../db/cloudinary.js";

const createSubmission = async (req, res) => {
  try {
    const { competitionId } = req.params;
    const { title, description } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({
        message: "Title and submission file are required",
      });
    }

    // Check competition
    const competition = await Competition.findById(competitionId);

    if (!competition) {
      return res.status(404).json({
        message: "Competition not found",
      });
    }

    const now = new Date();

    // Submission allowed only after registration closes
    // and before competition is completed
    if (now < competition.registrationDeadline) {
      return res.status(400).json({
        message: "Submission is not open yet",
      });
    }

    if (now >= competition.competitionDate) {
      return res.status(400).json({
        message: "Submission deadline has passed",
      });
    }

    // Check registration
    const registration = await Registration.findOne({
      user: req.user.id,
      competition: competitionId,
      status: "registered",
    });

    if (!registration) {
      return res.status(400).json({
        message: "You must be registered for this competition",
      });
    }

    // Check existing submission
    const existingSubmission = await Submission.findOne({
      user: req.user.id,
      competition: competitionId,
    });

    if (existingSubmission) {
      return res.status(400).json({
        message: "You have already submitted your project",
      });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
    });

    // Create submission
    const submission = await Submission.create({
      user: req.user.id,
      competition: competitionId,
      registration: registration._id,
      title,
      description,
      submissionUrl: result.secure_url,
    });

    res.status(201).json({
      message: "Submission uploaded successfully",
      submission,
    });
  } catch (error) {
    console.log("CREATE SUBMISSION ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
const getMySubmission = async (req, res) => {
  try {
    const { competitionId } = req.params;

    const submission = await Submission.findOne({
      user: req.user.id,
      competition: competitionId,
    })
      .populate("competition", "title")
      .populate("user", "name email");

    if (!submission) {
      return res.status(404).json({
        message: "No submission found",
      });
    }

    res.status(200).json({
      submission,
    });
  } catch (error) {
    console.log("GET SUBMISSION ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
export { createSubmission,getMySubmission };