const axios = require('axios')
const jwt = require('jsonwebtoken')
const User = require('../../models/User.js')
const bcrypt = require('bcryptjs')

const google = async (req, res) => {
  console.log('Hit')
  try {
    const { code } = req.body // Ensure the frontend sends the code in the request body
    console.log(code)

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' })
    }

    // Step 1: Exchange the code for tokens
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:5173', // Ensure this matches your frontend
        grant_type: 'authorization_code',
      },
    )

    const { access_token, id_token } = tokenResponse.data

    if (!access_token || !id_token) {
      return res
        .status(400)
        .json({ message: 'Failed to exchange code for tokens' })
    }

    // Step 2: Fetch user details from Google
    const userResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    )

    const { sub: googleId, email, name, picture } = userResponse.data

    if (!email) {
      return res.status(400).json({ message: 'Failed to fetch user email' })
    }

    // Step 3: Check for existing user or create a new one
    let user = await User.findOne({ email })

    let password = null

    if (!user) {
      password = Math.random().toString(36).slice(-8)
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      user = await User.create({
        username: name,
        email,
        name,
        profileImg: picture || '',
        oauthProvider: 'google',
        oauthProviderId: googleId,
        phoneNumber: '1234567890', // Placeholder value
        password: hashedPassword,
      })
    }

    // Step 4: Generate a JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '3d' }, // Token expiry
    )

    // Step 5: Respond with the JWT and user info
    res.status(200).json({
      message: 'Authentication successful',
      token: token,
      user: user,
      password: password,
    })
  } catch (error) {
    console.error('Google OAuth Error:', error.message)
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = google
