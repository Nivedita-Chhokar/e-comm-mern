const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const roleCheck = require("../middleware/roleCheck");

// Get user profile
router.get("/profile", verifyToken, userController.getUserProfile);

// Update user profile
router.put("/profile", verifyToken, userController.updateUserProfile);

module.exports = router;