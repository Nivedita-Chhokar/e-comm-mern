const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: String,
    photoURL: String,
    firebaseUID: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'rider'],
      default: 'customer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    phone: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
