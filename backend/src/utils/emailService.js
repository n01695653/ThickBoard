import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create transporter with YOUR Gmail credentials
// This sends FROM your email TO any user's email
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_EMAIL,      // Your email from .env
        pass: process.env.GOOGLE_PASSWORD,   // Your app password from .env
    },
});

/**
 * Send OTP email to ANY user's email address
 */
export const sendOTPEmail = async (userEmail, otp) => {
    try {
        console.log(` Sending OTP to: ${userEmail}`);
        
        const mailOptions = {
            from: `"ThinkBoard" <${process.env.GOOGLE_EMAIL}>`,  // Send FROM your email
            to: userEmail,                                        // Send TO user's email
            subject: "Your ThinkBoard Login OTP",
            text: `Your OTP is: ${otp}. This OTP is valid for 5 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #00FF9D;">ThinkBoard Login</h2>
                    <p>Your One-Time Password (OTP) is:</p>
                    <div style="background-color: #f0f0f0; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px;">
                        <h1 style="color: #333; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
                    </div>
                    <p><strong>This OTP expires in 5 minutes</strong></p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(` OTP ${otp} sent to ${userEmail}`);
        console.log(`Email sent! Message ID: ${info.messageId}`);
        
        return true;
        
    } catch (error) {
        console.error('Failed to send email:', error.message);
        console.log(`For testing, OTP is: ${otp}`);
        return false;
    }
};