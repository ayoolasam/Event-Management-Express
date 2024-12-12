const express = require("express");
const { payment, webHook } = require("../controllers/paymentController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.post("/transaction", isAuthenticatedUser, payment);
router.post("/paystack", webHook);

module.exports = router;
