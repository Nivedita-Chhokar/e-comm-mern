// backend/scripts/seedRiderData.js
const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const connectDB = require('../config/db');
require('dotenv').config();

// Email of the rider you're logged in as
const RIDER_EMAIL = 'chhokarnivedita@gmail.com'; // Use your actual rider email here

const seedRiderData = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Find the specific rider by email
    const rider = await User.findOne({ email: RIDER_EMAIL });
    if (!rider) {
      console.error(`No rider found with email ${RIDER_EMAIL}. Please check the email.`);
      process.exit(1);
    }

    console.log(`Found rider: ${rider.displayName} (${rider.email})`);
    console.log(`Rider Firebase UID: ${rider.firebaseUID}`);

    const customer = await User.findOne({ role: 'customer' });
    if (!customer) {
      console.error('No customer user found. Please run seedData.js first to create users.');
      process.exit(1);
    }

    const products = await Product.find().limit(5);
    if (products.length === 0) {
      console.error('No products found. Please run seedData.js first to create products.');
      process.exit(1);
    }

    // Clean up any existing orders for this rider
    const deleteResult = await Order.deleteMany({ assignedRider: rider.firebaseUID });
    console.log(`Deleted ${deleteResult.deletedCount} existing rider orders`);

    // Create sample orders assigned to the rider
    const sampleOrders = [
      // 1. Pending delivery (Shipped)
      {
        userId: customer.firebaseUID,
        items: [
          {
            productId: products[0]._id,
            quantity: 2,
            size: products[0].variants[0].size,
            color: products[0].variants[0].color,
            price: products[0].price
          },
        ],
        totalAmount: products[0].price * 2,
        shippingAddress: {
          name: customer.displayName,
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          phone: '555-123-4567',
        },
        paymentMethod: 'Credit Card',
        paymentStatus: 'Paid',
        orderStatus: 'Shipped',
        assignedRider: rider.firebaseUID,
        trackingInfo: {
          carrier: 'SpeedDelivery',
          trackingNumber: 'SD' + Math.floor(Math.random() * 10000000),
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      
      // 2. Another pending delivery (Shipped)
      {
        userId: customer.firebaseUID,
        items: [
          {
            productId: products[1]._id,
            quantity: 1,
            size: products[1].variants[0].size,
            color: products[1].variants[0].color,
            price: products[1].price
          },
        ],
        totalAmount: products[1].price,
        shippingAddress: {
          name: 'John Smith',
          street: '456 Park Avenue',
          city: 'Brooklyn',
          state: 'NY',
          zipCode: '11201',
          country: 'USA',
          phone: '555-987-6543',
        },
        paymentMethod: 'PayPal',
        paymentStatus: 'Paid',
        orderStatus: 'Shipped',
        assignedRider: rider.firebaseUID,
        trackingInfo: {
          carrier: 'SpeedDelivery',
          trackingNumber: 'SD' + Math.floor(Math.random() * 10000000),
          estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
      
      // 3. Delivered order
      {
        userId: customer.firebaseUID,
        items: [
          {
            productId: products[2]._id,
            quantity: 1,
            size: products[2].variants[0].size,
            color: products[2].variants[0].color,
            price: products[2].price
          },
        ],
        totalAmount: products[2].price,
        shippingAddress: {
          name: 'Sarah Johnson',
          street: '789 Broadway',
          city: 'Manhattan',
          state: 'NY',
          zipCode: '10003',
          country: 'USA',
          phone: '555-456-7890',
        },
        paymentMethod: 'Credit Card',
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        assignedRider: rider.firebaseUID,
        deliveryNotes: 'Left with doorman as requested.',
        trackingInfo: {
          carrier: 'SpeedDelivery',
          trackingNumber: 'SD' + Math.floor(Math.random() * 10000000),
          estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      
      // 4. Undelivered order
      {
        userId: customer.firebaseUID,
        items: [
          {
            productId: products[3]._id,
            quantity: 1,
            size: products[3].variants[0].size,
            color: products[3].variants[0].color,
            price: products[3].price
          },
        ],
        totalAmount: products[3].price,
        shippingAddress: {
          name: 'Emily Davis',
          street: '987 First Avenue',
          city: 'Bronx',
          state: 'NY',
          zipCode: '10451',
          country: 'USA',
          phone: '555-777-8888',
        },
        paymentMethod: 'Credit Card',
        paymentStatus: 'Paid',
        orderStatus: 'Undelivered',
        assignedRider: rider.firebaseUID,
        deliveryNotes: 'Customer not available. No safe place to leave package.',
        trackingInfo: {
          carrier: 'SpeedDelivery',
          trackingNumber: 'SD' + Math.floor(Math.random() * 10000000),
          estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ];

    // Insert orders
    const insertResult = await Order.insertMany(sampleOrders);
    
    console.log(`Successfully created ${insertResult.length} sample orders assigned to rider.`);
    
    // Count orders by status for summary
    const shippedCount = await Order.countDocuments({ 
      assignedRider: rider.firebaseUID,
      orderStatus: 'Shipped'
    });
    
    const deliveredCount = await Order.countDocuments({ 
      assignedRider: rider.firebaseUID,
      orderStatus: 'Delivered'
    });
    
    const undeliveredCount = await Order.countDocuments({ 
      assignedRider: rider.firebaseUID,
      orderStatus: 'Undelivered'
    });
    
    console.log('Order Summary:');
    console.log(`- Pending Delivery (Shipped): ${shippedCount}`);
    console.log(`- Delivered: ${deliveredCount}`);
    console.log(`- Undelivered: ${undeliveredCount}`);
    console.log(`- Total Assigned: ${shippedCount + deliveredCount + undeliveredCount}`);

    mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    console.log('Rider data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding rider data:', error);
    process.exit(1);
  }
};

seedRiderData();