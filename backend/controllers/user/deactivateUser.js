import asyncHandler from "express-async-handler";
import User from "../../models/userModels.js";

// $-title  Deactivate User by Admin
// $-path   DELETE /api/v1/user/deactivate/:id
// $-auth   Private/Admin
// an admin can deactivate any user account

const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.active = false;

  await user.save();

  res.status(200).json({
    success: true,
    message: `user account with the name ${user.firstName} has been successfully deactivated`,
  });
});

export default deactivateUser;
