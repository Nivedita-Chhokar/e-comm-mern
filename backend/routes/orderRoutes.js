const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verifyToken = require("../middleware/verifyToken");
const roleCheck = require("../middleware/roleCheck");

// Customer routes
router.get(
  "/my-orders", 
  verifyToken, 
  orderController.getMyOrders
);

router.post(
  "/", 
  verifyToken, 
  orderController.createOrder
);

// Admin routes
router.get(
  "/", 
  verifyToken, 
  roleCheck(['admin']), 
  orderController.getAllOrders
);

router.get(
  "/:id", 
  verifyToken, 
  orderController.getOrderById  // Includes access control in controller
);

router.put(
  "/:id/status", 
  verifyToken, 
  roleCheck(['admin']), 
  orderController.updateOrderStatus
);

// Rider routes
router.get(
  "/rider/assigned", 
  verifyToken, 
  roleCheck(['rider']), 
  orderController.getRiderOrders
);

router.put(
  "/:id/delivery", 
  verifyToken, 
  roleCheck(['rider']), 
  orderController.updateDeliveryStatus
);

module.exports = router;