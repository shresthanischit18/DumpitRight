import { Router } from "express";
import {
    changeActiveStatus,
    deleteSchedule,
    getAllSchedules,
    getPickupDetailsByID,
    getRegularSchedulesByCollectorID,
    getSchedulesByUserID,
    scheduleRegularPickUp,
    updateSchedule,
    downloadRegularPickupsInExcel,
} from "../controllers/regularPickupController.js";

const regularPickupRouter = Router();

regularPickupRouter.route("/").get(getAllSchedules).post(scheduleRegularPickUp);

regularPickupRouter
    .route("/download-excel/collector/:collectorID")
    .get(downloadRegularPickupsInExcel);

regularPickupRouter
    .route("/:scheduleID/change-active-status")
    .patch(changeActiveStatus);

regularPickupRouter.route("/user/:userID").get(getSchedulesByUserID);
regularPickupRouter
    .route("/collector/:collectorID")
    .get(getRegularSchedulesByCollectorID);

regularPickupRouter
    .route("/:scheduleID")
    .patch(updateSchedule)
    .delete(deleteSchedule)
    .get(getPickupDetailsByID);

export default regularPickupRouter;
