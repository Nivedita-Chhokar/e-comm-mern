const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// Google login
router.post('/google-login', authController.googleLogin);

// Get current authenticated user
router.get('/me', verifyToken, authController.getCurrentUser);

module.exports = router;
