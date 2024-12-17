const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name "],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email address"],
      unique: true,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
      },
      default: "active",
    },
    uniqueID: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please enter your Password"],
      select: false,
      minlength: [8, "your Password must be at least 8 characters"],
    },
    username: {
      type: String,
      required: [true, "Please enter a username"],

      trim: true,
    },
    role: {
      type: String,
      default: "User",
      enum: {
        values: ["User", "Admin"],
        message: "Please enter a valid role ",
      },
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//generate jsonwebtoken
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
