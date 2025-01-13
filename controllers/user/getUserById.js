// Get a user by Id
const User = require('../../models/User');

// Get user details by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params

    // Check if ID is provided
    if (!id) {
      return res.status(404).json({ Status: 0, Message: "User Id is Requires" })
    };

    const user = await User.findById(id).select('-password'); // Exclude password
    if (!user) return res.status(404).json({ Status: 0, Message: 'User not found' });

    return res.status(200).json({ Status: 1, Message: "User Found", Data: user });
  } catch (error) {
    return res.status(500).json({ Status: 0, Message: 'Error fetching user', error });
  }
};

module.exports = getUserById

