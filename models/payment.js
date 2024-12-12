// models/Payment.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentSchema = new Schema(
  {
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    currency:{
      type:String
    },
    
    channel:{
      type:String
    }
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
