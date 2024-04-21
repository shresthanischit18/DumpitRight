import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { ROLE_ENUM } from "../../config/config.js";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full Name is required"],
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            validate: {
                validator: function (v) {
                    // Regular expression to match email addresses with an "@" and ending in ".com"
                    const emailRegex = /^[^\s@]+@[^\s@]+\./i;
                    return emailRegex.test(v);
                },
                message: "Email must contain '@' and end with '.com'",
            },
        },

        phoneNumber: {
            type: Number,
            required: [true, "Phone Number is required"],
            validate: {
                validator: function (v) {
                    // code for not throwing error while entering digit less than 10 and not starting with 98   
                    const phoneNumberRegex = /^98\d{8}$/;
                    return phoneNumberRegex.test(v.toString());
                },
                message:
                    "Phone Number must be exactly 10 digits and start with 98",
            },
        },

        wardNo: { type: Number, required: true },

        address: {
            type: String,
            required: [true, "Address is required"],
        },

        houseNo: {
            type: String,
            required: false,
        },

        role: {
            type: String,
            enum: {
                values: ROLE_ENUM,
                message: `{VALUE} is not supported for the role`,
            },
        },

        password: {
            type: String,
            required: [true, "Password is required"],
        },

        rewardPoint: {
            type: Number,
            default: 0,
        },

        verificationCode: {
            code: {
                type: String,
                default: "",
            },
            expiration: {
                type: String,
                default: "",
            },
        },
        pickupCounts: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
});

export default userSchema;
