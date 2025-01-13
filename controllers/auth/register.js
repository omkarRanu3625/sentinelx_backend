const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const { sendOTP } = require('../../config/configSMTP');
const crypto = require('crypto');

// Temporary storage for OTP (This can be replaced with Redis or DB for production)
const otpStorage = require('../../utils/auth/otpStorage');  //Import otpStorage

const register = async (req, res) => {
  const { name, username, email, password, phoneNumber } = req.body;

  // Regular expression to enforce password requirements
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  try {
    // Validate password format
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        Status: 0,
        Message: 'Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ Status: 0, Message: 'User already exists' });
    }

    // Hash the password before saving it to DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user in DB
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      isVerified: false, // Initially not verified
    });

    // Save the user
    await newUser.save();

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999); // Generate 6-digit OTP

    // Send OTP to user's email
    await sendOTP(email, otp);

    // Store the OTP temporarily (e.g., in memory, database, or Redis)
    otpStorage[email] = { otp, expiresIn: Date.now() + 10 * 60 * 1000 }; // OTP expires in 10 mins

    return res.status(201).json({
      Status: 1,
      Message: 'User registered successfully. Please check your email for OTP verification',
    });
  } catch (error) {
    return res.status(500).json({ Status: 0, Message: 'Something went wrong', error });
  }
};



module.exports = register 
