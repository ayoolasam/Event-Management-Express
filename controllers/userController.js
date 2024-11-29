const User = require("../models/user");
const sendToken = require("../utils/sendToken");
const { createEmailTemplate } = require("../utils/emailTemplate");
const sendEmail = require("../utils/sendEmail");
const generateRandomString = require("../utils/uniqueId");
const { generateKey } = require("crypto");

//get users
exports.getUsers = async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    no_of_users: users.length,
    data: {
      users,
    },
    message: "All users in the Database",
  });
};

//login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401).json({
      message: "Please fill in correct Details",
    });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401).json({
      message: "User not found",
    });
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid Password",
    });
  }

  sendToken(user, 200, res);
};

//register
exports.register = async (req, res, next) => {
  const { name, password, username, email } = req.body;

  if (!name || !password || !username || !email) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
  }

  const string = generateRandomString();
  console.log(string);

  const user = await User.create({
    name,
    email,
    password,
    username,
    uniqueID: string,
  });

  const message = createEmailTemplate({
    title: "Welcome to Event Management!",
    username,
    message: `Thank you for registering, ${username}! We're excited to have you on board. Click the button below to verify your email and get started.`,
    buttonText: "Verify Your Email",
    buttonLink: `https://localhost:3000/Login`,
  });

  try {
    await sendEmail({
      email: user.email,
      subject: "Event Management",
      message,
    });

    return res.status(200).json({
      message: `User Registered Successfully and email sent to ${user.email}`,
    });
  } catch (err) {
    console.log(err);
  }
};

//logOut user
exports.logOutUser = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.status(200).json({
    message: "Logged Out Successfully",
    sucess: true,
  });
};

//fetch User
exports.fetchUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User Not Found",
    });
  }

  res.status(200).json({
    message: "User Fetched Successfully",
    data: {
      user,
    },
  });
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    res.status(200).json({
      message: "User Deleted Successfully",
      success: true,
    });
  } catch (e) {
    res.status(500).json({
      message: "Error Deleting User",
      error: e.message,
    });
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({
        message: "User Not Found",
      });
    }

    res.status(200).json({
      data: {
        user,
      },
    });
  } catch (e) {
    res.status(500).json({
      message: "Error Deleting User",
      error: e,
    });
  }
};
