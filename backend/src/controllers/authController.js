import bcrypt from "bcrypt";
import { FROM_EMAIL, SECRET_KEY } from "../config/config.js";
import { HttpStatus } from "../constant/constants.js";
import { Subscription, User } from "../schemaModels/model.js";
import { generateAuthToken, sendMail } from "../utils/index.js";
import { randomInt } from "crypto";

import {
    asyncErrorHandler,
    throwError,
    sendSuccessResponse,
} from "../helpers/index.js";

export const login = asyncErrorHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throwError({
            message: "Email and password required",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        throwError({
            message: "User does not exist with this email address",
            statusCode: HttpStatus.NOT_FOUND,
        });
    }

    const userSubscriptionDetails = await Subscription.findOne({
        user: user._id,
        status: "Active",
    });

    // Comparing the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throwError({
            message: "Wrong password, please check your password",
            statusCode: HttpStatus.UNAUTHORIZED,
        });
    }

    const authToken = generateAuthToken({ _id: user._id });

    sendSuccessResponse({
        res,
        statusCode: HttpStatus.OK,
        message: `Authentication successful, Welcome ${user.fullName}`,
        data: {
            user: {
                ...user.toObject(),
                password: null,
                verificationCode: null,
                subscription: userSubscriptionDetails,
            },

            authToken,
        },
    });
});

export const changePassword = asyncErrorHandler(async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
        throwError({
            message: "Email, Old password and new password are required",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        throwError({
            message: "User does not exist with this email address",
            statusCode: HttpStatus.NOT_FOUND,
        });
    }

    // Comparing the password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
        throwError({
            message: "Wrong password, please check your password",
            statusCode: HttpStatus.UNAUTHORIZED,
        });
    }

    user.password = newPassword;

    await user.save();

    sendSuccessResponse({
        res,
        statusCode: HttpStatus.OK,
        message: "Password has been changed successfully",
    });
});

export const generateOTP = asyncErrorHandler(async (req, res) => {
    const email = req.body.email;

    if (!email) {
        throwError({
            message: "Email is required",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        throwError({
            message: "User does not exist with this email address",
            statusCode: HttpStatus.NOT_FOUND,
        });
    }

    //   Generating OTP
    user.verificationCode.code = randomInt(100000, 999999);

    // Get the current date and time
    const currentDate = new Date();

    // Add 5 minutes to the current date
    const newDate = new Date(currentDate.getTime() + 5 * 60000);

    user.verificationCode.expiration = newDate;

    // Sending mail to the user
    const mailMessage = {
        from: FROM_EMAIL,
        // Email or array of email
        to: user.email,
        subject: "OTP for password reset",
        // Mail Message should be here in html format
        html: `
            <h3>Your One-Time Password (OTP) Code</h3>
            <p>Dear ${user.fullName},</p>
            <p>Your OTP code for Password change is:<strong>${user.verificationCode.code}</strong></p>
            <p>This OTP code is valid for a 5 minutes only. Please use it within the specified time frame.</p>
            <p>Regards,</p>
            <p>DumpItRightTeam</p>
        `,
    };

    Promise.allSettled([user.save(), sendMail(mailMessage)]);

    sendSuccessResponse({
        res,
        message: "Your OTP code has been sent to mail. Please check it",
        statusCode: HttpStatus.OK,
        data: {
            verificationCode: user.verificationCode.code,
        },
    });
});

export const forgotPassword = asyncErrorHandler(async (req, res) => {
    const { email, verificationCode, newPassword } = req.body;

    if (!email || !verificationCode || !newPassword) {
        throwError({
            message: "Email, verification code and password is required",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        throwError({
            message: "User does not exist with this email address",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    const verificationCodeExpiration = new Date(
        user.verificationCode.expiration
    );

    const isOPTCodeValid =
        user.verificationCode.code == verificationCode &&
        verificationCodeExpiration > new Date();

    if (!isOPTCodeValid) {
        throwError({
            message: "Incorrect OTP code, please check and enter correct OTP",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    user.password = newPassword;
    user.verificationCode.code = null;
    user.verificationCode.expiration = null;

    await user.save();

    sendSuccessResponse({
        res,
        message: "Your password has been changed successfully",
        statusCode: HttpStatus.OK,
    });
});
