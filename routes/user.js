const express = require('express');
const userRouter = express.Router();
const verifyToken = require('../middleware/auth/verifyToken');
const checkObjectID = require('../middleware/main/checkObjectID')

// protected and needs checking id 
userRouter.use(verifyToken)
userRouter.use(checkObjectID)

userRouter.get('/:id', require('../controllers/user/getUserById')); // Get User by Id
userRouter.delete('/:id', require('../controllers/user/deleteUser')); // Delete User
userRouter.patch('/:id', require('../controllers/user/updateUser')) // Update User's Profile

module.exports = userRouter;