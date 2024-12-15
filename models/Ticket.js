const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    purchasedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketCode: {
      type: String,
      unique: true,
      required: true,
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    noOfTickets: {
      type: Number,
      default: 1,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
