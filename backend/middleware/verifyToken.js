const admin = require('../config/firebase');
const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    // Check if email is approved
    const approvedEmail = await ApprovedEmail.findOne({
      email: decoded.email,
      isActive: true,
    });

    if (!approvedEmail) {
      return res.status(403).json({
        message: 'Email not approved for access',
      });
    }

    // Find user
    const user = await User.findOne({ firebaseUID: decoded.uid });

    if (!user) {
      return res.status(404).json({
        message: 'User not found in system',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        message: 'User account is inactive',
      });
    }

    // Add user data to request
    req.user = {
      ...decoded,
      role: user.role,
      _id: user._id,
    };

    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};

// module.exports = verifyToken;
module.exports = (req, res, next) => {
  // For testing only
  req.user = {
    uid: 'customer-user-123', // or admin-user-123, rider-user-123
    email: 'test@example.com',
    role: 'admin', // or customer, rider
  };
  next();
};
