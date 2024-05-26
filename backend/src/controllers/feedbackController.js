import {
    Feedback,
    RegularPickupSchedule,
    User,
} from "../schemaModels/model.js";
import { getWasteTypeForDay, sendMail } from "../utils/index.js";
import { WASTE_PICKUP_TIME } from "../constant/constants.js";
import { CLIENT_URL, FROM_EMAIL } from "../config/config.js";
import { format } from "date-fns";
import asyncErrorHandler from "../helpers/asyncErrorHandler.js";
import { sendSuccessResponse } from "../helpers/apiResponseHandler.js";
import mongoose from "mongoose";
import throwError from "../helpers/createError.js";

//Send remainder mail for waste pickup
export const sendRemainderMail = async (time) => {
    const day = format(new Date(), "EEEE");

    const wasteType = getWasteTypeForDay(day);

    const regularSchedules = await RegularPickupSchedule.find({
        day,
        time,
        isActive: true,
    }).populate("user");

    const allMails = regularSchedules.map((schedule) => schedule.user.email);

    if (allMails.length === 0) {
        return;
    }

    const mailMessage = {
        from: FROM_EMAIL,

        // Email or array of email
        to: allMails,

        subject: `${time} Pickup Reminder`,

        // Mail Message should be here in html format
        html: `
        <h4 style="color: #046307;">Waste Pickup Reminder</h4>
        <p>Dear Users,</p>
        <p>This is a reminder to prepare your <strong>${wasteType}</strong> waste for pickup on <strong>${day}</strong>.</p>
        <p>Please ensure that your waste is ready for collection at: <strong>${WASTE_PICKUP_TIME[time]}</strong></p>
        <p>Thank you for helping us keep our community clean and sustainable.</p>
        <p>Warm regards,</p>
        <p>The DumpItRight Team</p>
    `,
    };

    sendMail(mailMessage);
};

// Send mail for feedback after pickup
export const sendFeedbackRequestMail = async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const day = format(yesterday, "EEEE"); // Sunday, Monday ....
    // const day = "Saturday"

    const schedules = await RegularPickupSchedule.find({
        day,
        isActive: true,
    }).populate("user");

    if (schedules.length === 0) {
        return;
    }

    const feedbacks = schedules.map((schedule) => {
        return {
            user: schedule.user,
            wasteType: schedule.wasteType,
            collector: schedule.collector,
        };
    });

    Feedback.insertMany(feedbacks);

    const allSendMails = schedules.map((schedule) => {
        const mailMessage = {
            from: FROM_EMAIL,

            // Email or array of email
            to: schedule.user.email,

            subject: "Earn Reward Points by Providing Your Feedback!",

            // HTML content for the email
            html: `
             <div style="font-family: Arial, sans-serif; color: #333;">
                <h3 style="color: #0254EB;">Your Feedback Makes a Difference</h3>
                <p>Dear ${schedule.user.fullName},</p>
                <p>Thank you for choosing our waste collection services. We're committed to constantly improving, and your feedback is vital to our efforts.</p>
                <p>We encourage you to submit your feedback through <strong>your personal dashboard</strong> where you can also view your past interactions and rewards. <strong>Completing the feedback form will earn you valuable reward points</strong>, which you can redeem for various benefits in our services.</p>
                <p><a href="${CLIENT_URL}/login" style="color: #FF9500; text-decoration: none; font-weight: bold;">Log in to your dashboard</a> and fill out the feedback form today to claim your points!</p>
                <p>If you need any assistance or have questions, feel free to contact us at <a href="mailto:dumpitright18@gmail.com">dumpitright18@gmail.com</a>.</p>
                <p>We look forward to your valuable insights.</p>
                <p>Warm regards,</p>
                <p>The DumpItRight Team</p>
            </div>
        `,
        };

        return sendMail(mailMessage);
    });

    await Promise.all(allSendMails);
};

// Get feedbacks by user ID
export const getFeedbacksByUserID = asyncErrorHandler(async (req, res) => {
    const { userID } = req.params;

    const feedbacks = await Feedback.find({
        user: userID,
        status: "Pending",
    })
        .sort("-createdAt")
        .populate("collector");

    sendSuccessResponse({
        res,
        data: feedbacks,
        message: "Feedbacks fetched successfully",
    });
});

// Update feedback status
export const updateFeedbackDetails = asyncErrorHandler(async (req, res) => {
    const { feedbackID } = req.params;

    const { feedback, rating } = req.body;

    if (
        !feedback ||
        !rating ||
        rating * 1 < 1 ||
        rating * 1 > 5 ||
        !mongoose.isValidObjectId(feedbackID)
    ) {
        throwError({
            message: "Invalid data",
            statusCode: 400,
        });
    }

    const existingFeedback = await Feedback.findById(feedbackID);

    if (!existingFeedback) {
        throwError({
            message: "Feedback not found",
            statusCode: 404,
        });
    }

    existingFeedback.feedback = feedback;
    existingFeedback.rating = rating;
    existingFeedback.status = "Completed";

    await existingFeedback.save();

    sendSuccessResponse({
        res,
        message: "Feedback updated successfully",
    });
});

// Get feedbacks by collector ID
export const getFeedbackByCollectorID = asyncErrorHandler(async (req, res) => {
    const { collectorID } = req.params;

    const feedbacks = await Feedback.find({
        collector: collectorID,
        status: "Completed",
    }).sort("-createdAt");

    sendSuccessResponse({
        res,
        data: feedbacks,
        message: "Feedbacks fetched successfully",
    });
});

// get all feedbacks
export const getAllFeedback = asyncErrorHandler(async (req, res) => {
    const feedbacks = await Feedback.find({}).sort("-createdAt");

    sendSuccessResponse({
        res,
        data: feedbacks,
        message: "Feedbacks fetched successfully",
    });
});
