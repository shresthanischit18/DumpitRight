import mongoose from "mongoose";
import blogSchema from "./schemas/blogSchema.js";
import userSchema from "./schemas/userSchema.js";
import subscriptionSchema from "./schemas/SubscriptionSchema.js";
import productSchema from "./schemas/productSchema.js";
import regularPickupScheduleSchema from "./schemas/regularPickupSchema.js";
import specialPickupSchema from "./schemas/specialWastePickupSchema.js";
import feedbackSchema from "./schemas/feedbackSchema.js";
import categorySchema from "./schemas/categorySchema.js";
import orderSchema from "./schemas/orderSchema.js";


export const User = mongoose.model("User", userSchema);
export const Blog = mongoose.model("Blog", blogSchema);
export const Subscription = mongoose.model("Subscription", subscriptionSchema);
export const Product = mongoose.model("Product", productSchema)
export const Category = mongoose.model("Category", categorySchema)
export const Order = mongoose.model("Order", orderSchema)




export const RegularPickupSchedule = mongoose.model(
    "RegularPickupSchedule",
    regularPickupScheduleSchema
);

export const SpecialPickup = mongoose.model(
    "SpecialPickup",
    specialPickupSchema
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
