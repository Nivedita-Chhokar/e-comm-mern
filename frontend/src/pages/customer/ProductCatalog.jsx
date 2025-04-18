import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import ProductCard from '../../components/common/ProductCard';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const ProductCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const { products, loading, error, changeCategory } = useProducts(categoryParam);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  
  // Filter products based on category and stock status
  const filteredProducts = products.filter(product => 
    showOutOfStock ? true : product.inStock
  );
  
  // Handle category change
  const handleCategoryChange = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category) {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
    changeCategory(category);
  };
  
  useEffect(() => {
    changeCategory(categoryParam);
  }, [categoryParam, changeCategory]);
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {categoryParam === 'fan' ? 'Fans' 
          : categoryParam === 'air_conditioner' ? 'Air Conditioners' 
          : 'All Products'}
      </h1>
      
      {/* Filters */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span className="font-medium">Category:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`px-4 py-2 rounded-md ${
                  !categoryParam
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleCategoryChange('fan')}
                className={`px-4 py-2 rounded-md ${
                  categoryParam === 'fan'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Fans
              </button>
              <button
                onClick={() => handleCategoryChange('air_conditioner')}
                className={`px-4 py-2 rounded-md ${
                  categoryParam === 'air_conditioner'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Air Conditioners
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={showOutOfStock}
                onChange={() => setShowOutOfStock(!showOutOfStock)}
              />
              <span className="ml-2 text-gray-700">Show out of stock</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Product Grid */}
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">
            Try changing your filter settings or check back later for new products.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;