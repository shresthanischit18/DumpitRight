import mongoose, { mongo } from "mongoose";
import {
    asyncErrorHandler,
    sendSuccessResponse,
    throwError,
} from "../helpers/index.js";
import { Order, User } from "../schemaModels/model.js";
import { FROM_EMAIL } from "../config/config.js";
import sendMail from "../utils/sendMail.js";

// POST /orders
export const placeOrder = asyncErrorHandler(async (req, res) => {
    const { orderItems, orderTotal, userID } = req.body;

    if (
        orderItems?.length === 0 ||
        !orderTotal ||
        !mongoose.isValidObjectId(userID)
    ) {
        throwError({
            statusCode: 400,
            message: "Order Items or Order Total or User ID is missing",
        });
    }

    const user = await User.findById(userID);

    if (!user) {
        throwError({
            statusCode: 404,
            message: "User not found",
        });
    }

    const order = new Order({
        orderTotal,
        orderItems,
        user: userID,
    });

    user.rewardPoint -= parseFloat(orderTotal);

    await user.save();
    const createdOrder = await order.save();

    sendSuccessResponse({
        res,
        data: createdOrder,
        statusCode: 201,
        message: "Order placed successfully",
    });

    const mailMessage = {
        from: FROM_EMAIL,

        // Email or array of email
        to: user.email,

        subject: "Order Confirmation",

        // Mail Message should be here in html format
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Confirmation</title>
            </head>
            <body>
                <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1>Order Confirmation</h1>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p>Dear ${user.fullName},</p>
                        <p>Your order has been successfully placed. Below are the details:</p>
                        <table style="border-collapse: collapse; width: 100%;">
                            <thead>
                                <tr>
                                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Title</th>
                                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item Point</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Replace the following block with a loop to iterate over order items -->
                               
                                    ${orderItems.map(
                                        (item) => `
                                         <tr>
                                            <td style="border: 1px solid #ddd; padding: 8px;">${item.title}</td>
                                            <td style="border: 1px solid #ddd; padding: 8px;">${item.point}</td>
                                        </tr>
                                        `
                                    )}
                            </tbody>
                        </table>
                        <p style="font-weight: bold; margin-top: 20px;">Total Reward Points: ${orderTotal}</p>
                    </div>
                    <p>Thank you for your order!</p>
                </div>
            </body>
            </html>
        `,
    };

    sendMail(mailMessage);
});

// GET /orders/user/:userID
export const getOrdersListByUser = asyncErrorHandler(async (req, res) => {
    const userID = req.params.userID;

    if (!mongoose.isValidObjectId(userID)) {
        throwError({
            statusCode: 400,
            message: "Invalid user ID",
        });
    }

    const orders = await Order.find({ user: userID }).sort({
        createdAt: -1,
    });

    sendSuccessResponse({
        res,
        data: orders,
        statusCode: 200,
    });
});

// GET /orders/
export const getAllOrders = asyncErrorHandler(async (req, res) => {
    const orders = await Order.find()
        .populate({
            path: "user",
        })
        .sort({
            createdAt: -1,
        });

    sendSuccessResponse({
        res,
        data: orders,
        statusCode: 200,
    });
});
