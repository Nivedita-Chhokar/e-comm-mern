const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const roleCheck = require("../middleware/roleCheck");

// User routes (protected)
router.get(
  "/profile", 
  verifyToken, 
  userController.getUserProfile
);

router.put(
  "/profile", 
  verifyToken, 
  userController.updateUserProfile
);

// Admin routes (admin only)
router.get(
  "/", 
  verifyToken, 
  roleCheck(['admin']), 
  userController.getAllUsers
);

router.get(
  "/:id", 
  verifyToken, 
  roleCheck(['admin']), 
  userController.getUserById
);

router.put(
  "/:id/role", 
  verifyToken, 
  roleCheck(['admin']), 
  userController.updateUserRole
);

router.put(
  "/:id/toggle-status", 
  verifyToken, 
  roleCheck(['admin']), 
  userController.toggleUserStatus
);

module.exports = router;