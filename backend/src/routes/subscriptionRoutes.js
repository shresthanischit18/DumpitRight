import { Router } from "express";
import {
    createSubscription,
    expireSubscription,
    getActiveSubscription,
    getSubscriptionListByUser,
    renewSubscription,
} from "../controllers/subscriptionController.js";

const subscriptionRouter = new Router();

subscriptionRouter.route("/").post(createSubscription);
subscriptionRouter.route("/user/:userID").get(getActiveSubscription);
subscriptionRouter.route("/all/user/:userID").get(getSubscriptionListByUser);
subscriptionRouter.route("/renew/:subscriptionID").get(renewSubscription);
subscriptionRouter.route("/expire/:subscriptionID").patch(expireSubscription);

export default subscriptionRouter;
