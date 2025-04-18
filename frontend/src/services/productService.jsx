// src/services/productService.js
import api from './api';

// Get all products (with optional category filter)
export const getAllProducts = async (category, includeOutOfStock = false) => {
  try {
    const params = {};
    
    if (category) {
      params.category = category;
    }
    
    if (includeOutOfStock) {
      params.includeOutOfStock = true;
    }
    
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    // Add error handling for invalid productId
    if (!productId) {
      throw new Error('Invalid product ID');
    }
    
    const response = await api.get(`/products/${productId}`);
    
    // Check if we got a valid response
    if (!response.data) {
      throw new Error('Product not found');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
};

// Admin: Create a new product
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Admin: Update a product
export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${productId}:`, error);
    throw error;
  }
};

// Admin: Delete a product
export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with ID ${productId}:`, error);
    throw error;
  }
};

// Admin: Update product stock
export const updateProductStock = async (productId, variantUpdates) => {
  try {
    const response = await api.patch(`/products/${productId}/stock`, {
      variantUpdates,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating stock for product with ID ${productId}:`, error);
    throw error;
  }
};