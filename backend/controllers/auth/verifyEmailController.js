import asyncHandler from "express-async-handler";
import User from "../../models/userModels.js";
import VerificationToken from "../../models/verifyResetTokenModel.js";
import { sendEmail } from "../../utils/sendEmail.js";

const domainURL = process.env.DOMAIN;

// $-title  Verify a user's email
// $-path   POST /api/v1/auth/verify/:emailToken/:userId
// $-auth   Public

const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId }).select(
    "-passwordConfirm"
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    res.status(400);
    throw new Error("User is already verified, please login");
  }

  const userToken = await VerificationToken.findOne({
    _userId: user._id,
    token: req.params.emailToken,
  });

  console.log("userToken", userToken);

  if (!userToken) {
    res.status(400);
    throw new Error("Token is invalid or expired");
  }

  user.isEmailVerified = true;
  await user.save();

  if (user.isEmailVerified) {
    const emailLink = `${domainURL}/login`;

    const payload = {
      name: user?.firstName,
      link: emailLink,
    };

    await sendEmail(
      user.email,
      "Welcome - Account Verified",
      payload,
      "./emails/template/welcome.handlebars"
    );

    res.redirect(`/auth/verify`);
  }
});

export default verifyEmail;
