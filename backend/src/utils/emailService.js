import nodemailer from 'nodemailer';



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASSWORD,
    },
});

/**
 * Send OTP email to user (Email-OTP MFA )
 */
export const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.GOOGLE_EMAIL,
            to: email,
            subject: "Your OTP for Notes App",
            text: `Your OTP is: ${otp}. This OTP is valid for 5 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Notes App - OTP Verification</h2>
                    <p>Your One-Time Password (OTP) is:</p>
                    <h1 style="background: #f4f4f4; padding: 15px; border-radius: 5px; display: inline-block;">
                        ${otp}
                    </h1>
                    <p>This OTP is valid for 5 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">
                        This is an automated message, please do not reply.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};