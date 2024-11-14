const User = require("../models/user");
const sendToken = require("../utils/sendToken");


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
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
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

  const user = await User.create({
    name,
    email,
    password,
    username,
  });

  res.status(200).json({
    message: "User Registered Successfully",
  });
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
