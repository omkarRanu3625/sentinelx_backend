const nodemailer = require('nodemailer');
require('dotenv').config(); 

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Can be changed to other services like Outlook, etc.
    auth: {
        user: process.env.SMTP_EMAIL, 
        pass: process.env.SMTP_PASSWORD, 
    }
});

// Function to send OTP to email
async function sendOTP(email, otp) {
    const mailOptions = {
        from: process.env.SMTP_EMAIL, 
        to: email,                    
        subject: 'Your OTP for Account Verification',
        text: `Your OTP for email verification is ${otp}. It will expire in 10 minutes.`,
        html: `<p>Your OTP for email verification is <strong>${otp}</strong>. It will expire in 10 minutes.</p>` // For HTML email format
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
}

module.exports = { sendOTP };
