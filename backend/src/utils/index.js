import { RegularPickupSchedule, SpecialPickup } from "../schemaModels/model.js";

export { default as sendMail } from "./sendMail.js";
export { default as generateAuthToken } from "./generateToken.js";
export { default as generateStrongPassword } from "./passwordGenerator.js";

export const getWasteTypeForDay = (day) => {
    const WASTE_PICKUP_DAYS = {
        Organic: ["Saturday", "Sunday", "Monday"],
        Recyclable: ["Tuesday", "Wednesday"],
        Hazardous: ["Thursday", "Friday"],
    };
    for (const [wasteType, days] of Object.entries(WASTE_PICKUP_DAYS)) {
        if (days.includes(day)) {
            return wasteType;
        }
    }
    return null; // Return null if no waste type is found for the given day
};

export const deleteScheduleIfCollectorDoesNotExist = async () => {

    console.log("Delete schedule if collector does not exist");
    
    const [regularPickups, specialPickups] = await Promise.all([
        RegularPickupSchedule.find().populate("collector"),
        SpecialPickup.find().populate("collector"),
    ]);

    const regularPickupIDs = regularPickups
        .filter((pickup) => !pickup.collector)
        .map((pickup) => RegularPickupSchedule.findByIdAndDelete(pickup._id));

    const specialPickupsIDs = specialPickups
        .filter((pickup) => !pickup.collector)
        .map((pickup) => SpecialPickup.findByIdAndDelete(pickup._id));

    Promise.all([...regularPickupIDs, ...specialPickupsIDs]);
};
