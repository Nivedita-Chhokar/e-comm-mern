const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const verifyToken = require("../middleware/verifyToken"); 

// Create order
router.post("/", verifyToken, async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Get all orders (Admin)
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find().populate("product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Admin updates status
router.put("/:id/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Admin assigns rider
router.put("/:id/assign-rider", verifyToken, async (req, res) => {
  try {
    const { riderId } = req.body;
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { assignedRider: riderId },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to assign rider" });
  }
});

module.exports = router;
