const express = require('express')
const router = express.Router()

// Routes
router.use('/api/auth', require('../routes/auth'))
router.use('/api/users', require('../routes/user'))

module.exports = router