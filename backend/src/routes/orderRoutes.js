import { Router } from "express";
import {
    getAllOrders,
    getOrdersListByUser,
    placeOrder,
} from "../controllers/orderController.js";

const orderRouter = Router();

orderRouter.route("/").post(placeOrder).get(getAllOrders);
orderRouter.route("/user/:userID").get(getOrdersListByUser);

export default orderRouter;
