// backend/scripts/promoteToRider.js
const mongoose = require('mongoose');
const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');
const connectDB = require('../config/db');
require('dotenv').config();

// This script promotes a specific user to rider role
// Usage: node promoteToRider.js user@example.com

const promoteToRider = async () => {
  try {
    // Get email from command line argument
    const email = process.argv[2];
    
    if (!email) {
      console.error('Error: Email address is required. Usage: node promoteToRider.js user@example.com');
      process.exit(1);
    }

    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');

    // Check if email exists in approved emails
    let approvedEmail = await ApprovedEmail.findOne({ email });
    
    if (!approvedEmail) {
      // Create approved email entry
      approvedEmail = new ApprovedEmail({
        email,
        role: 'rider',
        isActive: true,
      });
      await approvedEmail.save();
      console.log('Created approved email entry with rider role');
    } else {
      // Update role to rider
      approvedEmail.role = 'rider';
      approvedEmail.isActive = true;
      await approvedEmail.save();
      console.log('Updated approved email role to rider');
    }

    // Update user if exists
    const user = await User.findOne({ email });
    
    if (user) {
      user.role = 'rider';
      user.isActive = true;
      await user.save();
      console.log('Updated user role to rider');
    } else {
      console.log('Note: User with this email has not signed in yet. They will be assigned rider role upon first login.');
    }

    console.log(`Success! User with email "${email}" has been granted rider privileges.`);
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error promoting user to rider:', error);
    process.exit(1);
  }
};

promoteToRider();