import asyncHandler from "express-async-handler";
import User from "../../models/userModels.js";

// $-title  Update user profile
// $-path   PATCH /api/v1/user/profile
// $-auth   Private

const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fields that should not be updated
  const nonUpdatableFields = [
    "password",
    "passwordConfirm",
    "email",
    "isEmailVerified",
    "provider",
    "roles",
    "googleID",
  ];
  const fieldsToUpdate = Object.keys(req.body);

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const invalidFields = nonUpdatableFields.filter((field) =>
    fieldsToUpdate.includes(field)
  );

  if (invalidFields.length > 0) {
    res.status(400);
    throw new Error(
      `You cannot update the following field(s): ${invalidFields.join(", ")}`
    );
  }

  const updatedProfile = await User.findByIdAndUpdate(
    userId,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  ).select("-refreshTokens");

  res.status(200).json({
    success: true,
    message: `${updatedProfile.firstName}, your profile was successfully updated`,
    data: updatedProfile,
  });
});

export default updateUserProfile;
