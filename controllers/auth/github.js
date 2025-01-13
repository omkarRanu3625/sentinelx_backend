const axios = require('axios')
const jwt = require('jsonwebtoken')
const User = require('../../models/User.js')
const bcrypt = require('bcryptjs')

const github = async (req, res) => {
  console.log('Hit')
  try {
    const { code } = req.body // Frontend sends this code
    console.log('code', code)

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' })
    }

    // Step 1: Exchange the code for tokens
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: 'http://localhost:5173/dashboard', // The same redirect URI you used in frontend
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    )

    const { access_token } = tokenResponse.data

    console.log('access_token', access_token)

    if (!access_token) {
      return res
        .status(400)
        .json({ message: 'Failed to exchange code for token' })
    }

    // Step 2: Fetch user details from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    // Fetch user emails
    const emailResponse = await axios.get(
      'https://api.github.com/user/emails',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    )

    const { id, login, name, avatar_url } = userResponse.data

    const primaryEmail = emailResponse.data.find(
      (email) => email.primary === true,
    )
    const email = primaryEmail ? primaryEmail.email : null

    console.log(id, login, name, avatar_url, email)

    if (!email) {
      return res
        .status(400)
        .json({ message: 'Failed to fetch user email from GitHub' })
    }

    // Step 3: Check for existing user or create a new one
    let user = await User.findOne({ email })
    let password = null

    if (!user) {
      // Create a new user if not found
      password = Math.random().toString(36).slice(-8)
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      user = await User.create({
        username,
        email,
        name,
        profileImg,
        oauthProvider: 'github',
        oauthProviderId: id,
        phoneNumber: '1234567890',
        password: hashedPassword, // Generate a random password for new users
      })

      console.log('User Created')
    }

    // Step 4: Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '3d' },
    )

    console.log('Successfull')
    // Step 5: Respond with the JWT token and user data
    res.status(200).json({
      message: 'Authentication successful',
      token: token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        profileImg: user.profileImg,
        oauthProvider: user.oauthProvider,
        oauthProviderId: user.oauthProviderId,
        phoneNumber: user.phoneNumber, // Added to match Google structure
      },
      password: password, // Only included for new users
    })
  } catch (error) {
    console.error('GitHub OAuth error:', error.message)
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = github
