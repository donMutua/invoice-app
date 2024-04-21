import bcrypt from "bcryptjs";
import "dotenv/config";
import mongoose from "mongoose";
import validator from "validator";
import { USER } from "../constants/index.js";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter your email"],
      isLowercase: true,
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },

    username: {
      type: String,
      required: [true, "Please enter your username"],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9_]{3,23}$/.test(v);
        },
        message:
          "Username must be between 3 and 23 characters long and can only contain letters, numbers, and underscores",
      },
    },

    firstName: {
      type: String,
      required: [true, "Please enter your first name"],
      trim: true,
      validate: [validator.isAlpha, "First name must only contain letters"],
    },

    lastName: {
      type: String,
      required: [true, "Please enter your last name"],
      trim: true,
      validate: [validator.isAlpha, "Last name must only contain letters"],
    },

    password: {
      type: String,
      required: [true, "Please enter your password"],
      select: false,
      validate: [
        validator.isStrongPassword,
        "Password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character",
      ],
    },

    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (v) {
          return this.password === v;
        },
        message: "Passwords do not match",
      },
    },

    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },

    provider: {
      type: String,
      required: true,
      default: "email",
    },
    googleID: String,
    avatar: String,
    businessName: String,
    mobileNumber: {
      type: String,
      default: "+254700000000",
      validate: [
        validator.isMobilePhone,
        "Your mobile phone number must begin with +254",
      ],
    },
    address: String,
    city: String,
    country: String,
    passwordChangedAt: Date,
    roles: {
      type: [String],
      default: [USER],
    },
    active: {
      type: Boolean,
      default: true,
    },
    refreshToken: [String],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.roles.length === 0) {
    this.roles.push(USER);
  }

  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  let timestamp = Date.now();
  let date = new Date(timestamp);

  this.passwordChangedAt = date.toISOString();
  next();

  userSchema.methods.comparePassword = async function (givenPassword) {
    return await bcrypt.compare(givenPassword, this.password);
  };
});

const User = mongoose.model("User", userSchema);

export default User;
