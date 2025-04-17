const express = require('express');
const router = express.Router();
const riderController = require('../controllers/riderController');
const verifyToken = require('../middleware/verifyToken');
const roleCheck = require('../middleware/roleCheck');

// All rider routes require rider role
const riderOnly = roleCheck(['rider']);

// Get all assigned orders
router.get(
  '/orders',
  verifyToken,
  riderOnly,
  riderController.getAssignedOrders
);

// Get single order details
router.get(
  '/orders/:id',
  verifyToken,
  riderOnly,
  riderController.getOrderDetails
);

// Update order delivery status
router.put(
  '/orders/:id/delivery',
  verifyToken,
  riderOnly,
  riderController.updateDeliveryStatus
);

// Get rider profile
router.get('/profile', verifyToken, riderOnly, riderController.getRiderProfile);

// Update rider profile
router.put(
  '/profile',
  verifyToken,
  riderOnly,
  riderController.updateRiderProfile
);

// Get rider statistics
router.get('/stats', verifyToken, riderOnly, riderController.getRiderStats);

module.exports = router;
