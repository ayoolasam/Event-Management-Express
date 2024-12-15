const express = require("express");
const {
  getUsers,
  register,
  login,
  logOutUser,
  fetchUser,
  deleteUser,
  getMe,
  adminDashBoard,
  ticketBoughtByAUser,
  userTransactions,
  uploadUserImage,
  updateUserDetails,
  getMyTickets,
  getMyTransactions
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.get("/GetUsers", isAuthenticatedUser, authorizeRoles("Admin"), getUsers);
router.post("/user/Avatar", isAuthenticatedUser, uploadUserImage);
router.post("/user/Update", isAuthenticatedUser, updateUserDetails);
router.get("/user/myTickets", isAuthenticatedUser, getMyTickets);
router.get("/user/myTransactions", isAuthenticatedUser, getMyTransactions);
router.get(
  "/tickets/user/:id",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  ticketBoughtByAUser
);
router.get(
  "/transactions/user/:id",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  userTransactions
);
router.post("/register", register);
router.post("/Login", login);
router.get("/LogOut", isAuthenticatedUser, logOutUser);
router.get(
  "/user/:id",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  fetchUser
);
router.delete(
  "/user/:id",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  deleteUser
);
router.get(
  "/admin/dashBoard",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  adminDashBoard
);
router.get("/me", isAuthenticatedUser, getMe);

module.exports = router;
