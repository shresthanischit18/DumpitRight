import mongoose from "mongoose";

var productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        
        description: {
            type: String,
            required: true,
        },
        point: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
    },
        quantity: {
            type: Number,
            required: true,
        },
        sold: {
            type: Number,
            default: 0,
        },
        images: {
            type: Array,

        },
    },
    { timestamps: true }
);
export default productSchema;

