const User = require('../../models/User')
const { generateToken, generateRefreshToken } = require('../../config/configJWT');

// Temporary storage for OTP (This can be replaced with Redis or DB for production)
const otpStorage = require('./otpStorage');  // Import otpStorage

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const storedOtpData = otpStorage[email];

    // Check if OTP exists and has not expired
    if (!storedOtpData || storedOtpData.expiresIn < Date.now()) {
      return res.status(400).json({ Status: 0, Message: 'OTP has expired or invalid' });
    }

    // Check if OTP is correct
    if (parseInt(otp) !== storedOtpData.otp) {
      return res.status(400).json({ Status: 0, Message: 'Invalid OTP' });
    }

    // Update user to verified
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ Status: 0, Message: 'User not found' });
    }

    // Generate JWT token after successful OTP verification
    const accessToken = generateToken({ userId: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user._id, email: user.email });

    res.cookie('token', accessToken, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days expiration in milliseconds
      secure: process.env.NODE_ENV === 'production', // Ensures cookies are only sent over HTTPS in production
      sameSite: 'strict', // Prevent CSRF attacks
    });

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ Status: 1, Message: 'User verified successfully', accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ Status: 0, Message: 'Something went wrong', error });
  }
};

module.exports = verifyOtp 
