import express from "express";
import {
    changePassword,
    forgotPassword,
    generateOTP,
    login,
} from "../controllers/authController.js";


const authRouter = express.Router();

authRouter.route("/login").post(login);

// Changing password using old password
authRouter.route("/change-password").post(changePassword);

// Changing the password using the OTP
authRouter.route("/forgot-password").post(forgotPassword);

// Generate OTP
authRouter.route("/generate-otp").post(generateOTP);

export default authRouter;
