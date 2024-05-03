import asyncHandler from "express-async-handler";
import User from "../../models/userModels.js";
import VerificationToken from "../../models/verifyResetTokenModel.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { generateHex } from "../../helpers/generateHex.js";

const domainURL = process.env.DOMAIN;

// $-title  Send a password reset email
// $-path   POST /api/v1/auth/reset_password_request
// $-auth   Public

const resetPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("An email is required");
  }

  const existingUser = await User.findOne({ email }).select("-passwordConfirm");

  if (!existingUser) {
    res.status(400);
    throw new Error("We are unable to find a user with that email");
  }

  // If the user is not verified, remind them to verify their email and send email with new verification token

  if (existingUser && !existingUser.isEmailVerified) {
    let newToken = generateHex();

    //send email verification token
    let verificationToken = await VerificationToken.findOne({
      _userId: existingUser._id,
    });

    if (verificationToken) {
      await verificationToken.deleteOne();
    }

    verificationToken = await new VerificationToken({
      _userId: existingUser._id,
      token: newToken,
    }).save();

    const emailLink = `${domainURL}/auth/verify/${verificationToken.token}/${existingUser._id}`;

    const payload = {
      name: existingUser?.firstName,
      link: emailLink,
    };

    await sendEmail(
      existingUser.email,
      "Account Verification",
      "../emails/template/accountVerification.hbs",
      payload
    );

    res.status(200).json({
      success: true,
      message: `Hey ${existingUser?.firstName}, your email is not verified. We have sent you a new verification link to your email address.`,
    });

    return;
  }

  let verificationToken = await VerificationToken.findOne({
    _userId: existingUser._id,
  });

  if (verificationToken) {
    await verificationToken.deleteOne();
  }

  const resetToken = generateHex();

  let newVerificationToken = await new VerificationToken({
    _userId: existingUser._id,
    token: resetToken,
    createdAt: Date.now(),
  }).save();

  if (existingUser) {
    const emailLink = `${domainURL}/auth/reset_password?emailToken=${newVerificationToken.token}&userId=${existingUser._id}`;

    const payload = {
      name: existingUser?.firstName,
      link: emailLink,
    };

    await sendEmail(
      existingUser.email,
      "Password Reset",
      "../emails/template/requestResetPassword.hbs",
      payload
    );

    res.status(200).json({
      success: true,
      message: `Hey ${existingUser?.firstName}, we have sent you a password reset link to your email address.`,
    });
  }
});

// $-title  Reset password
// $-path   POST /api/v1/auth/reset_password
// $-auth   Public

const resetPassword = asyncHandler(async (req, res) => {
  const { userId, emailToken, password, passwordConfirm } = req.body;

  if (!password) {
    res.status(400);
    throw new Error("Password is missing");
  }

  if (!passwordConfirm) {
    res.status(400);
    throw new Error("Password confirmation is missing");
  }

  if (password !== passwordConfirm) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters long");
  }

  if (!userId) {
    res.status(400);
    throw new Error("");
  }
  let passwordResetToken = await VerificationToken.findOne({
    _userId: userId,
  });

  if (!passwordResetToken) {
    res.status(400);
    throw new Error("Invalid or expired password reset token");
  }

  const user = await User.findById({
    _id: passwordResetToken._userId,
  }).select("-passwordConfirm");

  if (user && passwordResetToken) {
    user.password = password;
    await user.save();

    const payload = {
      name: user?.firstName,
    };

    await sendEmail(
      user.email,
      "Password Reset Successful",
      "../emails/template/resetPassword.hbs",
      payload
    );

    res.status(200).json({
      success: true,
      message: `Hey ${user?.firstName}, your password has been reset successfully. You can now login with your new password.`,
    });
  }
});

export { resetPasswordRequest, resetPassword };
