const path = require('path')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet');
const rateLimit = require('express-rate-limit')

const { connectDB } = require('./config/configDB')
const logger = require('./utils/main/logger')
const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/user')

const app = express()
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 350, // Limit each IP to 350 requests
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: { message: "Too Many Requests, Try Again in 10 minutes" }
})

// Security Middlwares
app.use(helmet())
app.use(cors())
app.use(limiter)

// Request Body Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Logging Middleware
app.use(logger); // Logging Requests To Access Log

// Images Middleware
app.use(express.static(path.resolve('./public')));

const PORT = process.env.PORT || 5001

connectDB()

//All API Routes
app.get('/',(req,res) =>{
  res.status(200).json({Messgae:"hi hello"})
})
app.use('/api/auth',authRoutes )
app.use('/api/users',usersRoutes)
app.all('*', (req, res) => {
  res.status(404).json({ message: `${req.originalUrl} is not found on this server` })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
