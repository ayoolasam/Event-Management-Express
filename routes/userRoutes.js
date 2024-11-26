const express = require("express");
const {
  getUsers,
  register,
  login,
  logOutUser,
  fetchUser,
  deleteUser,
  getMe,
} = require("../controllers/userController");
const { isAuthenticatedUser,authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.get("/GetUsers", isAuthenticatedUser,authorizeRoles("Admin") ,getUsers);
router.post("/register", register);
router.post("/Login", login);
router.get("/LogOut", isAuthenticatedUser, logOutUser);
router.get("/user/:id", isAuthenticatedUser,authorizeRoles("Admin"), fetchUser);
router.delete("/user/:id", isAuthenticatedUser,authorizeRoles("Admin"), deleteUser);
router.get("/me", isAuthenticatedUser, getMe);

module.exports = router;
