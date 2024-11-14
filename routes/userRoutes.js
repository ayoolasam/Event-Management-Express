const express = require("express");
const {
  getUsers,
  register,
  login,
  logOutUser,
  fetchUser,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();

router.get("/GetUsers", isAuthenticatedUser, getUsers);
router.post("/register", register);
router.post("/Login", login);
router.get("/LogOut", isAuthenticatedUser, logOutUser);
router.get("/user/:id", isAuthenticatedUser, fetchUser);

module.exports = router;
