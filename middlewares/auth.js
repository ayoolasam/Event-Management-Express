const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      message: "You are not Authorized,Login first to access this resource",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);

  next();
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    //if roles does not include req.user roles ...roles is an array of as much roles you want
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are Not Authorized to access this resource Please",
      });
    }
    next();
  };
};
