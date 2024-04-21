import { Schema } from "mongoose";
import { Feedback, User } from "../model.js";

const feedbackSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        collector: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        feedback: {
            type: String,
        },

        rating: {
            type: Number,
        },

        wasteType: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

feedbackSchema.post("save", async function (doc, next) {
    if (this.status === "Completed") {
        const allRatings = await Feedback.find({
            status: "Completed",
            collector: this.collector,
        });

        const totalRating = allRatings.reduce(
            (acc, curr) => acc + curr.rating,
            0
        );

        const avgRating = totalRating / allRatings.length;

        Promise.all([
            User.findByIdAndUpdate(this.user, {
                $inc: { rewardPoint: 10 },
            }),
            // Updating the rating of collector
            User.findByIdAndUpdate(this.collector, {
                rating: avgRating,
            }),
        ]);

        return next();
    }
});

export default feedbackSchema;
