import express from "express";
import getUserProfile from "../controllers/user/getUserProfile.js";
import updateUserProfile from "../controllers/user/updateUserProfile.js";
import deleteMyAccount from "../controllers/user/deleteMyAccount.js";
import getAllUserAccounts from "../controllers/user/getAllUserAccounts.js";

import role from "../middleware/rolesMiddleware.js";
import checkAuth from "../middleware/checkAuthMiddleware.js";

const router = express.Router();

router.get("/profile", checkAuth, getUserProfile);
router.patch("/profile", checkAuth, updateUserProfile);
router.delete("/profile", checkAuth, deleteMyAccount);
router.get(
  "/all",
  checkAuth,
  role.checkRoles(role.ROLES.Admin),
  getAllUserAccounts
);

export default router;
