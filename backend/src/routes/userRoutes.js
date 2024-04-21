import express from "express";
import {
    addUser,
    deleteUser,
    getAllUsers,
    getAvailableCollector,
    getUserByID,
    updateUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/").post(addUser).get(getAllUsers).patch().delete();

userRouter
    .route("/:userID")
    .post()
    .get(getUserByID)
    .patch(updateUser)
    .delete(deleteUser);

userRouter.route("/collectors/ward/:wardNo").get(getAvailableCollector);

export default userRouter;
