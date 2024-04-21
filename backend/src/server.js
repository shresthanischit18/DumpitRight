import cors from "cors";
import express from "express";
import logger from "morgan";
import { PORT, STATIC_FOLDER } from "./config/config.js";
import connectDB from "./connectDB/db.js";
import apiRouter from "./routes/index.js";
import productRouter from "./routes/productRoutes.js";
import handleError from "./middlewares/globalErrorHandler.js";
import cookieParser from "cookie-parser";
import fs from "fs";
import { RegularPickupSchedule, Subscription } from "./schemaModels/model.js";
import cron from "node-cron";
import {
    sendFeedbackRequestMail,
    sendRemainderMail,
} from "./controllers/feedbackController.js";
import {
    deleteScheduleIfCollectorDoesNotExist,
    getWasteTypeForDay,
} from "./utils/index.js";

export const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(STATIC_FOLDER));

app.use("/", apiRouter);

const folderName = "./public";

try {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }
} catch (err) {
    console.error(err);
}

app.use(handleError);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });

    // Cron job to run every day at midnight (00:00)
    cron.schedule("* * * * *", async () => {
        console.log("Running cron job to update expired subscriptions");

        const now = new Date();

        try {
            await Subscription.updateMany(
                { endDate: { $lt: now }, status: "Active" }, // Conditions: endDate has passed and status is Active
                { $set: { status: "Expired" } } // Action: Set status to Expired
            );

            deleteScheduleIfCollectorDoesNotExist();
        } catch (error) {
            console.error("Error updating expired subscriptions", error);
        }
    });

    // Reminder for Morning Pickup
    // Every day at 7 PM
    cron.schedule("0 19 * * *", () => {
        sendRemainderMail("Morning");
        console.log("Morning Remainder");
    });

    // Reminder for Afternoon Pickup
    // Every day at 9 AM
    cron.schedule("0 9 * * *", () => {
        sendRemainderMail("Afternoon");
        console.log("Afternoon Remainder");
    });

    // Reminder for Evening Pickup
    // Every day at 1 PM
    cron.schedule("0 13 * * *", () => {
        sendRemainderMail("Evening");
        console.log("Evening Remainder");
    });

    // This runs every day at 7 AM
    // Sends feedbackform to users who had a pickup yesterday
    cron.schedule("0 12 * * *", () => {
        sendFeedbackRequestMail();
        console.log("Feedback Mail Corn Job");
    });
});
