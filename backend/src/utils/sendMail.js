import nodemailer from "nodemailer";
import { FROM_EMAIL, FROM_EMAIL_PASS } from "../config/config.js";

const transporterConfig = {
    service: "gmail",
    auth: {
        user: FROM_EMAIL,
        pass: FROM_EMAIL_PASS,
    },
};

const mailMessage = {
    from: FROM_EMAIL,

    to: "",

    subject: "Notice About Upcoming Mail",

   
    html: `        `,
};

const sendMail = async (mailMessage) => {
    const transporter = nodemailer.createTransport(transporterConfig);
    await transporter.sendMail(mailMessage);
};

export default sendMail;
