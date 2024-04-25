import express from "express";
import registerUser from "../controllers/auth/registerController.js";
import verifyUserEmail from "../controllers/auth/verifyEmailController.js";
import loginUser from "../controllers/auth/loginController.js";
import { loginLimiter } from "../middleware/apiLimiter.js";
import newAccessToken from "../controllers/auth/refreshTokenController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);

router.get("/verify/:emailToken/:userId", verifyUserEmail);
router.get("/new_access_token", newAccessToken);

export default router;
