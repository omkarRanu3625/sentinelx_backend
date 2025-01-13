// User Schema
const mongoose = require('mongoose')

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    profileImg: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    preferences: {
      type: Array,
      default: [],
    },
    oauthProvider: {
      type: String, // e.g., 'google', 'github'
      enum: ['google', 'github'],
    },
    oauthProviderId: {
      type: String,
      // unique: true, // Unique ID from the OAuth provider (e.g., Google ID)
      default: null,
      unique: false,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('User', User)