const User = require("../models/user");
const Ticket = require("../models/Ticket");
const Event = require("../models/events");
const Payment = require("../models/payment");
const sendToken = require("../utils/sendToken");
const errorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { createEmailTemplate } = require("../utils/emailTemplate");
const sendEmail = require("../utils/sendEmail");
const generateRandomString = require("../utils/uniqueId");
const Cloudinary = require("../utils/cloudinary");
const crypto = require("crypto");

//get users
exports.getUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    no_of_users: users.length,
    data: {
      users,
    },
    message: "All users in the Database",
  });
});

//login
exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401).json({
      message: "Please fill in correct Details",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "User not found",
    });
  }

  if (user.status === "inactive") {
    return next(
      new errorHandler(
        "User Already Deactivated Cant Login Contact Admin or Support",
        400
      )
    );
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid Password",
    });
  }

  sendToken(user, 200, res);
});

//register
exports.register = catchAsyncErrors(async (req, res, next) => {
  const { name, password, username, email } = req.body;

  if (!name || !password || !username || !email) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
  }

  const isUserInDataBase = await User.findOne({ email });

  if (isUserInDataBase) {
    return res.status(400).json({
      message: "User already Exists",
      success: false,
    });
  }

  const string = generateRandomString();

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

    res.status(201).json({
      message: `User Registered Successfully and email sent to ${user.email}`,
    });
  } catch (e) {
    res.status(500).json({
      message: "Server Error",
      error: e.message,
    });
  }
});

//logOut user
exports.logOutUser = catchAsyncErrors(async (req, res, next) => {
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
});

//fetch User
exports.fetchUser = catchAsyncErrors(async (req, res, next) => {
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
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

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
});

exports.getMe = catchAsyncErrors(async (req, res, next) => {
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
});

exports.adminDashBoard = catchAsyncErrors(async (req, res, next) => {
  try {
    const events = await Event.find();
    const users = await User.find();
    const tickets = await Ticket.find();
    const result = await Payment.aggregate([
      { $match: { status: "success" } }, //filter the documents with status success into one group for aggregration
      { $group: { _id: null, totalMoney: { $sum: "$amount" } } },
    ]);

    const totalMoney = result[0]?.totalMoney || 0; // Handle case where no transactions

    res.status(200).json({
      message: "Dashboadrd Data Successfully Fetched",
      data: {
        events,
        users,
        tickets,
        totalMoney,
      },
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
});
exports.ticketBoughtByAUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const userTickets = await Ticket.find({
      purchasedBy: req.params.id,
    })
      .populate("purchasedBy")
      .populate("event");

    if (!userTickets) {
      return res.status(404).json({
        message: "User Does not Have Any Tickets Presently",
      });
    }

    res.status(200).json({
      message: "User Tickets Fetched Successfully",
      data: {
        userTickets,
      },
    });
    res.status();
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
});

exports.userTransactions = catchAsyncErrors(async (req, res, next) => {
  try {
    const userTransactions = await Payment.find({
      paidBy: req.params.id,
    })
      .populate("paidBy")
      .populate("event");

    if (!userTransactions) {
      return res.status(404).json({
        message: "User Does not Have Any Transactions Presently",
      });
    }

    res.status(200).json({
      message: "User Transactions Fetched Successfully",
      data: {
        userTransactions,
      },
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
});

exports.uploadUserImage = catchAsyncErrors(async (req, res, next) => {
  try {
    const { imageUrl } = req.body;

    const user = await User.findById(req.user.id);

    user.imageUrl = imageUrl;

    await user.save();

    res.status(200).json({
      message: "user Image successfully Updated",
      data: {
        user,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e.message,
    });
  }
});

exports.updateUserDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
    });

    res.status(200).json({
      message: "User Data Updated Successfully",
      data: {
        user,
      },
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
});

exports.getMyTickets = catchAsyncErrors(async (req, res, next) => {
  try {
    const myTickets = await Ticket.find({ purchasedBy: req.user.id })
      .populate("purchasedBy")
      .populate("event");

    if (!myTickets) {
      return res.status(404).json({
        messsge: "No tickets for this user",
      });
    }

    res.status(200).json({
      message: "My tickets Fecthed Successfully",
      data: {
        myTickets,
      },
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
});

exports.getMyTransactions = catchAsyncErrors(async (req, res, next) => {
  try {
    const myTransactions = await Payment.find({ paidBy: req.user.id })
      .populate("paidBy")
      .populate("event");

    if (!myTransactions) {
      return res.status(404).json({
        messsge: "No transactions for this user",
      });
    }

    res.status(200).json({
      message: "My transactions Fetched Successfully",
      data: {
        myTransactions,
      },
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      message: "User Not Found",
    });
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/passwordReset/${resetToken}`;

  const message = createEmailTemplate({
    title: "forgot password?",

    message: `your Password reset Link is as Follow ${resetUrl}  if you have not if you have not requested this please ignore`,
    buttonText: "Forgot password",
    buttonLink: resetUrl,
  });

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset email ",
      message,
    });

    return res.status(200).json({
      message: `Email Successfully sent to ${user.email}`,
    });
  } catch (err) {
    console.log(err);
  }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //get token from url
  //hash url token

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid token or expired token" });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save({ validateBeforeSave: false });

  sendToken(user, 200, res);
});

exports.userDashboard = catchAsyncErrors(async (req, res, next) => {
  try {
    const payments = await Payment.find({ paidBy: req.user.id });
    const tickets = await Ticket.find({ purchasedBy: req.user.id });

    res.status(200).json({
      message: "Dashboard Data Successfully Fetched",
      data: {
        payments,
        tickets,
      },
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
});

exports.totalAmount = catchAsyncErrors(async (req, res, next) => {
  const result = await Payment.aggregate([
    { $match: { status: "success" } }, //filter the documents with status success into one group for aggregration
    { $group: { _id: null, totalMoney: { $sum: "$amount" } } },
  ]);

  const totalMoney = result[0]?.totalMoney || 0; // Handle case where no transactions

  res.status(200).json({
    data: {
      totalMoney,
    },
  });
});

exports.deactivateUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new errorHandler("user Not Found", 404));
  }

  user.status = "inactive";

  await user.save();

  res.status(200).json({
    message: "User successfully Deactivated",
  });
});
