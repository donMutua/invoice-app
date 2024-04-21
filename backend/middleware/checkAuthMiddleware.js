import asyncHandler from "express-async-handler";
import jwt, { decode } from "jsonwebtoken";
import User from "../models/userModel.js";

const checkAuth = asyncHandler(async (req, res, next) => {
  let jwtToken;

  //Bearer token
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer")) {
    res.status(401);
    throw new Error("You are not authorized to use our platform");
  }

  if (authHeader && authHeader.startsWith("Bearer")) {
    jwtToken = authHeader.split(" ")[1];

    jwt.verify(jwtToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(403);

      const userId = decoded.id;
      req.user = await User.findById(userId).select("-password");
      req.roles = decoded.roles;
      next();
    });
  }
});

export default checkAuth;
