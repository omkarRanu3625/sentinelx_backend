// Login Controller
const { verifyRefreshToken, generateToken, generateRefreshToken } = require('../../config/configJWT');

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ Message: 'Refresh Token Required' });
        const user = verifyRefreshToken(refreshToken)
        const accessToken = generateToken({ userId: user.userId, email: user.email });
        const newRefreshToken = generateRefreshToken({ userId: user.userId, email: user.email });

        res.cookie('token', accessToken, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days expiration in milliseconds
            secure: process.env.NODE_ENV === 'production', // Ensures cookies are only sent over HTTPS in production
            sameSite: 'strict', // Prevent CSRF attacks
        });

        return res.status(200).json({ Status: 1, Message: 'Refresh Token Successful', accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        return res.status(500).json({ Status: 0, Message: 'Something went wrong', error });
    }
};

module.exports = refreshToken