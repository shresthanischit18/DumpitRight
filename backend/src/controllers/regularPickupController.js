import ExcelJS from "exceljs";
import mongoose from "mongoose";
import { FROM_EMAIL } from "../config/config.js";
import { HttpStatus, WASTE_PICKUP_TIME } from "../constant/constants.js";
import sendSuccessResponse from "../helpers/apiResponseHandler.js";
import asyncErrorHandler from "../helpers/asyncErrorHandler.js";
import throwError from "../helpers/createError.js";
import { RegularPickupSchedule, User } from "../schemaModels/model.js";
import sendMail from "../utils/sendMail.js";

export const scheduleRegularPickUp = asyncErrorHandler(async (req, res) => {
    const scheduleInfo = req.body;
    const {
        user,
        wasteType,
        frequency,
        day,
        time,
        collector: collectorID,
    } = scheduleInfo;

    if (!scheduleInfo) {
        throwError({
            message: "Schedule data is required",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    if (
        !mongoose.isValidObjectId(user) ||
        !mongoose.isValidObjectId(collectorID) ||
        !wasteType ||
        !frequency ||
        !day ||
        !time
    ) {
        throwError({
            message: "All data are required",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    const [_user, collector, existingSchedule] = await Promise.all([
        User.findById(user),
        User.findById(collectorID),
        RegularPickupSchedule.findOne({
            user,
            wasteType,
        }),
    ]);

    if (!_user || !collector) {
        throwError({
            message: "User or collector not found",

            statusCode: HttpStatus.NOT_FOUND,
        });
    }

    if (existingSchedule) {
        throwError({
            message: "Schedule already exists",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    collector.pickupCounts += 1;

    const newSchedule = new RegularPickupSchedule({ ...scheduleInfo });

    await newSchedule.save();

    sendSuccessResponse({
        res,
        message: "Regular pickup scheduled successfully",
    });

    const mailMessage = {
        from: FROM_EMAIL,
        to: _user.email,
        subject: "Notice about new pickup schedule",
        html: `
        <html>
        <body>
            <h2>New Pickup Schedule Notification</h2>
            <p>Hello ${_user.fullName},</p>
            <p>We are pleased to inform you that a new pickup schedule has been set up for you:</p>
            <ul>
                <li><strong>Waste Type:</strong> ${wasteType}</li>
                <li><strong>Frequency:</strong> ${frequency}</li>
                <li><strong>Day:</strong> ${day}</li>
                <li><strong>Time:</strong> ${time}</li>
            </ul>
            <hr />
            <h4> Collector Information </h4>

             <ul>
                <li><strong>Name:</strong> ${collector.fullName}</li>
                <li><strong>Email:</strong> ${collector.email}</li>
                <li><strong>Phone Number:</strong> ${collector.phoneNumber}</li>
            </ul>

            <p>This schedule will be effective immediately. Please ensure your waste is prepared accordingly.</p>
            <p>Thank you for your cooperation.</p>
            <p>Best regards,<br>The Dump it Right Team</p>
        </body>
        </html>
    `,
    };

    sendMail(mailMessage);
});

// Read operation (Get all schedules)
export const getAllSchedules = asyncErrorHandler(async (req, res) => {
    const schedules = await RegularPickupSchedule.find();
    sendSuccessResponse({
        res,
        data: schedules,
        message: "All schedules are fetched",
    });
});

// Read operation (Get schedules by user ID)
export const getSchedulesByUserID = asyncErrorHandler(async (req, res) => {
    const { userID } = req.params;

    if (!mongoose.isValidObjectId(userID)) {
        throwError({
            message: "Invalid user ID",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    const schedules = await RegularPickupSchedule.find({
        user: userID,
    }).populate("collector");

    sendSuccessResponse({
        res,
        data: schedules,
        message: "Schedules fetched for the user",
    });
});

// Update operation
export const updateSchedule = asyncErrorHandler(async (req, res) => {
    const { scheduleID } = req.params;
    const { frequency, day, time, specialInstructions, collector } = req.body;

    if (!frequency || !day || !time) {
        throwError({
            message: "All data are required",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    const regularSchedule = await RegularPickupSchedule.findById(scheduleID);

    if (!regularSchedule) {
        throwError({
            message: "Schedule not found",
            statusCode: HttpStatus.NOT_FOUND,
        });
    }

    Object.assign(regularSchedule, {
        frequency,
        day,
        time,
        specialInstructions,
        collector,
    });

    await regularSchedule.save();

    sendSuccessResponse({
        res,
        message: "Schedule updated successfully",
    });

    const [_user, _collector] = await Promise.all([
        User.findById(regularSchedule.user),
        User.findById(regularSchedule.collector),
    ]);

    const mailMessage = {
        from: FROM_EMAIL,
        to: _user.email,
        subject: "Notice about new pickup schedule",
        html: `
        <html>
        <body>
            <h2>New Pickup Schedule Notification</h2>
            <p>Hello ${_user.fullName},</p>
            <p>We are pleased to inform you that a new pickup schedule has been set up for you:</p>
            <ul>
                <li><strong>Waste Type:</strong> ${regularSchedule.wasteType}</li>
                <li><strong>Frequency:</strong> ${regularSchedule.frequency}</li>
                <li><strong>Day:</strong> ${regularSchedule.day}</li>
                <li><strong>Time:</strong> ${regularSchedule.time}</li>
            </ul>
            <hr />
            <h4> Collector Information </h4>

             <ul>
                <li><strong>Name:</strong> ${_collector.fullName}</li>
                <li><strong>Email:</strong> ${_collector.email}</li>
                <li><strong>Phone Number:</strong> ${_collector.phoneNumber}</li>
            </ul>

            <p>This schedule will be effective immediately. Please ensure your waste is prepared accordingly.</p>
            <p>Thank you for your cooperation.</p>
            <p>Best regards,<br>The Dump it Right Team</p>
        </body>
        </html>
    `,
    };

    sendMail(mailMessage);
});

// Delete operation
export const deleteSchedule = asyncErrorHandler(async (req, res) => {
    const { scheduleID } = req.params;
    const deletedSchedule = await RegularPickupSchedule.findByIdAndDelete(
        scheduleID
    );

    if (!deletedSchedule) {
        throwError({
            message: "Schedule not found",
            statusCode: HttpStatus.NOT_FOUND,
        });
    }

    sendSuccessResponse({ res, message: "Schedule deleted successfully" });
});

// Change active status
export const changeActiveStatus = asyncErrorHandler(async (req, res) => {
    const { scheduleID } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined || isActive === null) {
        throwError({
            message: "isActive is required",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    const updatedSchedule = await RegularPickupSchedule.findByIdAndUpdate(
        scheduleID,
        { isActive }
    );

    if (!updatedSchedule) {
        throwError({
            message: "Schedule not found",
            statusCode: HttpStatus.NOT_FOUND,
        });
    }

    sendSuccessResponse({
        res,
        message: "Active status changed successfully",
    });
});

// get pickup details by id
export const getPickupDetailsByID = asyncErrorHandler(async (req, res) => {
    const { scheduleID } = req.params;

    const schedule = await RegularPickupSchedule.findById(scheduleID);

    if (!schedule) {
        throwError({
            message: "Schedule not found",
            statusCode: HttpStatus.NOT_FOUND,
        });
    }

    sendSuccessResponse({
        res,
        data: schedule,
        message: "Schedule fetched successfully",
    });
});

// get regular pickup schedules by collector id
export const getRegularSchedulesByCollectorID = asyncErrorHandler(
    async (req, res) => {
        const { collectorID } = req.params;
        const { day } = req.query;

        if (!day) {
            throwError({
                message: "Day is required",
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }

        if (!mongoose.isValidObjectId(collectorID)) {
            throwError({
                message: "Invalid collector ID",
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }

        const schedules = await RegularPickupSchedule.find({
            collector: collectorID,
            day,
        }).populate("user");

        sendSuccessResponse({
            res,
            data: schedules,
            message: "Schedules fetched for the collector",
        });
    }
);

export const downloadRegularPickupsInExcel = asyncErrorHandler(
    async (req, res) => {
        const { collectorID } = req.params;
        const { day } = req.query;

        if (!day || !mongoose.isValidObjectId(collectorID)) {
            throwError({
                message: "Day or invalid collector id is required",
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }

        const schedules = await RegularPickupSchedule.find({
            collector: collectorID,
            day,
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
            { header: "Frequency", key: "frequency", width: 15 },
            { header: "Day", key: "day", width: 10 },
            { header: "Time", key: "time", width: 20 },
            { header: "User", key: "user", width: 20 },
            { header: "Contact", key: "contact", width: 20 },
            { header: "Address", key: "address", width: 25 },
            { header: "Ward No", key: "wardNo", width: 10 },
            { header: "House No", key: "houseNo", width: 10 },
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
                frequency: schedule.frequency,
                day: schedule.day,
                time: WASTE_PICKUP_TIME[schedule.time],
                user: schedule.user.fullName,
                contact: schedule.user.phoneNumber,
                address: schedule.user.address,
                wardNo: schedule.user.wardNo,
                houseNo: schedule?.user?.houseNo,
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

        const fileName = `${day}_WasteCollectionSchedule.xlsx`;

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
