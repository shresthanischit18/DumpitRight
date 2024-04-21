import { Schema } from "mongoose";
import { User } from "../model.js";
import { FROM_EMAIL } from "../../config/config.js";
import { sendMail } from "../../utils/index.js";

const regularPickupScheduleSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        wasteType: {
            type: String,
            enum: ["Organic", "Recyclable", "Hazardous"],
            required: true,
        },
        frequency: {
            type: String,
            enum: ["Weekly", "Biweekly", "Monthly"],
            required: true,
        },
        day: {
            type: String,
            enum: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            required: true,
        },
        time: {
            type: String,
            enum: ["Morning", "Afternoon", "Evening"],
            required: true,
        },

        specialInstructions: {
            type: String,
            default: "No special instructions",
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        collector: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

regularPickupScheduleSchema.pre("save", async function (next) {
    if (this.isModified("isActive")) {
        return next();
    }

    const collector = await User.findById(this.collector);

    const mailMessageForCollector = {
        from: FROM_EMAIL,
        to: collector.email,
        subject: "Notice about new pickup schedule",
        html: `
        <html>
        <body>
            <h2>New Pickup Schedule Notification</h2>
            <p>Hello ${collector.fullName},</p>
            <p>We are pleased to inform you that a new pickup schedule has been set up for you:</p>
            <ul>
                <li><strong>Waste Type:</strong> ${this.wasteType}</li>
                <li><strong>Frequency:</strong> ${this.frequency}</li>
                <li><strong>Day:</strong> ${this.day}</li>
                <li><strong>Time:</strong> ${this.time}</li>
            </ul>
            <p>Please Check you dashboard for more information</p>
            <p>Thank you for your cooperation.</p>
            <p>Best regards,<br>The Dump it Right Team</p>
        </body>
        </html>
    `,
    };

    sendMail(mailMessageForCollector);

    next();
});

export default regularPickupScheduleSchema;
