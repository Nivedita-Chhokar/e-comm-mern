const { OAuth2Client } = require('google-auth-library');
const admin = require('../config/firebase');
const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name, picture, uid } = decodedToken;

    let approvedEmail = await ApprovedEmail.findOne({
      email,
      isActive: true,
    });

    if (!approvedEmail) {
      approvedEmail = new ApprovedEmail({
        email,
        role: 'customer',
        isActive: true,
      });
      await approvedEmail.save();
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        displayName: name || email.split('@')[0],
        photoURL: picture || '',
        firebaseUID: uid,
        role: approvedEmail.role,
      });
      await user.save();
    } else {
      user.displayName = name || user.displayName;
      user.photoURL = picture || user.photoURL;
      user.role = approvedEmail.role; 
      user.firebaseUID = uid;
      await user.save();
    }

    res.json({
      message: 'Authentication successful',
      token: token, 
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