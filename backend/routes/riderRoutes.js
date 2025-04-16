const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken"); 
const Order = require("../models/Order"); 

// Rider fetches their assigned orders
router.get("/rider/orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ assignedRider: req.user.uid });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rider orders" });
  }
});

// Rider updates order status
router.put("/rider/orders/:id/status", verifyToken, async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await Order.findOneAndUpdate(
      { _id: req.params.id, assignedRider: req.user.uid },
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

module.exports = router;
