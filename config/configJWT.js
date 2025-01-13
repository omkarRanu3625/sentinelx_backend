// JWT Configuration
const jwt = require('jsonwebtoken');
require('dotenv').config();
const ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET;
const maxAge = '3d';
const maxRefresh = '90d';

function generateToken(payload) {
    return jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: maxAge });
}

function generateRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: maxRefresh });
}

function verifyToken(token) {
    return jwt.verify(token, ACCESS_SECRET_KEY)
}

function verifyRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, REFRESH_SECRET_KEY)
}

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken
}