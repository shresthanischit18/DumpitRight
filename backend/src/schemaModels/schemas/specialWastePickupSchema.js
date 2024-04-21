import { Schema } from "mongoose";
import { User } from "../model.js";
import { format } from "date-fns";
import { WASTE_PICKUP_TIME } from "../../constant/constants.js";
import { FROM_EMAIL } from "../../config/config.js";
import sendMail from "../../utils/sendMail.js";

const specialPickupSchema = new Schema({
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
    specialInstructions: {
        type: String,
        default: "None",
    },
    status: {
        type: String,
        enum: ["Pending", "Collected", "Cancelled"],
        default: "Pending",
        required: true,
    },
    time: {
        type: String,
        enum: ["Morning", "Afternoon", "Evening"],
        required: true,
    },
    pickupDate: {
        type: Date,
        required: true,
    },
    collector: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

specialPickupSchema.pre("save", async function (next) {
    if (this.status === "Collected") {
        const user = await User.findById(this.user);
        user.rewardPoint += 10;
        await user.save();
        return next();
    }

    if (this.status === "Cancelled") {
        return next();
    }

    const [collector, user] = await Promise.all([
        User.findById(this.collector),
        User.findById(this.user),
    ]);

    const mailMessageForCollector = {
        from: FROM_EMAIL,
        to: collector.email,
        subject: "Notice about Urgent pickup",
        html: `
    <html>
    <body>
        <h2>New Pickup Schedule Notification</h2>
        <p>Hello ${collector.fullName},</p>
        <p>We are pleased to inform you that a new pickup schedule has been set up for you:</p>
        <ul>
            <li><strong>Waste Type:</strong> ${this.wasteType}</li>
            <li><strong>Pick up date:</strong> ${format(
                new Date(this.pickupDate),
                "dd MMMM, yyyy"
            )}</li>
            <li><strong>Time:</strong> ${this.time}</li>
        </ul>
        
        <h3>User Information:</h3>
        <ul>
            <li><strong>Full Name:</strong> ${user.fullName}</li>
            <li><strong>Address:</strong> ${user.address}</li>
            <li><strong>Phone Number:</strong> ${user.phoneNumber}</li>
            <li><strong>Ward No:</strong> ${user.wardNo}</li>
        </ul>

        <p>Please check your dashboard for more information.</p>
        <p>Thank you for your cooperation.</p>
        <p>Best regards,<br>The Dump it Right Team</p>
    </body>
    </html>
    `,
    };

    const mailMessage = {
        from: FROM_EMAIL,
        to: user.email,
        subject: "Notice about new pickup schedule",
        html: `
    <html>
    <body>
        <h2>New Pickup Schedule Notification</h2>
        <p>Hello ${user.fullName},</p>
        <p>We are pleased to inform you that an urgent pickup schedule has been scheduled:</p>
        <ul>
            <li><strong>Waste Type:</strong> ${this.wasteType}</li>
            <li><strong>Day:</strong>${format(
                new Date(this.pickupDate),
                "dd MMMM, yyyy"
            )}</li>
            <li><strong>Time:</strong> ${this.time}(${
            WASTE_PICKUP_TIME[this.time]
        })</li>
        </ul>
        
        <p>The waste materials will be collected at your mentioned time. Please ensure your waste is prepared accordingly.</p>

        <p>If any of the information provided is incorrect or needs editing, please contact us immediately so we can make the necessary adjustments.</p>

        <p>Thank you for your cooperation.</p>
        <p>Best regards,<br>The Dump it Right Team</p>
    </body>
    </html>
    `,
    };

    sendMail(mailMessage);
    sendMail(mailMessageForCollector);

    next();
});

export default specialPickupSchema;
