import { Router } from "express";
import {
    addSpecialWastePickup,
    deleteSpecialWastePickup,
    downloadSpecialPickupsInExcel,
    getAllSpecialWastePickups,
    getSpecialPickupDetailsByID,
    getSpecialWastePickupByCollectorID,
    getSpecialWastePickupByUserID,
    updatePickupDetails,
} from "../controllers/specialWastePickupController.js";

const specialPickupRouter = Router();

specialPickupRouter
    .route("/")
    .post(addSpecialWastePickup)
    .get(getAllSpecialWastePickups)
    .patch()
    .delete();

specialPickupRouter
    .route("/download-excel/collector/:collectorID")
    .get(downloadSpecialPickupsInExcel);

specialPickupRouter
    .route("/:specialWastePickupID")
    .delete(deleteSpecialWastePickup)
    .patch(updatePickupDetails)
    .get(getSpecialPickupDetailsByID);

specialPickupRouter.route("/user/:userID").get(getSpecialWastePickupByUserID);

specialPickupRouter
    .route("/collector/:collectorID")
    .get(getSpecialWastePickupByCollectorID);

export default specialPickupRouter;
