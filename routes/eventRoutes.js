const express = require("express");
const {
  createEvent,
  getEvents,
  updateEvents,
  deleteEvents,
  fetchEvent,
} = require("../controllers/eventController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();

router.get("/", getEvents);
router.post("/create", isAuthenticatedUser, createEvent);
router.put("/update", isAuthenticatedUser, updateEvents);
router.delete("/delete", isAuthenticatedUser, deleteEvents);
router.get("/:id", isAuthenticatedUser, fetchEvent);

module.exports = router;
