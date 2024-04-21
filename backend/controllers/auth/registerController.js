import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import User from "../../models/userModels.js";
import VerifyToken from "../../models/verifyResetTokenModel.js";
import { sendEmail } from "../../utils/sendEmail.js";

const domainURL = process.env.DOMAIN;

// Helper function to validate fields
const validateField = (field, errorMessage) => {
  if (!field) {
    res.status(400);
    throw new Error(errorMessage);
  }
};

// $-title  Register a new user and send a verification email link

// $-path   POST /api/v1/auth/register
// $-auth   Public

const registerUserController = asyncHandler(async (req, res) => {
  const { email, username, firstName, lastName, password, passwordConfirm } =
    req.body;

  validateField(email, "Email is missing");
  validateField(username, "Username is missing");
  validateField(firstName, "First name is missing");
  validateField(lastName, "Last name is missing");
  validateField(password, "Password is missing");
  validateField(passwordConfirm, "Password confirmation is missing");

  if (password !== passwordConfirm) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("The email is already in use");
  }

  const newUser = new User({
    email,
    username,
    firstName,
    lastName,
    password,
    passwordConfirm,
  });

  const registeredUser = await newUser.save();

  if (!registeredUser) {
    res.status(400);
    throw new Error("User could not be registered");
  }

  if (registeredUser) {
    const verificationToken = uuidv4();

    console.log(verificationToken);

    let emailVerificationToken = await new VerifyToken({
      _userId: registeredUser._id,
      token: verificationToken,
    }).save();

    const verificationUrl = `${domainURL}/api/v1/auth/verify/${emailVerificationToken.token}/${registeredUser._id}`;

    const payload = {
      name: registeredUser?.firstName,
      link: verificationUrl,
    };

    await sendEmail({
      email: registeredUser?.email,
      subject: "Account Verification",
      template: "./emails/template/accountVerification.handlebars",
      payload,
    });

    res.json({
      success: true,
      message: `A new user ${registeredUser?.firstName} has been registered. An email has been sent to ${registeredUser?.email} for verification.`,
    });
  }
});

export default registerUserController;
