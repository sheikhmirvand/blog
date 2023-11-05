import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MY_EMAIL,
        pass: "avoz toff cqoo ofkh",
    },
});
