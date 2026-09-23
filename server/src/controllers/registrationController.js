import mongoose from "mongoose";
import Registration from "../model/registeration.model.js";
import Competition from "../model/compete.model.js";

const registerForCompetition = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { competitionId } = req.params;
    const { age, gender, city, experience, github } = req.body;

    if (!age || !gender || !city) {
      return res.status(400).json({
        message: "Please provide age, gender and city",
      });
    }

    const competition = await Competition.findById(competitionId);

    if (!competition) {
      return res.status(404).json({
        message: "Competition not found",
      });
    }

    const now = new Date();

    if (now < competition.registrationStart) {
      return res.status(400).json({
        message: "Registration has not started yet",
      });
    }

    if (now > competition.registrationDeadline) {
      return res.status(400).json({
        message: "Registration deadline has passed",
      });
    }

    const existingRegistration = await Registration.findOne({
      user: req.user.id,
      competition: competitionId,
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "You are already registered",
      });
    }

    session.startTransaction();

    // Reserve one spot atomically
    const updatedCompetition =
      await Competition.findOneAndUpdate(
        {
          _id: competitionId,
          $expr: {
            $lt: [
              "$registeredParticipants",
              "$maxParticipants",
            ],
          },
        },
        {
          $inc: {
            registeredParticipants: 1,
          },
        },
        {
          new: true,
          session,
        }
      );

    if (!updatedCompetition) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Competition is full",
      });
    }

    // Create registration
    const registration = await Registration.create(
      [
        {
          user: req.user.id,
          competition: competitionId,
          age,
          gender,
          city,
          experience,
          github,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      message: "Registered successfully",
      registration: registration[0],
    });
  } catch (error) {
    await session.abortTransaction();

    console.log("REGISTRATION ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "You are already registered",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      user: req.user.id,
      status: "registered",
    })
      .populate(
        "competition",
        "title category image prizePool registrationDeadline competitionDate maxParticipants registeredParticipants"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      registrations,
    });
  } catch (error) {
    console.log("GET MY REGISTRATIONS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
const cancelRegistration = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { registrationId } = req.params;

    session.startTransaction();

    const registration = await Registration.findOne({
      _id: registrationId,
      user: req.user.id,
      status: "registered",
    })
      .populate("competition")
      .session(session);

    if (!registration) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Registration not found",
      });
    }

    // Check registration deadline
    const now = new Date();

    if (now > registration.competition.registrationDeadline) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Registration cancellation deadline has passed",
      });
    }

    // Cancel registration
    registration.status = "cancelled";

    await registration.save({ session });

    // Increase available spot
    await Competition.findByIdAndUpdate(
      registration.competition._id,
      {
        $inc: { registeredParticipants: -1 },
      },
      { session }
    );

    await session.commitTransaction();

    res.status(200).json({
      message: "Registration cancelled successfully",
    });
  } catch (error) {
    await session.abortTransaction();

    console.log("CANCEL REGISTRATION ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};
export { registerForCompetition ,getMyRegistrations,cancelRegistration };