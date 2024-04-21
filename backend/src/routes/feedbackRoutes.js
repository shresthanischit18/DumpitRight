import { Router } from "express";
import {
    getAllFeedback,
    getFeedbackByCollectorID,
    getFeedbacksByUserID,
    updateFeedbackDetails,
} from "../controllers/feedbackController.js";

const feedbackRouter = Router();

feedbackRouter.route("/").get(getAllFeedback);

feedbackRouter
    .route("/user/:userID")
    .get(getFeedbacksByUserID)
    .post()
    .put()
    .delete();

feedbackRouter
    .route("/collector/:collectorID")
    .get(getFeedbackByCollectorID)
    .post()
    .put()
    .delete();

feedbackRouter.route("/:feedbackID").patch(updateFeedbackDetails);

export default feedbackRouter;
