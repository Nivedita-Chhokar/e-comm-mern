const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const roleCheck = require('../middleware/roleCheck');

// All admin routes require admin role
const adminOnly = roleCheck(['admin']);

// User management
router.get('/users', verifyToken, adminOnly, adminController.getAllUsers);
router.get('/users/:id', verifyToken, adminOnly, adminController.getUserById);
router.put(
  '/users/:id/role',
  verifyToken,
  adminOnly,
  adminController.updateUserRole
);
router.put(
  '/users/:id/toggle-status',
  verifyToken,
  adminOnly,
  adminController.toggleUserStatus
);

// Rider management
router.get('/riders', verifyToken, adminOnly, adminController.getAllRiders);

// Approved emails management
router.get(
  '/approved-emails',
  verifyToken,
  adminOnly,
  adminController.getApprovedEmails
);
router.post(
  '/approved-emails',
  verifyToken,
  adminOnly,
  adminController.createApprovedEmail
);
router.delete(
  '/approved-emails/:id',
  verifyToken,
  adminOnly,
  adminController.deleteApprovedEmail
);

// Dashboard
router.get(
  '/dashboard',
  verifyToken,
  adminOnly,
  adminController.getDashboardStats
);

module.exports = router;
