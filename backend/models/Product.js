const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['fan', 'air_conditioner']
  },
  imageURLs: [String],
  variants: [
    {
      size: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
      },
      sku: String
    }
  ],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  features: [String],
  inStock: {
    type: Boolean,
    default: true
  },
  specifications: {
    type: Map,
    of: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);