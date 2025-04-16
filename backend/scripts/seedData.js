const mongoose = require("mongoose");
const Product = require("../models/Product"); // Adjust path based on your project structure
const Order = require("../models/Order"); // Adjust path based on your project structure
const connectDB = require("../config/db"); // Adjust path based on your project structure
const { faker } = require('@faker-js/faker');

require('dotenv').config();  

const sampleProducts = [
  {
    name: "T-Shirt",
    description: "Comfortable cotton t-shirt.",
    price: 20.99,
    category: "Apparel",
    stock: 100,
  },
  {
    name: "Jeans",
    description: "Stylish blue jeans.",
    price: 39.99,
    category: "Apparel",
    stock: 50,
  },
];

const sampleOrders = [
  {
    productId: "60f62b9b46a5b2233e0b42c1", // Product reference ID
    userId: "dummy-user-123",
    status: "Pending",
    assignedRider: null,
    color: "Red",
    size: "M",
  },
  {
    productId: "60f62b9b46a5b2233e0b42c2", // Product reference ID
    userId: "dummy-user-456",
    status: "Shipped",
    assignedRider: "rider-123",
    color: "Blue",
    size: "L",
  },
];

const seedData = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Clear existing data from the collections
    await Product.deleteMany();
    await Order.deleteMany();

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log("Sample products added successfully");

    // Insert sample orders
    await Order.insertMany(sampleOrders);
    console.log("Sample orders added successfully");

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

seedData();
