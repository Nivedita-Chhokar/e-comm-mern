const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products
router.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// GET product details
router.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  product ? res.json(product) : res.status(404).json({ message: "Not found" });
});

module.exports = router;
