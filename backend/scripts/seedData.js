const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const ApprovedEmail = require("../models/ApprovedEmail");
const connectDB = require("../config/db");
const { faker } = require('@faker-js/faker');

require('dotenv').config();

// Sample approved emails
const approvedEmails = [
  {
    email: "admin@example.com",
    role: "admin",
    isActive: true
  },
  {
    email: "rider1@example.com",
    role: "rider",
    isActive: true
  },
  {
    email: "rider2@example.com",
    role: "rider",
    isActive: true
  },
  {
    email: "customer1@example.com",
    role: "customer",
    isActive: true
  },
  {
    email: "customer2@example.com",
    role: "customer",
    isActive: true
  }
];

// Sample products (fans and air conditioners with variants)
const products = [
  {
    name: "Arctic Breeze Fan",
    description: "Quiet and energy-efficient cooling fan with 3 speed settings and oscillation feature. Perfect for bedrooms and small spaces.",
    price: 59.99,
    category: "fan",
    imageURLs: [
      "https://example.com/images/arctic-breeze-1.jpg",
      "https://example.com/images/arctic-breeze-2.jpg"
    ],
    variants: [
      {
        size: "Small",
        color: "White",
        stock: 25,
        sku: "FAN-AB-S-W"
      },
      {
        size: "Small",
        color: "Black",
        stock: 15,
        sku: "FAN-AB-S-B"
      },
      {
        size: "Medium",
        color: "White",
        stock: 20,
        sku: "FAN-AB-M-W"
      },
      {
        size: "Medium",
        color: "Black",
        stock: 10,
        sku: "FAN-AB-M-B"
      }
    ],
    features: [
      "3-speed settings",
      "Oscillation feature",
      "Timer function",
      "Remote control included",
      "Energy efficient"
    ],
    specifications: {
      "Power": "45W",
      "Noise Level": "45dB",
      "Airflow": "1500 CFM",
      "Dimensions": "12 x 12 x 40 inches",
      "Weight": "8 lbs"
    }
  },
  {
    name: "TurboMax Tower Fan",
    description: "Powerful tower fan with 5 speed settings and wide oscillation range. Features a sleek design and quiet operation.",
    price: 89.99,
    category: "fan",
    imageURLs: [
      "https://example.com/images/turbomax-1.jpg",
      "https://example.com/images/turbomax-2.jpg"
    ],
    variants: [
      {
        size: "Medium",
        color: "Silver",
        stock: 18,
        sku: "FAN-TM-M-S"
      },
      {
        size: "Medium",
        color: "Black",
        stock: 22,
        sku: "FAN-TM-M-B"
      },
      {
        size: "Large",
        color: "Silver",
        stock: 14,
        sku: "FAN-TM-L-S"
      },
      {
        size: "Large",
        color: "Black",
        stock: 16,
        sku: "FAN-TM-L-B"
      }
    ],
    features: [
      "5-speed settings",
      "90-degree oscillation",
      "8-hour timer",
      "Digital display",
      "Remote control included",
      "Sleep mode"
    ],
    specifications: {
      "Power": "60W",
      "Noise Level": "50dB",
      "Airflow": "2000 CFM",
      "Dimensions": "12 x 12 x 48 inches",
      "Weight": "10 lbs"
    }
  },
  {
    name: "CoolWave Ceiling Fan",
    description: "Elegant ceiling fan with wooden blades and built-in LED lighting. Features reversible blades for year-round use.",
    price: 129.99,
    category: "fan",
    imageURLs: [
      "https://example.com/images/coolwave-1.jpg",
      "https://example.com/images/coolwave-2.jpg"
    ],
    variants: [
      {
        size: "Medium",
        color: "Oak/White",
        stock: 12,
        sku: "FAN-CW-M-OW"
      },
      {
        size: "Medium",
        color: "Mahogany/Brown",
        stock: 8,
        sku: "FAN-CW-M-MB"
      },
      {
        size: "Large",
        color: "Oak/White",
        stock: 10,
        sku: "FAN-CW-L-OW"
      },
      {
        size: "Large",
        color: "Mahogany/Brown",
        stock: 6,
        sku: "FAN-CW-L-MB"
      }
    ],
    features: [
      "3-speed settings",
      "Reversible motor",
      "LED light kit included",
      "Remote control included",
      "Energy Star certified"
    ],
    specifications: {
      "Power": "75W",
      "Blade Span": "52 inches",
      "Light Output": "1200 lumens",
      "Mounting Type": "Downrod",
      "Weight": "18 lbs"
    }
  },
  {
    name: "ChillMaster Window AC",
    description: "Efficient window air conditioner with digital controls and eco mode. Perfect for cooling small to medium rooms.",
    price: 249.99,
    category: "air_conditioner",
    imageURLs: [
      "https://example.com/images/chillmaster-1.jpg",
      "https://example.com/images/chillmaster-2.jpg"
    ],
    variants: [
      {
        size: "5,000 BTU",
        color: "White",
        stock: 15,
        sku: "AC-CM-5K-W"
      },
      {
        size: "8,000 BTU",
        color: "White",
        stock: 12,
        sku: "AC-CM-8K-W"
      },
      {
        size: "10,000 BTU",
        color: "White",
        stock: 8,
        sku: "AC-CM-10K-W"
      }
    ],
    features: [
      "Digital controls",
      "Eco mode",
      "24-hour timer",
      "Sleep mode",
      "Remote control included",
      "Washable filter"
    ],
    specifications: {
      "Energy Efficiency Ratio": "11.2",
      "Cooling Area": "150-250 sq ft",
      "Noise Level": "55dB",
      "Dimensions": "18.5 x 16.1 x 12.5 inches",
      "Weight": "45 lbs"
    }
  },
  {
    name: "FrostTech Split AC",
    description: "High-performance split air conditioner with inverter technology for energy efficiency. Features smart connectivity and allergen filter.",
    price: 499.99,
    category: "air_conditioner",
    imageURLs: [
      "https://example.com/images/frosttech-1.jpg",
      "https://example.com/images/frosttech-2.jpg"
    ],
    variants: [
      {
        size: "12,000 BTU",
        color: "White",
        stock: 10,
        sku: "AC-FT-12K-W"
      },
      {
        size: "18,000 BTU",
        color: "White",
        stock: 8,
        sku: "AC-FT-18K-W"
      },
      {
        size: "24,000 BTU",
        color: "White",
        stock: 5,
        sku: "AC-FT-24K-W"
      }
    ],
    features: [
      "Inverter technology",
      "WiFi connectivity",
      "Voice control compatible",
      "HEPA filter",
      "4-way air direction",
      "Self-cleaning function"
    ],
    specifications: {
      "Energy Efficiency Ratio": "17.5",
      "Cooling Area": "450-700 sq ft",
      "Noise Level": "32dB (indoor unit)",
      "Refrigerant": "R410A",
      "Weight": "Indoor: 22 lbs, Outdoor: 68 lbs"
    }
  }
];

// Sample users
const users = [
  {
    email: "admin@example.com",
    displayName: "Admin User",
    photoURL: "https://example.com/photos/admin.jpg",
    firebaseUID: "admin-user-123",
    role: "admin",
    isActive: true,
    address: {
      street: "123 Admin Street",
      city: "Admin City",
      state: "AC",
      zipCode: "12345",
      country: "USA"
    },
    phone: "555-123-4567"
  },
  {
    email: "rider1@example.com",
    displayName: "Rider One",
    photoURL: "https://example.com/photos/rider1.jpg",
    firebaseUID: "rider-user-123",
    role: "rider",
    isActive: true,
    address: {
      street: "456 Rider Avenue",
      city: "Rider City",
      state: "RC",
      zipCode: "23456",
      country: "USA"
    },
    phone: "555-234-5678"
  },
  {
    email: "rider2@example.com",
    displayName: "Rider Two",
    photoURL: "https://example.com/photos/rider2.jpg",
    firebaseUID: "rider-user-456",
    role: "rider",
    isActive: true,
    address: {
      street: "789 Delivery Road",
      city: "Delivery City",
      state: "DC",
      zipCode: "34567",
      country: "USA"
    },
    phone: "555-345-6789"
  },
  {
    email: "customer1@example.com",
    displayName: "Customer One",
    photoURL: "https://example.com/photos/customer1.jpg",
    firebaseUID: "customer-user-123",
    role: "customer",
    isActive: true,
    address: {
      street: "101 Customer Lane",
      city: "Customer City",
      state: "CC",
      zipCode: "45678",
      country: "USA"
    },
    phone: "555-456-7890"
  },
  {
    email: "customer2@example.com",
    displayName: "Customer Two",
    photoURL: "https://example.com/photos/customer2.jpg",
    firebaseUID: "customer-user-456",
    role: "customer",
    isActive: true,
    address: {
      street: "202 Buyer Street",
      city: "Buyer City",
      state: "BC",
      zipCode: "56789",
      country: "USA"
    },
    phone: "555-567-8901"
  }
];

const seedData = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log("Connected to MongoDB");

    // Clear existing data
    await ApprovedEmail.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log("Cleared existing data");

    // Insert approved emails
    await ApprovedEmail.insertMany(approvedEmails);
    console.log("Added approved emails");

    // Insert users
    await User.insertMany(users);
    console.log("Added users");

    // Insert products
    await Product.insertMany(products);
    console.log("Added products");

    // Create some sample orders after products are inserted
    const allProducts = await Product.find();
    
    // Create sample orders
    const orders = [];
    
    // Customer 1 orders
    const customer1 = await User.findOne({ email: "customer1@example.com" });
    
    if (customer1 && allProducts.length > 0) {
      // Create a pending order
      orders.push({
        userId: customer1.firebaseUID,
        items: [
          {
            productId: allProducts[0]._id,
            quantity: 1,
            size: allProducts[0].variants[0].size,
            color: allProducts[0].variants[0].color,
            price: allProducts[0].price
          }
        ],
        totalAmount: allProducts[0].price,
        shippingAddress: {
          name: customer1.displayName,
          street: customer1.address.street,
          city: customer1.address.city,
          state: customer1.address.state,
          zipCode: customer1.address.zipCode,
          country: customer1.address.country,
          phone: customer1.phone
        },
        paymentMethod: "Credit Card",
        paymentStatus: "Paid",
        orderStatus: "Pending"
      });
      
      // Create a processing order
      orders.push({
        userId: customer1.firebaseUID,
        items: [
          {
            productId: allProducts[1]._id,
            quantity: 2,
            size: allProducts[1].variants[1].size,
            color: allProducts[1].variants[1].color,
            price: allProducts[1].price
          }
        ],
        totalAmount: allProducts[1].price * 2,
        shippingAddress: {
          name: customer1.displayName,
          street: customer1.address.street,
          city: customer1.address.city,
          state: customer1.address.state,
          zipCode: customer1.address.zipCode,
          country: customer1.address.country,
          phone: customer1.phone
        },
        paymentMethod: "PayPal",
        paymentStatus: "Paid",
        orderStatus: "Processing"
      });
    }
    
    // Customer 2 orders
    const customer2 = await User.findOne({ email: "customer2@example.com" });
    const rider1 = await User.findOne({ email: "rider1@example.com" });
    
    if (customer2 && rider1 && allProducts.length > 2) {
      // Create a shipped order
      orders.push({
        userId: customer2.firebaseUID,
        items: [
          {
            productId: allProducts[2]._id,
            quantity: 1,
            size: allProducts[2].variants[0].size,
            color: allProducts[2].variants[0].color,
            price: allProducts[2].price
          },
          {
            productId: allProducts[3]._id,
            quantity: 1,
            size: allProducts[3].variants[0].size,
            color: allProducts[3].variants[0].color,
            price: allProducts[3].price
          }
        ],
        totalAmount: allProducts[2].price + allProducts[3].price,
        shippingAddress: {
          name: customer2.displayName,
          street: customer2.address.street,
          city: customer2.address.city,
          state: customer2.address.state,
          zipCode: customer2.address.zipCode,
          country: customer2.address.country,
          phone: customer2.phone
        },
        paymentMethod: "Credit Card",
        paymentStatus: "Paid",
        orderStatus: "Shipped",
        assignedRider: rider1.firebaseUID,
        trackingInfo: {
          carrier: "FastDelivery",
          trackingNumber: "FD" + Math.floor(Math.random() * 1000000),
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        }
      });
      
      // Create a delivered order
      orders.push({
        userId: customer2.firebaseUID,
        items: [
          {
            productId: allProducts[4]._id,
            quantity: 1,
            size: allProducts[4].variants[0].size,
            color: allProducts[4].variants[0].color,
            price: allProducts[4].price
          }
        ],
        totalAmount: allProducts[4].price,
        shippingAddress: {
          name: customer2.displayName,
          street: customer2.address.street,
          city: customer2.address.city,
          state: customer2.address.state,
          zipCode: customer2.address.zipCode,
          country: customer2.address.country,
          phone: customer2.phone
        },
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Paid",
        orderStatus: "Delivered",
        assignedRider: rider1.firebaseUID,
        deliveryNotes: "Delivered on time, customer was satisfied",
        trackingInfo: {
          carrier: "FastDelivery",
          trackingNumber: "FD" + Math.floor(Math.random() * 1000000),
          estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      });
    }
    
    if (orders.length > 0) {
      await Order.insertMany(orders);
      console.log("Added sample orders");
    }

    console.log("Data seeding completed successfully!");
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

// Run the seed function
seedData();