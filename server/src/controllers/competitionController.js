import Competition from "../model/compete.model.js";
import Registration from "../model/registeration.model.js";

const createCompetition = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      image,
      prizePool,
      entryFee,
      maxParticipants,
      registrationStart,
      registrationDeadline,
      competitionDate,
      judge,
      rules,
      judgingParameters,
      registrationFields,
    } = req.body;

    // Required fields
    if (
      !title ||
      !description ||
      !category ||
      prizePool === undefined ||
      !maxParticipants ||
      !registrationStart ||
      !registrationDeadline ||
      !competitionDate ||
      !judge
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Date validation
    if (
      new Date(registrationStart) >=
      new Date(registrationDeadline)
    ) {
      return res.status(400).json({
        message: "Registration deadline must be after registration start",
      });
    }

    if (
      new Date(registrationDeadline) >=
      new Date(competitionDate)
    ) {
      return res.status(400).json({
        message: "Competition date must be after registration deadline",
      });
    }

    const competition = await Competition.create({
      title,
      description,
      category,
      image: image || "",
      prizePool,
      entryFee: entryFee || 0,
      maxParticipants,
      registrationStart,
      registrationDeadline,
      competitionDate,
      judge,
      rules: rules || [],
      judgingParameters: judgingParameters || [],
      registrationFields: registrationFields || [],
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Competition created successfully",
      competition,
    });
  } catch (error) {
    console.log("CREATE COMPETITION ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
const getCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      competitions,
    });
  } catch (error) {
    console.log("GET COMPETITIONS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
const getCompetitionById = async (req, res) => {
  try {
    const { id } = req.params;

    const competition = await Competition.findById(id)
      .populate("createdBy", "name email");

    if (!competition) {
      return res.status(404).json({
        message: "Competition not found",
      });
    }

    const now = new Date();

    // Calculate current status
    let currentStatus;

if (now < competition.registrationStart) {
  currentStatus = "upcoming";
} else if (now <= competition.registrationDeadline) {
  currentStatus = "registration_open";
} else if (now < competition.competitionDate) {
  currentStatus = "registration_closed";
} else {
  currentStatus = "completed";
}

    // Remaining spots
    const remainingSpots =
      competition.maxParticipants -
      competition.registeredParticipants;

    // Check whether logged-in user is registered
    let hasRegistered = false;

    if (req.user) {
      const registration = await Registration.findOne({
        user: req.user.id,
        competition: id,
      });

      hasRegistered = !!registration;
    }

    res.status(200).json({
      competition: {
        ...competition.toObject(),
        currentStatus,
        remainingSpots,
        hasRegistered,
      },
    });
  } catch (error) {
    console.log("GET COMPETITION ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
const updateCompetition = async (req, res) => {
  try {
    const { id } = req.params;

    const competition = await Competition.findById(id);

    if (!competition) {
      return res.status(404).json({
        message: "Competition not found",
      });
    }

    const {
      title,
      description,
      category,
      image,
      prizePool,
      entryFee,
      maxParticipants,
      registrationStart,
      registrationDeadline,
      competitionDate,
      judge,
      rules,
      judgingParameters,
      registrationFields,
    } = req.body;

    // Cannot reduce capacity below already registered users
    if (
      maxParticipants !== undefined &&
      Number(maxParticipants) < competition.registeredParticipants
    ) {
      return res.status(400).json({
        message:
          "Max participants cannot be less than current registered participants",
      });
    }

    // Validate dates if provided
    const start = registrationStart
      ? new Date(registrationStart)
      : competition.registrationStart;

    const deadline = registrationDeadline
      ? new Date(registrationDeadline)
      : competition.registrationDeadline;

    const competitionDateValue = competitionDate
      ? new Date(competitionDate)
      : competition.competitionDate;

    if (start >= deadline) {
      return res.status(400).json({
        message: "Registration deadline must be after registration start",
      });
    }

    if (deadline >= competitionDateValue) {
      return res.status(400).json({
        message: "Competition date must be after registration deadline",
      });
    }

    competition.title = title ?? competition.title;
    competition.description = description ?? competition.description;
    competition.category = category ?? competition.category;
    competition.image = image ?? competition.image;
    competition.prizePool = prizePool ?? competition.prizePool;
    competition.entryFee = entryFee ?? competition.entryFee;
    competition.maxParticipants =
      maxParticipants ?? competition.maxParticipants;

    competition.registrationStart = start;
    competition.registrationDeadline = deadline;
    competition.competitionDate = competitionDateValue;

    competition.judge = judge ?? competition.judge;
    competition.rules = rules ?? competition.rules;
    competition.judgingParameters =
      judgingParameters ?? competition.judgingParameters;
    competition.registrationFields =
      registrationFields ?? competition.registrationFields;

    await competition.save();

    res.status(200).json({
      message: "Competition updated successfully",
      competition,
    });
  } catch (error) {
    console.log("UPDATE COMPETITION ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteCompetition = async (req, res) => {
  try {
    const { id } = req.params;

    const competition = await Competition.findById(id);

    if (!competition) {
      return res.status(404).json({
        message: "Competition not found",
      });
    }

    // Don't allow deletion if users are already registered
    if (competition.registeredParticipants > 0) {
      return res.status(400).json({
        message: "Cannot delete a competition with registered participants",
      });
    }

    await Competition.findByIdAndDelete(id);

    res.status(200).json({
      message: "Competition deleted successfully",
    });
  } catch (error) {
    console.log("DELETE COMPETITION ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
const getCompetitionParticipants = async (req, res) => {
  try {
    const { id } = req.params;

    const competition = await Competition.findById(id);

    if (!competition) {
      return res.status(404).json({
        message: "Competition not found",
      });
    }

    const registrations = await Registration.find({
      competition: id,
      status: "registered",
    })
      .populate("user", "name email phone profileImage")
      .sort({ registeredAt: -1 });

    res.status(200).json({
      competition: {
        id: competition._id,
        title: competition.title,
        maxParticipants: competition.maxParticipants,
        registeredParticipants: competition.registeredParticipants,
      },
      participants: registrations,
    });
  } catch (error) {
    console.log("GET PARTICIPANTS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
export { createCompetition ,  getCompetitions, getCompetitionById,updateCompetition,deleteCompetition,getCompetitionParticipants};