// Update a user
const User = require('../../models/User');


const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if ID is provided
        if (!id) {
            return res.status(404).json({ Status: 0, Message: "User Id is Required" });
        }

        const updates = { ...req.body };
        delete updates.password; // Ensure password is not updated

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updates, // Dynamically update fields based on req.body
            { new: true, runValidators: true } // Return the updated user and run validators
        ).select('-password'); // Exclude password from the response

        if (!updatedUser) {
            return res.status(404).json({ Status: 0, Message: 'User not found' });
        }

        return res.status(200).json({ Status: 1, Message: "User Profile Updated Successfully", Data: updatedUser });
    } catch (error) {
        return res.status(500).json({ Status: 0, Message: 'Error updating user', error });
    }
};


module.exports = updateUserProfile
