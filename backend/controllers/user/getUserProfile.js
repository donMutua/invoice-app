import asyncHandler from "express-async-handler";
import User from "../../models/userModels.js";

// $-title  Get user profile
// $-path   GET /api/v1/user/profile
// $-auth   Private

const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  console.log(req.user, "req.user");

  const userProfile = await User.findById(userId, {
    refreshTokens: 0,
    roles: 0,
    password: 0,
    _id: 0,
  }).lean();

  if (!userProfile) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ success: true, userProfile });
});

export default getUserProfile;
