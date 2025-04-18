// src/components/common/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Check if product has stock
  const isInStock = product.inStock;
  
  // Get primary image or placeholder
  const productImage = product.imageURLs && product.imageURLs.length > 0
    ? product.imageURLs[0]
    : 'https://via.placeholder.com/300x300?text=No+Image';
  
  // Get color and size variants
  const uniqueColors = [...new Set(product.variants.map(variant => variant.color))];
  const uniqueSizes = [...new Set(product.variants.map(variant => variant.size))];
  
  return (
    <Link to={`/products/${product._id}`} className="group">
      <div className="relative rounded-lg overflow-hidden bg-white shadow-md transition-shadow hover:shadow-lg">
        {/* Product Image */}
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 rounded-t-lg">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-64 object-cover object-center group-hover:opacity-75 transition-opacity"
          />
        </div>
        
        {/* Out of stock badge */}
        {!isInStock && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold uppercase px-3 py-1 rounded">
            Out of Stock
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold uppercase px-3 py-1 rounded">
          {product.category === 'fan' ? 'Fan' : 'Air Conditioner'}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 h-12 overflow-hidden">
            {product.description.length > 80
              ? `${product.description.substring(0, 80)}...`
              : product.description}
          </p>
          
          {/* Price and Variants */}
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {uniqueColors.length} colors • {uniqueSizes.length} sizes
              </p>
            </div>
          </div>
          
          {/* Available variants summary */}
          <div className="mt-2">
            {/* Color dots */}
            <div className="flex space-x-1 mt-1">
              {uniqueColors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ 
                    backgroundColor: color.toLowerCase(),
                    // For white color, add a more visible border
                    borderColor: color.toLowerCase() === 'white' ? '#d1d5db' : 'transparent'
                  }}
                  title={color}
                ></div>
              ))}
              {uniqueColors.length > 4 && (
                <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                  +{uniqueColors.length - 4}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;