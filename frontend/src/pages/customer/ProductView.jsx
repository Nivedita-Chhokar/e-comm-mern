import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useCart from '../../hooks/useCart';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const fetchingRef = useRef(false);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);
  
  useEffect(() => {
    if (!fetchingRef.current && id) {
      fetchingRef.current = true;
      setLoading(true);

      const fetchProduct = async () => {
        try {
          const response = await api.get(`/products/${id}`);
          const productData = response.data;
          
          setProduct(productData);
          
          if (productData.imageURLs && productData.imageURLs.length > 0) {
            setMainImage(productData.imageURLs[0]);
          }
          
          if (productData.variants && productData.variants.length > 0) {
            const inStockVariant = productData.variants.find(v => v.stock > 0);
            
            if (inStockVariant) {
              setSelectedSize(inStockVariant.size);
              setSelectedColor(inStockVariant.color);
            } else {
              setSelectedSize(productData.variants[0].size);
              setSelectedColor(productData.variants[0].color);
            }
          }
          
          setError(null);
        } catch (err) {
          console.error('Product fetch error:', err);
          setError('Failed to load product details. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
    
    return () => {
      fetchingRef.current = false;
    };
  }, [id]); 
  
  // Get unique sizes and colors
  const getSizes = () => {
    if (!product || !product.variants || !Array.isArray(product.variants)) return [];
    return [...new Set(product.variants.map(v => v.size))];
  };
  
  const getColors = (size) => {
    if (!product || !product.variants || !Array.isArray(product.variants)) return [];
    return [...new Set(product.variants
      .filter(v => v.size === size)
      .map(v => v.color))];
  };
  
  // Check if current variant is in stock
  const isVariantInStock = () => {
    if (!product || !selectedSize || !selectedColor || !product.variants) return false;
    
    const variant = product.variants.find(
      v => v.size === selectedSize && v.color === selectedColor
    );
    
    return variant && variant.stock > 0;
  };
  
  // Get current variant stock quantity
  const getVariantStock = () => {
    if (!product || !selectedSize || !selectedColor || !product.variants) return 0;
    
    const variant = product.variants.find(
      v => v.size === selectedSize && v.color === selectedColor
    );
    
    return variant ? variant.stock : 0;
  };
  
  // Handle size change
  const handleSizeChange = (size) => {
    setSelectedSize(size);
    
    const availableColors = getColors(size);
    if (!availableColors.includes(selectedColor) && availableColors.length > 0) {
      setSelectedColor(availableColors[0]);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!isVariantInStock()) return;
    
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedToCart(true);
    
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };
  
  // Handle buy now
  const handleBuyNow = () => {
    if (!isVariantInStock()) return;
    
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/cart');
  };
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Product not found" />;
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            <img 
              src={mainImage || (product.imageURLs && product.imageURLs.length > 0 ? product.imageURLs[0] : 'https://via.placeholder.com/500')} 
              alt={product.name} 
              className="w-full h-96 object-contain"
            />
          </div>
          
          {/* Image Thumbnails */}
          {product.imageURLs && product.imageURLs.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto py-2">
              {product.imageURLs.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-20 h-20 border-2 rounded overflow-hidden ${
                    mainImage === img ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          {/* Category Badge */}
          <div className="mb-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {product.category === 'fan' ? 'Fan' : 'Air Conditioner'}
            </span>
          </div>
          
          {/* Product Name */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          {/* Price */}
          <p className="text-2xl font-bold text-gray-900 mb-4">${product.price.toFixed(2)}</p>
          
          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          {/* Variant Selection */}
          <div className="space-y-6 mb-6">
            {/* Size Selection */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-900 mb-2">Size</h2>
                <div className="flex flex-wrap gap-2">
                  {getSizes().map(size => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      className={`px-4 py-2 rounded-md border ${
                        selectedSize === size
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Color Selection */}
            {product.variants && product.variants.length > 0 && selectedSize && (
              <div>
                <h2 className="text-sm font-medium text-gray-900 mb-2">Color</h2>
                <div className="flex flex-wrap gap-2">
                  {getColors(selectedSize).map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`p-0.5 rounded-full ${
                        selectedColor === color ? 'ring-2 ring-blue-600' : ''
                      }`}
                      title={color}
                    >
                      <div 
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{ 
                          backgroundColor: color.toLowerCase(),
                          borderColor: color.toLowerCase() === 'white' ? '#d1d5db' : 'transparent'
                        }}
                      ></div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity Selection */}
            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-2">Quantity</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1 border border-gray-300 rounded-md"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => Math.min(getVariantStock(), prev + 1))}
                  className="px-3 py-1 border border-gray-300 rounded-md"
                  disabled={quantity >= getVariantStock()}
                >
                  +
                </button>
                {isVariantInStock() && (
                  <span className="text-sm text-gray-500">
                    {getVariantStock()} in stock
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Stock Status */}
          {product.variants && product.variants.length > 0 && !isVariantInStock() && (
            <div className="mb-4">
              <p className="text-red-600 font-semibold">
                This variant is out of stock. Please select a different size or color.
              </p>
            </div>
          )}
          
          {/* Added to Cart Notification */}
          {addedToCart && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
              Product added to cart successfully!
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={!isVariantInStock()}
              className={`px-6 py-3 rounded-md ${
                isVariantInStock()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } flex-1`}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!isVariantInStock()}
              className={`px-6 py-3 rounded-md ${
                isVariantInStock()
                  ? 'bg-gray-800 text-white hover:bg-gray-900'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } flex-1`}
            >
              Buy Now
            </button>
          </div>
          
          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Features</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Specifications</h2>
              <div className="bg-gray-50 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 w-1/3">{key}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductView;