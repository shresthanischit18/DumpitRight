import express from "express";
import authRouter from "./authRoutes.js";
import blogRouter from "./blogRoutes.js";
import userRouter from "./userRoutes.js";
import subscriptionRouter from "./subscriptionRoutes.js";
import regularPickupRouter from "./regularPickupsRoutes.js";
import specialPickupRouter from "./specialWastePickupRoutes.js";
import feedbackRouter from "./feedbackRoutes.js";
import productRouter from "./productRoutes.js";
import categoryRouter from "./categoryRoutes.js";
import orderRouter from "./orderRoutes.js";

const apiRouter = express.Router();

const apiRoutes = [
    {
        router: userRouter,
        path: "/users",
    },
    {
        router: authRouter,
        path: "/auth",
    },
    {
        router: blogRouter,
        path: "/blogs",
    },

    {
        router: subscriptionRouter,
        path: "/subscriptions",
    },
    {
        router: regularPickupRouter,
        path: "/regular-pickups",
    },
    {
        router: specialPickupRouter,
        path: "/special-pickups",
    },
    {
        router: feedbackRouter,
        path: "/feedbacks",
    },
    {
        router: productRouter,
        path: "/products",
    },
    {
        router: categoryRouter,
        path: "/category",
    },
    {
        router: orderRouter,
        path: "/orders",
    },
];

apiRoutes.forEach((route) => apiRouter.use(route.path, route.router));

export default apiRouter;
