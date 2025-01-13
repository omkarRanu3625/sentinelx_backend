const User = require('../../models/User.js')
const JWT = require('../../config/configJWT.js')

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Authentication token is required.' })
    }

    const token = authHeader.split(' ')[1]

    const decodedToken = JWT.verifyToken(token) // Decode the token

    const user = await User.findOne({ _id: decodedToken.userId }) // Find the user

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const { _id, password, ...userWithoutPassword } = user.toObject() // Select the user object without the password
    req.user = {
      userId: _id,
      ...userWithoutPassword,
    }

    next()
  } catch (error) {
    console.error('Authentication Error:', error)
    return res
      .status(403)
      .json({ message: 'Invalid or expired token.', error: error.message })
  }
}

module.exports = verifyToken
