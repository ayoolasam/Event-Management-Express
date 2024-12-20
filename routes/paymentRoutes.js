const express = require("express");
const {
  webHook,
  getTransactions,
  fetchTransaction,
} = require("../controllers/paymentController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

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

module.exports = router;
