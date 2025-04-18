// backend/scripts/promoteToAdmin.js
const mongoose = require('mongoose');
const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');
const connectDB = require('../config/db');
require('dotenv').config();

// This script promotes a specific user to admin role
// Usage: node promoteToAdmin.js user@example.com

const promoteToAdmin = async () => {
  try {
    // Get email from command line argument
    const email = process.argv[2];
    
    if (!email) {
      console.error('Error: Email address is required. Usage: node promoteToAdmin.js user@example.com');
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
        role: 'admin',
        isActive: true,
      });
      await approvedEmail.save();
      console.log('Created approved email entry with admin role');
    } else {
      // Update role to admin
      approvedEmail.role = 'admin';
      approvedEmail.isActive = true;
      await approvedEmail.save();
      console.log('Updated approved email role to admin');
    }

    // Update user if exists
    const user = await User.findOne({ email });
    
    if (user) {
      user.role = 'admin';
      user.isActive = true;
      await user.save();
      console.log('Updated user role to admin');
    } else {
      console.log('Note: User with this email has not signed in yet. They will be assigned admin role upon first login.');
    }

    console.log(`Success! Email "${email}" has been granted admin privileges.`);
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    process.exit(1);
  }
};

promoteToAdmin();