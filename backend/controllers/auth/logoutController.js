import asyncHandler from "express-async-handler";
import User from "../../models/userModels.js";

const logoutUser = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(204).json({ error: "No Cookies Found" });
  }

  const refreshTokens = cookies?.jwt;

  const existingUser = await User.findOne({ refreshTokens });

  if (!existingUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(204);
  }

  existingUser.refreshTokens = existingUser.refreshTokens.filter(
    (token) => token !== refreshTokens
  );

  await existingUser.save();

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({
    message: `${existingUser.firstName}, you have been logged out successfully`,
  });
});

export default logoutUser;
