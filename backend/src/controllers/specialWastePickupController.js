import mongoose from "mongoose";
import { FROM_EMAIL } from "../config/config.js";
import sendSuccessResponse from "../helpers/apiResponseHandler.js";
import asyncErrorHandler from "../helpers/asyncErrorHandler.js";
import { SpecialPickup, User } from "../schemaModels/model.js";

import { HttpStatus, WASTE_PICKUP_TIME } from "../constant/constants.js";
import { format } from "date-fns";
import sendMail from "../utils/sendMail.js";
import throwError from "../helpers/createError.js";
import ExcelJS from "exceljs";

// Add special waste pickup request
export const addSpecialWastePickup = asyncErrorHandler(async (req, res) => {
    const {
        user,
        wasteType,
        specialInstructions,
        time,
        pickupDate,
        collector: collectorID,
    } = req.body;

    if (
        !mongoose.isValidObjectId(user) ||
        !wasteType ||
        !time ||
        !pickupDate ||
        !mongoose.isValidObjectId(collectorID)
    ) {
        throwError({
            message: "All fields are required",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    const newSpecialWastePickup = new SpecialPickup({
        user,
        wasteType,
        specialInstructions,
        time,
        pickupDate,
        collector: collectorID,
    });

    await newSpecialWastePickup.save();

    sendSuccessResponse({
        res,
        message: "Special waste pickup request added successfully",
    });
});

// Get all special waste pickup requests
export const getAllSpecialWastePickups = asyncErrorHandler(async (req, res) => {
    const { status } = req.query;
    const getQuery = SpecialPickup.find()
        .populate("user")
        .populate("collector");

    if (status) {
        getQuery.where({ status });
    }

    const specialWastePickups = await getQuery;

    sendSuccessResponse({
        res,
        data: specialWastePickups,
        message: "Special waste pickup requests fetched successfully",
    });
});

// Assign collector to special waste pickup requests
export const assignCollector = asyncErrorHandler(async (req, res) => {
    const { collectorID } = req.body;
    const { specialWastePickupID } = req.params;

    if (!collectorID) {
        throwError({
            message: "Collector ID is required",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    const specialWastePickup = await SpecialPickup.findById(
        specialWastePickupID
    ).populate("user");

    specialWastePickup.collector = collectorID;

    await specialWastePickup.save();

    sendSuccessResponse({
        res,
        message: "Collector assigned successfully",
    });

    const collector = await User.findById(collectorID);

    const collectorMailMessage = {
        from: FROM_EMAIL,
        to: collector.email, // Assuming collectorInfo.email holds the collector's email address
        subject: "Assigned Special Waste Pickup Request",
        html: `
        <html>
        <body>
            <h2>Assigned Special Waste Pickup Request</h2>
            <p>Hello ${collector.fullName},</p>
            <p>You have been assigned to a special waste pickup request.</p>
            <p>Details of the pickup request:</p>
            <ul>
                <li><strong>Waste Type:</strong> ${
                    specialWastePickup.wasteType
                }</li>
                <li><strong>Day:</strong> ${format(
                    new Date(specialWastePickup.pickupDate),
                    "dd MMMM, yyyy"
                )}</li>
                <li><strong>Time:</strong> ${specialWastePickup.time} (${
            WASTE_PICKUP_TIME[specialWastePickup.time]
        })</li>
                <li><strong>User Information:</strong>
                    <ul>
                        <li><strong>Full Name:</strong> ${
                            specialWastePickup.user.fullName
                        }</li>
                        <li><strong>Email:</strong> ${
                            specialWastePickup.user.email
                        }</li>
                        <li><strong>Phone Number:</strong> ${
                            specialWastePickup.user.phoneNumber
                        }</li>
                        <li><strong>Ward Number:</strong> ${
                            specialWastePickup.user.wardNo
                        }</li>
                        <li><strong>Address:</strong> ${
                            specialWastePickup.user.address
                        }</li>
                        <li><strong>House No:</strong> ${
                            specialWastePickup.user?.houseNo
                        }</li>
                    </ul>
                </li>
            </ul>
            <p>Please proceed with the pickup request as soon as possible.</p>
            <p>Thank you for your cooperation.</p>
            <p>Best regards,<br>The Dump It Right Team</p>
        </body>
        </html>
    `,
    };

    sendMail(collectorMailMessage);
});

// Update the pick-up status
export const updatePickupDetails = asyncErrorHandler(async (req, res) => {
    const { specialWastePickupID } = req.params;
    const updatedInfo = req.body;

    if (!updatedInfo) {
        throwError({
            message: "Pick up details are required",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    const specialWastePickup = await SpecialPickup.findById(
        specialWastePickupID
    );

    Object.assign(specialWastePickup, updatedInfo);

    await specialWastePickup.save();

    sendSuccessResponse({
        res,
        message: "Pickup status updated successfully",
    });
});

export const getSpecialPickupDetailsByID = asyncErrorHandler(
    async (req, res) => {
        const { specialWastePickupID } = req.params;

        const specialWastePickup = await SpecialPickup.findById(
            specialWastePickupID
        );

        sendSuccessResponse({
            res,
            data: specialWastePickup,
            message: "Special waste pickup details fetched successfully",
        });
    }
);

// Delete special waste pickup request
export const deleteSpecialWastePickup = asyncErrorHandler(async (req, res) => {
    const { specialWastePickupID } = req.params;

    await SpecialPickup.findByIdAndDelete(specialWastePickupID);

    sendSuccessResponse({
        res,
        message: "Special waste pickup request deleted successfully",
    });
});

// get special waste pickup request by collector id
export const getSpecialWastePickupByCollectorID = asyncErrorHandler(
    async (req, res) => {
        const { status } = req.query;
        const { collectorID } = req.params;

        const _status = status == "All" ? "" : status;

        const getQuery = SpecialPickup.find({
            collector: collectorID,
        }).populate("user");

        if (_status) {
            getQuery.where({
                status: {
                    $regex: _status,
                    $options: "i",
                },
            });
        }

        const specialWastePickups = await getQuery;

        sendSuccessResponse({
            res,
            data: specialWastePickups,
            message: "Special waste pickup requests fetched successfully",
        });
    }
);

// get special waste pickup request by user id
export const getSpecialWastePickupByUserID = asyncErrorHandler(
    async (req, res) => {
        const { status } = req.query;
        const { userID } = req.params;

        const getQuery = SpecialPickup.find({
            user: userID,
        }).populate("collector");

        const _status = status === "All" ? "" : status;

        if (_status) {
            getQuery.where({
                status: {
                    $regex: _status,
                    $options: "i",
                },
            });
        }

        const specialWastePickups = await getQuery;

        sendSuccessResponse({
            res,
            data: specialWastePickups,
            message: "Special waste pickup requests fetched successfully",
        });
    }
);

// get urgent pickup schedules in excel file
export const downloadSpecialPickupsInExcel = asyncErrorHandler(
    async (req, res) => {
        const { collectorID } = req.params;
        const { status } = req.query;

        if (!status || !mongoose.isValidObjectId(collectorID)) {
            throwError({
                message: "Day or invalid collector id is required",
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }

        const _status = status == "All" ? "" : status;

        const schedules = await SpecialPickup.find({
            collector: collectorID,
            status: { $regex: _status, $options: "i" },
        }).populate("user");

        if (!schedules.length) {
            throwError({
                message: "No schedules found",
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Waste Collection Schedule");

        worksheet.columns = [
            { header: "Waste Type", key: "wasteType", width: 15 },
            { header: "Time", key: "time", width: 20 },
            { header: "Pickup Date", key: "pickupDate", width: 20 },
            { header: "User", key: "user", width: 20 },
            { header: "Contact", key: "contact", width: 20 },
            { header: "Address", key: "address", width: 25 },
            { header: "Ward No", key: "wardNo", width: 10 },
            { header: "House No", key: "houseNo", width: 10 },
            { header: "Status", key: "status", width: 10 },
            {
                header: "Special Instructions",
                key: "specialInstructions",
                width: 25,
            },
        ];

        // Add styling to the header row
        const headerRow = worksheet.getRow(1);
        headerRow.font = {
            name: "Calibri",
            family: 4,
            size: 12,
            bold: true,
            color: { argb: "FFFFFFFF" },
        };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF1F4E78" },
            bgColor: { argb: "FF1F4E78" },
        };
        headerRow.alignment = {
            vertical: "middle",
            horizontal: "center",
        };
        headerRow.border = {
            top: { style: "thin", color: { argb: "FFFFFFFF" } },
            left: { style: "thin", color: { argb: "FFFFFFFF" } },
            bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
            right: { style: "thin", color: { argb: "FFFFFFFF" } },
        };

        schedules.forEach((schedule) => {
            const row = worksheet.addRow({
                wasteType: schedule.wasteType,
                time: WASTE_PICKUP_TIME[schedule.time],
                pickupDate: schedule.pickupDate,
                user: schedule.user.fullName,
                contact: schedule.user.phoneNumber,
                address: schedule.user.address,
                wardNo: schedule.user.wardNo,
                houseNo: schedule?.user?.houseNo,
                status: schedule.status,
                specialInstructions: schedule.specialInstructions,
            });

            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                cell.alignment = {
                    vertical: "middle",
                    horizontal: "center",
                };
            });
        });

        // Write to buffer
        const buffer = await workbook.xlsx.writeBuffer();

        const fileName = `${status}_Urgent_Waste_Collection_List.xlsx`;

        // Set MIME type to Excel and send response
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`
        );

        res.send(buffer);
    }
);
