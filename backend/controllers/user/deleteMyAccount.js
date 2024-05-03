import asyncHandler from "express-async-handler";
import User from "../../models/userModels.js";

// $-title  Delete My Account
// $-path   DELETE /api/v1/user/profile
// $-auth   Private

const deleteMyAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "Your account has been successfully deleted",
  });
});

export default deleteMyAccount;
