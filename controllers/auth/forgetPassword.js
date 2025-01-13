// Forget Password

const crypto = require('crypto'); // For generating OTP
const User = require('../../models/User');
const { sendOTP } = require('../../config/configSMTP');

// Temporary storage for OTP (This can be replaced with Redis or DB for production)
const otpStorage = require('../../utils/auth/otpStorage');  //Import otpStorage

// Forget Password - Send OTP to Email
const forgetPassword = async (req, res) => {
    const { email } = req.body;

    // Vaildate request body
    if (!email) {
        return res.status(404).json({ Status: 0, Message: 'Email not found' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ Status: 0, Message: 'User not found' });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP

        // Store OTP temporarily (e.g., in memory, Redis, etc.)
        otpStorage[email] = { otp, expiresIn: Date.now() + 10 * 60 * 1000 }; // OTP valid for 10 mins

        // Send OTP to user's email (implement sendOTP function)
        await sendOTP(email, otp);

        return res.status(200).json({ Status: 1, Message: 'OTP sent to email for password reset, Please check your email' });
    } catch (error) {
        return res.status(500).json({ Status: 0, Message: 'Error sending OTP', error });
    }
};

module.exports = forgetPassword