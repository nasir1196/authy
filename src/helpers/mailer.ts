import nodemailer from "nodemailer"
import User from "@/models/user";
import bcrypt from "bcrypt";
import {eat} from "sucrase/dist/types/parser/tokenizer";


export const sendEmail = async ({email, emailType, userId}: any) => {
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10,)

        //create transporter
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            })
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000
            })
        }
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {user: "66569ad841ac4d", pass: "1c759b48644d31"}
        })

        const mailOptions = {
            from: 'nasiruddin.cf@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p> Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a></a> 
            to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
             or copy and paste the link below in your browser. <br/>
            ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`

        }

        const mailresponse = await transporter.sendMail(mailOptions);

        return  mailresponse;
    } catch
        (error: any) {
        throw new Error(error.message)
    }
}