const { OAuth2Client } = require("google-auth-library");
const admin = require("../config/firebase");
const User = require("../models/User");
const ApprovedEmail = require("../models/ApprovedEmail");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google login
exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  
  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;
    
    // Check if email is in approved emails
    const approvedEmail = await ApprovedEmail.findOne({ 
      email, 
      isActive: true 
    });
    
    if (!approvedEmail) {
      return res.status(403).json({ 
        message: "This email is not approved for access" 
      });
    }
    
    // Get or create Firebase user
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().getUserByEmail(email);
    } catch (error) {
      // Create new Firebase user if not exists
      firebaseUser = await admin.auth().createUser({
        email,
        displayName: name,
        photoURL: picture
      });
    }
    
    // Find or create user in our database
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({
        email,
        displayName: name,
        photoURL: picture,
        firebaseUID: firebaseUser.uid,
        role: approvedEmail.role
      });
      await user.save();
    }
    
    // Create custom token for Firebase client SDK
    const customToken = await admin.auth().createCustomToken(firebaseUser.uid);
    
    res.json({
      message: "Authentication successful",
      token: customToken,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        photoURL: user.photoURL
      }
    });
    
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Authentication failed", error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
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
exports.updateProfile = async (req, res) => {
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

module.exports = exports;