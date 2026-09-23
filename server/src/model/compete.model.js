import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    prizePool: {
      type: Number,
      required: true,
      min: 0,
    },

    entryFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
    },

    registeredParticipants: {
      type: Number,
      default: 0,
      min: 0,
    },

    registrationStart: {
      type: Date,
      required: true,
    },

    registrationDeadline: {
      type: Date,
      required: true,
    },

    competitionDate: {
      type: Date,
      required: true,
    },

    judge: {
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        default: "",
      },
      experience: {
        type: String,
        default: "",
      },
    },

    rules: [
      {
        type: String,
      },
    ],

    judgingParameters: [
      {
        type: String,
      },
    ],

    registrationFields: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: [
        "upcoming",
        "registration_open",
        "registration_closed",
        "ongoing",
        "completed",
      ],
      default: "upcoming",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Competition = mongoose.model(
  "Competition",
  competitionSchema
);

export default Competition;