// Delete a user
const User = require('../../models/User');

// Delete User by Id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if id Provided
    if (!id) {
      return res.status(404).json({ Status: 0, Message: "User Id is Required" })
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ Status: 0, Message: 'User not found' });

    return res.status(200).json({ Status: 1, Message: 'User deleted successfully', deletedUser });
  } catch (error) {
    return res.status(500).json({ Status: 0, Message: 'Error deleting user', error });
  }
};


module.exports = deleteUser
