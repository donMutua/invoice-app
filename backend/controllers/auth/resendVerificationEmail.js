import asyncHandler from "express-async-handler";
import User from "../../models/userModels.js";
import VerifyResetToken from "../../models/verifyResetTokenModel.js";

import { sendEmail } from "../../utils/sendEmail.js";
import { generateHex } from "../../helpers/generateHex.js";

const domainURL = process.env.DOMAIN;

// $-title  Login user, get access and refresh tokens
// $-path   POST /api/v1/auth/register
// $-auth   Public

const resendEmailVerificationToken = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!email) {
    res.status(400);
    throw new Error("An email is required");
  }

  if (!user) {
    res.status(400);
    throw new Error("We are unable to find a user with that email");
  }

  if (user.isEmailVerified) {
    res.status(400);
    throw new Error("Your email is already verified");
  }

  let verificationToken = await VerifyResetToken.findOne({ _userId: user._id });

  if (verificationToken) {
    await verificationToken.deleteOne();
  }

  verificationToken = new VerifyResetToken({
    _userId: user._id,
    token: generateHex(),
  });

  await verificationToken.save();

  const emailLink = `${domainURL}/auth/verify/${verificationToken.token}/${user._id}`;

  const payload = {
    name: user?.firstName,
    link: emailLink,
  };

  await sendEmail(
    user.email,
    "Account Verification",
    "../emails/template/accountVerification.hbs",
    payload
  );

  res.json({
    success: true,
    message: `${user?.firstName}, a verification email has been sent to ${user?.email}`,
  });
});

export default resendEmailVerificationToken;
