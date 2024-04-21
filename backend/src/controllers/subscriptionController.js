import mongoose from "mongoose";
import {
    asyncErrorHandler,
    sendSuccessResponse,
    throwError,
} from "../helpers/index.js";
import { Subscription } from "../schemaModels/model.js";
import { HttpStatus } from "../constant/constants.js";

// POST subscription
export const createSubscription = asyncErrorHandler(async (req, res) => {
    // code here
    const { userID, amount = 200, type } = req.body;

    if (!mongoose.isValidObjectId(userID) || !amount || !type) {
        throwError({
            message: "User ID, amount and type must be provided",
        });
    }

    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);

    const subscription = new Subscription({
        user: userID,
        amount,
        type,
        endDate: currentDate,
    });

    await subscription.save();

    sendSuccessResponse({
        res,
        data: subscription,
        message: "Subscription saved successfully",
    });
});

// GET /subscriptions/user/userID
export const getActiveSubscription = asyncErrorHandler(async (req, res) => {
    // code here
    const { userID } = req.params;

    if (!mongoose.isValidObjectId(userID)) {
        throwError({
            message: "User ID must be provided",
        });
    }

    const subscription = await Subscription.findOne({
        user: userID,
        status: "Active",
    });

    if (!subscription) {
        throwError({
            message: "Subscription not found",
            statusCode: 404,
        });
    }

    sendSuccessResponse({
        res,
        data: subscription,
    });
});

// RENEW SUBSCRIPTION
// GET /subscriptions/renew/:subscriptionID
export const renewSubscription = asyncErrorHandler(async (req, res) => {
    const { subscriptionID } = req.params;

    if (!mongoose.isValidObjectId(subscriptionID)) {
        throwError({
            message: "User ID must be provided",
        });
    }

    const subscription = await Subscription.findById(subscriptionID);

    if (!subscription) {
        throwError({
            message: "Subscription not found for this user",
            statusCode: HttpStatus.NOT_FOUND,
        });
    }

    const newEndDate = new Date(subscription.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + 1);

    subscription.amount += 200;
    subscription.endDate = newEndDate;

    await subscription.save();

    sendSuccessResponse({
        res,
        data: subscription,
        message: "Subscription renewed successfully",
    });
});

// UPDATE SUBSCRIPTION STATUS
// PATCH /subscriptions/expire/:subscriptionID
export const expireSubscription = asyncErrorHandler(async (req, res) => {
    // code here
    const { userID } = req.params;

    if (!mongoose.isValidObjectId(userID)) {
        throwError({
            message: "User ID must be provided",
        });
    }

    const subscription = await Subscription.findOne({
        user: userID,
        status: "Active",
    });

    if (!subscription) {
        throwError({
            message: "Subscription not found",
            statusCode: 404,
        });
    }

    sendSuccessResponse({
        res,
        data: subscription,
    });
});

// GET /subscriptions/all/user/userID
export const getSubscriptionListByUser = asyncErrorHandler(async (req, res) => {
    // code here
    const { userID } = req.params;

    if (!mongoose.isValidObjectId(userID)) {
        throwError({
            message: "User ID must be provided",
        });
    }

    const subscriptions = await Subscription.find({
        user: userID,
    });

    sendSuccessResponse({
        res,
        data: subscriptions,
    });
});
