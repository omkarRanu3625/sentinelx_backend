// Login Controller
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const { generateToken, generateRefreshToken } = require('../../config/configJWT');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ Status: 0, Message: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ Status: 0, Message: 'Invalid credentials' });
    }

    // Generate JWT token
    const accessToken = generateToken({ userId: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user._id, email: user.email });

    res.cookie('token', accessToken, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days expiration in milliseconds
      secure: process.env.NODE_ENV === 'production', // Ensures cookies are only sent over HTTPS in production
      sameSite: 'strict', // Prevent CSRF attacks
    });

    return res.status(200).json({ Status: 1, Message: 'Login successful', accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ Status: 0, Message: 'Something went wrong', error });
  }
};

module.exports = login 
