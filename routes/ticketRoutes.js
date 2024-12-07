const express = require("express");
const {
 buyTicket

} = require("../controllers/ticketController");
const { isAuthenticatedUser,authorizeRoles } = require("../middlewares/auth");
const router = express.Router();


router.post("/ticket",isAuthenticatedUser,buyTicket)

module.exports = router;
