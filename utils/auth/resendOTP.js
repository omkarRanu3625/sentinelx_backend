const User = require('../../models/User')
const { sendOTP } = require('../../config/configSMTP');

// Temporary storage for OTP (This can be replaced with Redis or DB for production)
const otpStorage = require('./otpStorage');  // Import otpStorage

// Function to handle OTP resending
const resendOTP = async (req, res) => {
    const { email } = req.body;
    try {
        // Find the user by their ID (you can also find by email if you prefer)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ Status: 0, Message: 'User Not Found' });
        }

        // Generate a new OTP
        const otp = crypto.randomInt(100000, 999999);

        // Store the new OTP in the user's record (you should have an OTP field and OTP expiry logic)
        otpStorage[email] = { otp, expiresIn: Date.now() + 10 * 60 * 1000 };

        // Send the OTP to the user's email
        await sendOTP(email, otp);

        return res.status(200).json({
            Status: 1,
            Message: 'OTP resent successfully'
        });

    } catch (error) {
        return res.status(500).json({ Status: 0, Message: 'Something went wrong', error });
    }
}

module.exports = resendOTP 