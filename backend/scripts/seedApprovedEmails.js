const mongoose = require('mongoose');
const ApprovedEmail = require('../models/ApprovedEmail');
const connectDB = require('../config/db');
require('dotenv').config();

const approvedEmails = [
  {
    email: 'admin@example.com',
    role: 'admin',
    isActive: true,
  },
  {
    email: 'rider1@example.com',
    role: 'rider',
    isActive: true,
  },
  {
    email: 'rider2@example.com',
    role: 'rider',
    isActive: true,
  },
  {
    email: 'customer1@example.com',
    role: 'customer',
    isActive: true,
  },
  {
    email: 'customer2@example.com',
    role: 'customer',
    isActive: true,
  },
  {
    email: 'niveditachhokar@gmail.com',
    role: 'admin',
    isActive: true,
  },
];

const seedApprovedEmails = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Clear existing data
    await ApprovedEmail.deleteMany();

    // Insert approved emails
    await ApprovedEmail.insertMany(approvedEmails);
    console.log('Approved emails added successfully');

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding approved emails:', error);
  }
};

seedApprovedEmails();
