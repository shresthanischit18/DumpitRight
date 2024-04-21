import { Schema } from "mongoose";

const blogSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
        },

        content: {
            type: String,
            required: [true, "Content is required"],
        },

        coverImg: {
            type: String,
            required: [true, "Cover image is required"],
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
    },
    { timestamps: true }
);

export default blogSchema;
