const Product = require('../models/Product');

// Get all products (public)
exports.getAllProducts = async (req, res) => {
  try {
    // Allow filtering by category
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Only return products that are in stock by default
    if (req.query.includeOutOfStock !== 'true') {
      filter.inStock = true;
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID (public)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new product (admin only)
exports.createProduct = async (req, res) => {
  try {
    // Validate product category based on PRD
    if (!['fan', 'air_conditioner'].includes(req.body.category)) {
      return res.status(400).json({
        message: "Product category must be either 'fan' or 'air_conditioner'",
      });
    }

    // Check if at least one variant is provided
    if (!req.body.variants || req.body.variants.length === 0) {
      return res.status(400).json({
        message: 'At least one size and color variant is required',
      });
    }

    // Calculate inStock based on variants
    const hasStock = req.body.variants.some(variant => variant.stock > 0);

    const newProduct = new Product({
      ...req.body,
      inStock: hasStock,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    // If updating variants, calculate inStock
    let updateData = { ...req.body };

    if (req.body.variants) {
      const hasStock = req.body.variants.some(variant => variant.stock > 0);
      updateData.inStock = hasStock;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete product (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product stock (admin only)
exports.updateProductStock = async (req, res) => {
  try {
    const { variantUpdates } = req.body;

    if (!variantUpdates || !Array.isArray(variantUpdates)) {
      return res.status(400).json({
        message: 'variantUpdates array is required',
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update stock for each specified variant
    for (const update of variantUpdates) {
      const { size, color, stock } = update;

      const variantIndex = product.variants.findIndex(
        v => v.size === size && v.color === color
      );

      if (variantIndex === -1) {
        return res.status(404).json({
          message: `Variant with size ${size} and color ${color} not found`,
        });
      }

      product.variants[variantIndex].stock = stock;
    }

    // Update inStock status based on variants
    product.inStock = product.variants.some(v => v.stock > 0);

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = exports;
