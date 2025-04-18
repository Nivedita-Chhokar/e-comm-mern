const { OAuth2Client } = require('google-auth-library');
const admin = require('../config/firebase');
const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google login - this is the main authentication method
// Modify the googleLogin function in authController.js
exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    console.log('Processing Firebase ID token directly...');
    
    // Skip Google verification and use Firebase Admin SDK directly
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name, picture, uid } = decodedToken;
    
    console.log('Firebase token verified for:', email);

    // Check if email is in approved emails
    let approvedEmail = await ApprovedEmail.findOne({
      email,
      isActive: true,
    });

    // If email is not approved, automatically create an entry for them as a customer
    if (!approvedEmail) {
      console.log('Email not found, automatically approving as customer:', email);
      approvedEmail = new ApprovedEmail({
        email,
        role: 'customer',
        isActive: true,
      });
      await approvedEmail.save();
    }
    
    console.log('Email approved with role:', approvedEmail.role);

    // Find or create user in our database
    let user = await User.findOne({ email });

    if (!user) {
      console.log('Creating new user in database...');
      user = new User({
        email,
        displayName: name || email.split('@')[0],
        photoURL: picture || '',
        firebaseUID: uid,
        role: approvedEmail.role,
      });
      await user.save();
      console.log('New user created in database');
    } else {
      // Update user details in case they've changed
      console.log('Updating existing user...');
      user.displayName = name || user.displayName;
      user.photoURL = picture || user.photoURL;
      user.role = approvedEmail.role; // Ensure role is updated from approved email
      user.firebaseUID = uid;
      await user.save();
      console.log('User updated in database');
    }

    // Instead of creating a custom token, just use the original ID token
    console.log('Using original ID token for authentication');

    res.json({
      message: 'Authentication successful',
      token: token,  // Return the original ID token
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res
      .status(401)
      .json({ message: 'Authentication failed', error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    console.log('Fetching current user: ', req.user.uid);
    const user = await User.findOne({ firebaseUID: req.user.uid }).select(
      '-__v'
    );

    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user.email);
    res.json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;