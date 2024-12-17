
const sendToken = (user, statusCode, res, req) => {
  const token = user.generateToken();

  //cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message: "Logged in successfully",
    data: {
      token,
    },
  });
};

module.exports = sendToken;
