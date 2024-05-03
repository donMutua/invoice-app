import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

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

    jwt.verify(
      jwtToken,
      process.env.JWT_ACCESS_SECRET_KEY,
      async (err, decoded) => {
        if (err) {
          res.status(403).json({ message: "Invalid or expired token" });
          return;
        }

        const userId = decoded.id;
        req.user = await User.findById(userId).select("-password");
        req.roles = decoded.roles;
        next();
      }
    );
  }
});

export default checkAuth;
