// Change password 

const User = require('../../models/User')
const bcrypt = require('bcrypt');

// Temporary storage for OTP (This can be replaced with Redis or DB for production)
const otpStorage = require('../../utils/auth/otpStorage');  //Import otpStorage

// Change Password - Verify OTP and Update Password
const changePassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    // Check if all the information came in the request body
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ Status: 0, Message: 'Missing required fields' });
    }

    try {
        // Validate OTP
        const storedOTP = otpStorage[email];
        if (!storedOTP || storedOTP.otp !== otp) {
            return res.status(400).json({ Status: 0, Message: 'Invalid or expired OTP' });
        }

        // Check OTP expiration
        if (Date.now() > storedOTP.expiresIn) {
            delete otpStorage[email]; // Clean up expired OTP
            return res.status(400).json({ Status: 0, Message: 'OTP expired' });
        }

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ Status: 0, Message: 'User not found' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        // Clear the OTP after successful password reset
        delete otpStorage[email];

        return res.status(200).json({ Status: 1, Message: 'Password updated successfully' });
    } catch (error) {
        return res.status(500).json({ Status: 0, Message: 'Error updating password', error });
    }
};


module.exports = changePassword
