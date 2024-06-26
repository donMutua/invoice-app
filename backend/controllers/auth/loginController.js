import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../../models/userModels.js";
import { systemLogs } from "../../utils/logger.js";

// $-title  Login User, get access and refresh tokens
// $-path   POST /api/v1/auth/login
// $-auth   Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide an email and a password");
  }

  const existingUser = await User.findOne({ email: email }).select("+password");

  if (!existingUser || !(await existingUser.comparePassword(password))) {
    res.status(401);
    systemLogs.error("incorrect email or password");
    throw new Error("incorrect email or password");
  }

  if (!existingUser.isEmailVerified) {
    res.status(400);
    throw new Error("You are not verified, check your email");
  }

  if (!existingUser.active) {
    res.status(400);
    throw new Error(
      "You have been deactivated by the admin,  Please contact us"
    );
  }

  if (existingUser || (await existingUser.comparePassword(password))) {
    const accessToken = jwt.sign(
      {
        id: existingUser._id,
        roles: existingUser.roles,
      },
      process.env.JWT_ACCESS_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const newRefreshToken = jwt.sign(
      {
        id: existingUser._id,
      },
      process.env.JWT_ACCESS_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const cookies = req.cookies;

    let newRefreshTokenArray = !cookies?.jwt
      ? existingUser.refreshTokens
      : existingUser.refreshTokens.filter((refT) => refT !== cookies.jwt);

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const existingRefreshToken = await User.findOne({ refreshToken }).exec();

      if (!existingRefreshToken) {
        newRefreshTokenArray = [];
      }

      const options = {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "None",
      };

      res.clearCookie("jwt", options);
    }

    existingUser.refreshTokens = [...newRefreshTokenArray, newRefreshToken];

    await existingUser.save();

    const options = {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    };

    res.cookie("jwt", newRefreshToken, options);

    res.json({
      success: true,
      accessToken,
      user: {
        id: existingUser._id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        username: existingUser.username,
        provider: existingUser.provider,
        avatar: existingUser.avatar,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

export default loginUser;
