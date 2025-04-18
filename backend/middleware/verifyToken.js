const admin = require('../config/firebase');
const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    console.log('Processing token...');
    
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
      console.log('Verified as ID token');
    } catch (idTokenError) {
      console.log('Not an ID token, looking up user by custom token...');
      
      const user = await User.findOne({ email: req.query.email });
      
      if (!user) {
        console.log('User not found for email');
        throw new Error('User not found');
      }
      
      // Check if user is active
      if (!user.isActive) {
        throw new Error('User account is inactive');
      }
      
      // Create a decoded token equivalent for custom tokens
      decodedToken = {
        uid: user.firebaseUID,
        email: user.email
      };
      
      console.log('Found user by email');
    }

    // Check if email is approved
    const approvedEmail = await ApprovedEmail.findOne({
      email: decodedToken.email,
      isActive: true,
    });

    if (!approvedEmail) {
      console.log('Email not approved:', decodedToken.email);
      return res.status(403).json({
        message: 'Email not approved for access',
      });
    }

    // Find user by Firebase UID
    const user = await User.findOne({ firebaseUID: decodedToken.uid });

    if (!user) {
      console.log('User not found in database:', decodedToken.uid);
      return res.status(404).json({
        message: 'User not found in system',
      });
    }

    // Add user data to request
    req.user = {
      uid: user.firebaseUID,
      email: user.email,
      role: user.role,
      _id: user._id,
    };
    console.log('User authenticated:', user.email, 'Role:', user.role);

    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};

module.exports = verifyToken;