import { Schema } from "mongoose";

export const subscriptionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: ["Monthly", "Yearly"],
            required: true,
        },
        status: {
            type: String,
            enum: ["Active", "Expired"],
            default: "Active",
        },
        endDate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

export default subscriptionSchema;
