const express = require("express");
const { initializePayment } = require("../utils/payment");
const Payment = require("../models/payment");

exports.payment = async (req, res, next) => {
  try {
    const { price, eventId } = req.body;
    const response = await initializePayment(req.user.email, price);

    if (response) {
      const payment = await Payment.create({
        paidBy: req.user,
        email: req.user.email,
        reference: response.data.reference,
        amount: price,
        status: "pending",
        event: eventId,
      });
    }

    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(500).json(e.message);
  }
};

exports.webHook = async (req, res, next) => {
  try {
    const event = req.body;

    if (event.event === "charge.success") {
      const transactionData = event.data;
      const reference = transactionData.reference;
      const status = transactionData.status; // Should be 'success'

      // Find the payment in the database
      let payment = await Payment.findOne({ reference });
      if (payment) {
        payment.status = "success";
        payment.transactionDate = new Date(transactionData.paid_at);
        payment.status = transactionData.status;
        payment.currency = transactionData.currency;
        payment.channel = transactionData.channel;
        await payment.save();
      }

      // Optionally trigger any post-payment logic here:
      // - Send confirmation email
      // - Grant access to a product/service
      // - Update order status
    }

    // Return a 200 to acknowledge receipt of the webhook
    return res.status(200);
  } catch (e) {
    console.log(e);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Payment.find().populate("paidBy");

    res.status(200).json({
      message: "Transactions Fetched Successfully",
      data: {
        transactions,
      },
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

exports.fetchTransaction = async (req, res, next) => {
  try {
    const transaction = await Payment.findById(req.params.id).populate(
      "paidBy"
    );

    res.status(200).json({
      message: "Transaction Fetched Successfully",
      data: {
        transaction,
      },
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};
