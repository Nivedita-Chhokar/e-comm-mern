const mongoose = require('mongoose');
const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');
const admin = require('../config/firebase');
const connectDB = require('../config/db');
require('dotenv').config();

// This script creates an admin user both in Firebase and local database

const createAdminUser = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const adminEmail = 'example-user@example.com'; 
    const adminName = 'Admin User';

    let approvedEmail = await ApprovedEmail.findOne({ email: adminEmail });
    
    if (!approvedEmail) {
      approvedEmail = new ApprovedEmail({
        email: adminEmail,
        role: 'admin',
        isActive: true,
      });
      await approvedEmail.save();
      console.log('Created approved email entry');
    } else {
      if (approvedEmail.role !== 'admin') {
        approvedEmail.role = 'admin';
        await approvedEmail.save();
        console.log('Updated approved email role to admin');
      }
    }

    // Check if Firebase user exists
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().getUserByEmail(adminEmail);
      console.log('Firebase user already exists');
    } catch (error) {
      firebaseUser = await admin.auth().createUser({
        email: adminEmail,
        displayName: adminName,
        emailVerified: true,
      });
      console.log('Created new Firebase user');
    }

    let user = await User.findOne({ email: adminEmail });
    
    if (!user) {
      user = new User({
        email: adminEmail,
        displayName: adminName,
        firebaseUID: firebaseUser.uid,
        role: 'admin',
        isActive: true,
      });
      await user.save();
      console.log('Created admin user in database');
    } else {
      user.role = 'admin';
      user.isActive = true;
      user.firebaseUID = firebaseUser.uid;
      await user.save();
      console.log('Updated existing user to admin');
    }

    console.log('Admin user setup complete!');
    console.log('Email:', adminEmail);
    console.log('Firebase UID:', firebaseUser.uid);

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();