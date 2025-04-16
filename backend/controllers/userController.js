const User = require("../models/User");
const ApprovedEmail = require("../models/ApprovedEmail");

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid })
      .select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { firebaseUID: req.user.uid },
      {
        $set: {
          displayName: req.body.displayName,
          address: req.body.address,
          phone: req.body.phone
        }
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Admin route to get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin route to get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin route to update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['customer', 'admin', 'rider'].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update role in approved emails collection as well
    await ApprovedEmail.findOneAndUpdate(
      { email: user.email },
      { role }
    );
    
    // Update user role
    user.role = role;
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Admin route to deactivate/activate user
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Toggle active status
    user.isActive = !user.isActive;
    await user.save();
    
    // Update status in approved emails collection as well
    await ApprovedEmail.findOneAndUpdate(
      { email: user.email },
      { isActive: user.isActive }
    );
    
    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = exports;