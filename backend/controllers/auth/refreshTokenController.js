import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../../models/userModels.js";

// $-title  Get new access token from refresh token
// $-path   Get /api/v1/auth/new_access_token
// $-auth   Public
// we are rotating the refresh token, deleting the old ones, creating a new one and detecting token reuse

const newAccessToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies) {
    return res.status(401).json({ error: "No Cookies Found" });
  }

  const refreshToken = cookies?.jwt;

  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token found" });
  }

  //verify refresh token
  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_ACCESS_SECRET_KEY,
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid refresh token" });
      }
      return decoded;
    }
  );

  //find exisiting User
  const existingUser = await User.findById(decoded.id);

  //check if token is valid if its not valid return and empty array of refresh tokens and return error
  if (!existingUser.refreshTokens.includes(refreshToken))
    return res.sendStatus(401);

  // genereate new access token
  const accessToken = jwt.sign(
    {
      id: existingUser._id,
      roles: existingUser.roles,
    },
    process.env.JWT_ACCESS_SECRET_KEY,
    { expiresIn: "1h" }
  );

  //generate new refresh token
  const newRefreshToken = jwt.sign(
    {
      id: existingUser._id,
    },
    process.env.JWT_ACCESS_SECRET_KEY,
    { expiresIn: "7d" }
  );

  //remove old refresh token
  existingUser.refreshTokens = existingUser.refreshTokens.filter(
    (token) => token !== refreshToken
  );

  //add new refresh token

  existingUser.refreshTokens.push(newRefreshToken);

  //save user
  await existingUser.save();

  //clear olf cookie
  res.clearCookie("jwt");

  //set cookie options
  const options = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: "None",
  };

  //set new refresh token in cookie
  res.cookie("jwt", newRefreshToken, options);

  return res.json({
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
});

export default newAccessToken;
