const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
    price: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: [
        "conference",
        "webinar",
        "workshop",
        "seminar",
        "meetup",
        "networking",
        "hackathon",
        "training",
        "fundraiser",
        "party",
        "concert",
        "exhibition",
        "festival",
        "charity",
        "sport",
        "launch",
        "award",
        "panel",
        "roundtable",
        "retreat",
        "community",
      ],
    },
    capacity: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
