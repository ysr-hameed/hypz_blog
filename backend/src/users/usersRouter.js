import express from "express";
import cookieParser from "cookie-parser";
import config from "../config/config.js";

const userRouter = express.Router();
userRouter.use(cookieParser());

userRouter.post("/login", (req, res) => {
  const email = config.user_email;
  const password = config.user_password;

  const inputPassword = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      success: false,
      message: "Email or Password not set in configuration",
    });
  }

  if (!inputPassword) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  // Direct comparison without hashing
  if (inputPassword !== password) {
    return res.status(400).json({
      success: false,
      message: "Invalid password",
    });
  }

  // Set cookie for staying logged in
  res.cookie("user", email, {
    httpOnly: true,
    secure: config.env === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return res.status(200).json({
    success: true,
    message: "Login Successful",
    email: email,
  });
});

export default userRouter;