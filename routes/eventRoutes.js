const express = require("express");
const {
  createEvent,
  getEvents,
  updateEvents,
  deleteEvents,
  fetchEvent,
} = require("../controllers/eventController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.get("/", getEvents);
router.post(
  "/create",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  createEvent
);
router.put(
  "/update",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  updateEvents
);
router.delete(
  "/delete/:id",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  deleteEvents
);
router.get("/:id", fetchEvent);

module.exports = router;
