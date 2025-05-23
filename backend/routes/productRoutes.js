const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middleware/verifyToken');
const roleCheck = require('../middleware/roleCheck');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin routes (protected)
router.post(
  '/',
  verifyToken,
  roleCheck(['admin']),
  productController.createProduct
);

router.put(
  '/:id',
  verifyToken,
  roleCheck(['admin']),
  productController.updateProduct
);

router.delete(
  '/:id',
  verifyToken,
  roleCheck(['admin']),
  productController.deleteProduct
);

router.patch(
  '/:id/stock',
  verifyToken,
  roleCheck(['admin']),
  productController.updateProductStock
);

module.exports = router;
