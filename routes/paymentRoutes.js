const express = require("express");
const {
  webHook,
  getTransactions,
  fetchTransaction,
  totalAmount,
} = require("../controllers/paymentController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

// router.post("/transaction", isAuthenticatedUser, payment);
router.post("/paystack", webHook);
router.get(
  "/transactions",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  getTransactions
);
router.get(
  "/transactions/:id",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  fetchTransaction
);

router.get(
  "/transactions/amount",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  totalAmount
);

module.exports = router;
