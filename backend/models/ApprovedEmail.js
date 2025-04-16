const mongoose = require("mongoose");

const approvedEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'rider'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("ApprovedEmail", approvedEmailSchema);