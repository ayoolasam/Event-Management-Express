const express = require("express");
const {
  buyTicket,
  getTickets,
  getTicket,
  toggleTicket,
  deleteTicket
} = require("../controllers/ticketController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.post("/ticket", isAuthenticatedUser, buyTicket);
router.get("/", isAuthenticatedUser, authorizeRoles("Admin"), getTickets);
router.get(
  "/ticket/:id",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  getTicket
);
router.delete(
  "/ticket/:id",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  deleteTicket
);
router.put(
  "/ticket/toggle/:id",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  toggleTicket
);

module.exports = router;
