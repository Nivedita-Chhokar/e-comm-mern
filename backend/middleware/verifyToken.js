const admin = require("../config/firebase");
const User = require("../models/User");
const ApprovedEmail = require("../models/ApprovedEmail");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    
    // Check if email is approved
    const approvedEmail = await ApprovedEmail.findOne({ 
      email: decoded.email,
      isActive: true 
    });
    
    if (!approvedEmail) {
      return res.status(403).json({ 
        message: "Email not approved for access" 
      });
    }
    
    // Find or create user
    let user = await User.findOne({ firebaseUID: decoded.uid });
    
    if (!user) {
      user = new User({
        email: decoded.email,
        displayName: decoded.name,
        photoURL: decoded.picture,
        firebaseUID: decoded.uid,
        role: approvedEmail.role
      });
      await user.save();
    }
    
    // Add user data to request
    req.user = {
      ...decoded,
      role: user.role,
      _id: user._id
    };
    
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};

// module.exports = verifyToken;
module.exports = (req, res, next) => {
    req.user = { uid: "dummy-user-123" };
    console.log("Middleware hit, user simulated:", req.user);  // to test token
    next();
};
