import mongoose, { Schema } from "mongoose";

var orderSchema = new mongoose.Schema(
    {
        orderItems: {
            type: Array,
            required: true,
        },
        orderTotal: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
    },
    { timestamps: true }
);
export default orderSchema;


