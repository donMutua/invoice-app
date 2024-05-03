import asyncHandler from "express-async-handler";
import User from "../../models/userModels.js";

// $-title  Delete User Account
// $-path   DELETE /api/v1/user/:id
// $-auth   Private/Admin
// an admin can delete any user account

const deleteUserAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: `user account with the name ${user.firstName} has been successfully deleted`,
  });
});

export default deleteUserAccount;
