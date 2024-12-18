const express = require("express");
const { initializePayment } = require("../utils/payment");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const Payment = require("../models/payment");
const Ticket = require("../models/Ticket");

exports.webHook = async (req, res, next) => {
  try {
    //get the event that was sent to the webhook if it was successfully
    const event = req.body;

    if (event.event === "charge.success") {
      const transactionData = event.data;
      const reference = transactionData.reference;

      //find the ticket with that reference
      const ticket = await Ticket.findOne({ reference: reference });

      // Create the payment in the database
      const payment = await Payment.create({
        email: transactionData.customer.email,
        reference: transactionData.reference,
        amount: transactionData.amount / 100,
        status: transactionData.status,
        currency: transactionData.currency,
        channel: transactionData.channel,
        transactionDate: new Date(transactionData.paid_at),
        paidBy: ticket.purchasedBy,
        event: ticket.event,
      });

      ticket.isPaid = true;
      await ticket.save();
      // Optionally trigger any post-payment logic here:
      // - Send confirmation email
      // - Grant access to a product/service
      // - Update order status
    }

    // Return a 200 to acknowledge receipt of the webhook
    return res.status(200);
  } catch (err) {
    next(err)
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Payment.find()
      .populate("paidBy")
      .populate("event");

    res.status(200).json({
      message: "Transactions Fetched Successfully",
      data: {
        transactions,
      },
    });
  } catch (err) {
 next(err)
  }
};

exports.fetchTransaction = async (req, res, next) => {
  try {
    const transaction = await Payment.findById(req.params.id)
      .populate("paidBy")
      .populate("event");

    res.status(200).json({
      message: "Transaction Fetched Successfully",
      data: {
        transaction,
      },
    });
  } catch (err) {
   next(err)
  }
};
