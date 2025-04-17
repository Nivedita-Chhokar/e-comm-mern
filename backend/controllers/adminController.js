const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');
const Order = require('../models/Order');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['customer', 'admin', 'rider'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update role in approved emails collection as well
    await ApprovedEmail.findOneAndUpdate({ email: user.email }, { role });

    // Update user role
    user.role = role;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Toggle user status (activate/deactivate)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
      user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all riders (for admin to assign to orders)
exports.getAllRiders = async (req, res) => {
  try {
    const riders = await User.find({
      role: 'rider',
      isActive: true,
    }).select('_id displayName email photoURL');

    res.json(riders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create an approved email (so a new user can register)
exports.createApprovedEmail = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: 'Email and role are required' });
    }

    if (!['customer', 'admin', 'rider'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if email already exists
    const existingEmail = await ApprovedEmail.findOne({ email });

    if (existingEmail) {
      return res
        .status(400)
        .json({ message: 'Email already exists in approved list' });
    }

    const newApprovedEmail = new ApprovedEmail({
      email,
      role,
      isActive: true,
    });

    await newApprovedEmail.save();

    res.status(201).json({
      message: 'Email approved successfully',
      approvedEmail: newApprovedEmail,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all approved emails
exports.getApprovedEmails = async (req, res) => {
  try {
    const approvedEmails = await ApprovedEmail.find();
    res.json(approvedEmails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an approved email
exports.deleteApprovedEmail = async (req, res) => {
  try {
    const deletedEmail = await ApprovedEmail.findByIdAndDelete(req.params.id);

    if (!deletedEmail) {
      return res.status(404).json({ message: 'Approved email not found' });
    }

    res.json({
      message: 'Approved email deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Count total orders
    const totalOrders = await Order.countDocuments();

    // Count orders by status
    const pendingOrders = await Order.countDocuments({
      orderStatus: 'Pending',
    });
    const processingOrders = await Order.countDocuments({
      orderStatus: 'Processing',
    });
    const shippedOrders = await Order.countDocuments({
      orderStatus: 'Shipped',
    });
    const deliveredOrders = await Order.countDocuments({
      orderStatus: 'Delivered',
    });
    const undeliveredOrders = await Order.countDocuments({
      orderStatus: 'Undelivered',
    });
    const cancelledOrders = await Order.countDocuments({
      orderStatus: 'Cancelled',
    });

    // Count users by role
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalRiders = await User.countDocuments({ role: 'rider' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('items.productId');

    res.json({
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        undelivered: undeliveredOrders,
        cancelled: cancelledOrders,
      },
      users: {
        customers: totalCustomers,
        riders: totalRiders,
        admins: totalAdmins,
        total: totalCustomers + totalRiders + totalAdmins,
      },
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
