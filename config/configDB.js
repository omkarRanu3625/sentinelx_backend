const mongoose = require('mongoose')
require('dotenv').config()

// DB Connection
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${connection.connection.host}`)
  } catch (error) {
    console.log(error)
  }
}

const disconnectDB = async () => {
  try {
    const connection = await mongoose.disconnect()
    console.log(`MongoDB Disconnected`)
  } catch (error) {
    console.log(error)
  }
}

const dropDatabase = async () => {
  await mongoose.connection.db.dropDatabase();
}

module.exports = {
  connectDB,
  disconnectDB,
  dropDatabase
}
