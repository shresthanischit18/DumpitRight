import mongoose from "mongoose";
import { FROM_EMAIL } from "../config/config.js";
import { HttpStatus } from "../constant/constants.js";
import sendSuccessResponse from "../helpers/apiResponseHandler.js";
import { User } from "../schemaModels/model.js";
import { generateAuthToken, sendMail } from "../utils/index.js";
import { asyncErrorHandler, throwError } from "../helpers/index.js";

export const addUser = asyncErrorHandler(async (req, res) => {
    let userInfo = req.body;

    if (!userInfo) {
        throwError({
            message: "User data is required",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    //   Checking if any info is missing
    const propertiesToCheck = [
        "fullName",
        "email",
        "phoneNumber",
        "address",
        "role",
        "password",
        "wardNo",
    ];

    if (propertiesToCheck.some((prop) => !userInfo[prop])) {
        throwError({
            message: "All fields are required",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    //   Checking is user already exists
    const isUserExists = await User.findOne({ email: userInfo.email });

    if (isUserExists) {
        throwError({
            message: "User already exists",
            statusCode: HttpStatus.CONFLICT,
        });
    }

    //   Storing user info
    let user = new User({ ...userInfo });

    await user.save();

    sendSuccessResponse({
        res,
        message: "User is added successfully",
    });

    const userMailMessage = {
        from: FROM_EMAIL,
        to: userInfo.email,
        subject: "Welcome to DumpItRight - Your Account is Ready!",
        html: `
    <html>
    <head>
    <title>Welcome to DumpItRight</title>
    <style>
        body {
        font-family: Arial, sans-serif;
        margin: 20px;
        padding: 0;
        color: #333;
        }
        .welcome-message {
        color: #444;
        }
    </style>
    </head>
    <body>
    <h1 class="welcome-message">Welcome to DumpItRight, ${userInfo.fullName}!</h1>
    <p>Thank you for joining DumpItRight! Your commitment to responsible waste management is about to make a real difference.</p>

    <p>To get started, explore how you can reduce, reuse, and recycle with our resources and community. Remember, every small action contributes to a bigger impact!</p>

    <p>If you need any guidance or have questions, feel free to reach out to our support team. We're here to help!</p>

    <p>Together, let's make the planet a cleaner, greener place.</p>

    <p>Warm regards,<br>The DumpItRight Team</p>
    </body>
    </html>
    `,
    };

    const collectorMailMessage = {
        from: FROM_EMAIL,
        to: userInfo.email,
        subject: "Welcome to DumpItRight - Collector Account Activation",
        html: `
    <html>
    <head>
    <title>Welcome Collector to DumpItRight</title>
    <style>
        body {
        font-family: Arial, sans-serif;
        margin: 20px;
        padding: 0;
        color: #333;
        }
        .welcome-message {
        color: #444;
        }
    </style>
    </head>
    <body>
    <h1 class="welcome-message">Welcome Aboard, ${userInfo.fullName}!</h1>
    <p>We're excited to have you join us as a collector on DumpItRight. Your role is crucial in driving our mission of efficient and responsible waste management.</p>

    <p>Here are your initial login credentials:</p>
    <ul>
        <li>Email: ${userInfo.email}</li>
        <li>Password: <strong>${userInfo.password}</strong></li>
    </ul>

    <p>For security reasons, please ensure you <strong>change your password</strong> upon your first login. You can do this under your account settings.</p>

    <p>Should you have any questions or require further assistance, please don't hesitate to reach out. Welcome to the team, and we look forward to making a significant impact together!</p>

    <p>Best Regards,<br>The DumpItRight Team</p>
    </body>
    </html>
    `,
    };

    if (userInfo.role === "user") {
        sendMail(userMailMessage);
    } else if (userInfo.role === "collector") {
        sendMail(collectorMailMessage);
    }
});

export const getAllUsers = asyncErrorHandler(async (req, res) => {
    const role = req.query.role || "user";
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const users = await User.find(
        { role: role },
        {
            password: false,
            verificationCode: false,
        }
    )
        .sort({
            createdAt: -1,
        })
        .limit(limit)
        .skip(skip);

    sendSuccessResponse({
        res,
        data: users,
        message: "All users are fetched successfully",
    });
});

export const deleteUser = asyncErrorHandler(async (req, res) => {
    const userID = req.params.userID;

    // checking if user id is valid mongoose _id
    if (!mongoose.Types.ObjectId.isValid(userID)) {
        throwError({
            message: "User does not exists",
            statusCode: HttpStatus.NOT_FOUND,
        });
    }

    const user = await User.findByIdAndDelete(userID);

    if (!user) {
        throwError({
            message: "User not found",
            statusCode: HttpStatus.NOT_FOUND,
        });
    }

    sendSuccessResponse({
        res,
        message: "User is deleted successfully",
    });
});

export const updateUser = asyncErrorHandler(async (req, res) => {
    const userID = req.params.userID;

    console.log("user id is", userID);
    let userInfo = req.body;
    console.log(userInfo, "userinfo");

    // checking if user id is valid mongoose _id
    if (!mongoose.Types.ObjectId.isValid(userID)) {
        throwError({
            message: "User does not exists",
            statusCode: HttpStatus.NOT_FOUND,
        });
    }

    if (!userInfo) {
        throwError({
            message: "User info is required",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    let user = await User.findById(userID);

    if (!user) {
        throwError({
            message: "User not found",
            statusCode: HttpStatus.NOT_FOUND,
        });
    }

    // Making sure that email cannot be changed
    if (userInfo.email && user.email !== userInfo.email) {
        throwError({
            message: "Email cannot be changed",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    // Merging the initial user details with new updated details
    Object.assign(user, userInfo);

    // Saving the updated user details
    user = await user.save();

    sendSuccessResponse({
        res,
        data: user,
        message: "User details are updated successfully",
    });
});

export const getUserByID = asyncErrorHandler(async (req, res) => {
    const userID = req.params.userID;

    // checking if user id is valid mongoose _id
    if (!mongoose.Types.ObjectId.isValid(userID)) {
        throwError({
            message: "User does not exists",
            statusCode: HttpStatus.NOT_FOUND,
        });
    }

    let user = await User.findById(userID);

    if (!user) {
        throwError({
            message: "User not found",
            statusCode: HttpStatus.NOT_FOUND,
        });
    }

    sendSuccessResponse({
        res,
        data: user,
        message: "User detail is fetched successfully",
    });
});

export const getAvailableCollector = asyncErrorHandler(async (req, res) => {
    const { wardNo } = req.params;

    if (!wardNo) {
        throwError({
            message: "Ward No is required",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    const collectors = await User.find({
        wardNo: wardNo * 1,
        role: "collector",
        pickupCounts: {
            $lte: 10,
        },
    });

    sendSuccessResponse({
        res,
        data: collectors,
        message: "Available collectors are fetched successfully",
    });
});
