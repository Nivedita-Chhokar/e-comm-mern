const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String, // Firebase UID
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      size: String,
      color: String,
      quantity: Number
    }
  ],
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Undelivered"],
    default: "Pending"
  },
  assignedRider: {
    type: String // Firebase UID of rider
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
