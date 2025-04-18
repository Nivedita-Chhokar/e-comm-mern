import api from './api';

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

export const getProductById = async (productId) => {
  try {
    if (!productId) {
      throw new Error('Invalid product ID');
    }
    
    const response = await api.get(`/products/${productId}`);

    if (!response.data) {
      throw new Error('Product not found');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${productId}:`, error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with ID ${productId}:`, error);
    throw error;
  }
};

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