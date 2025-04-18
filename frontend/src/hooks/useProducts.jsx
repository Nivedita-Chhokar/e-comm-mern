import { useState, useEffect, useCallback } from 'react';
import { getAllProducts, getProductById } from '../services/productService';

const useProducts = (initialCategory = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(initialCategory);

  // Fetch all products
  const fetchProducts = useCallback(async (includeOutOfStock = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProducts(category, includeOutOfStock);
      setProducts(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      return [];
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Fetch a single product by ID
  const fetchProductById = async (productId) => {
    if (!productId) {
      setError('Invalid product ID');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getProductById(productId);
      return data;
    } catch (err) {
      console.error('Product fetch error:', err);
      setError(err.message || `Failed to fetch product with ID ${productId}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Change the category filter
  const changeCategory = (newCategory) => {
    setCategory(newCategory);
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    changeCategory,
  };
};

export default useProducts;