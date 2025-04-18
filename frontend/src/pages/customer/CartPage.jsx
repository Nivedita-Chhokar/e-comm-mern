// src/pages/customer/CartPage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { currentUser, isAdmin, isRider } = useAuth();
  const navigate = useNavigate();
  
  // Calculate cart totals
  const subtotal = getCartTotal();
  const shippingFee = subtotal > 0 ? 10 : 0; // Example shipping calculation
  const total = subtotal + shippingFee;
  
  // Handle proceed to checkout
  const handleCheckout = () => {
    if (!currentUser) {
      // Redirect to login if not logged in
      navigate('/login');
    } else if (isAdmin() || isRider()) {
      // Admin and riders cannot checkout
      alert('Admins and riders cannot place orders. Please use a customer account.');
    } else {
      // Proceed to checkout
      navigate('/checkout');
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item, index) => (
                  <li key={index} className="p-4 sm:p-6 flex flex-col sm:flex-row">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-grow sm:ml-6">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link to={`/products/${item.productId}`} className="hover:text-blue-600">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="text-lg font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="mt-1 text-sm text-gray-500">
                        <p>Size: {item.size}</p>
                        <p>Color: {item.color}</p>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        {/* Quantity Controls */}
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              {/* Actions */}
              <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-between">
                <button
                  onClick={() => clearCart()}
                  className="text-red-600 hover:text-red-800"
                >
                  Clear Cart
                </button>
                <Link
                  to="/products"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="text-gray-900">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="text-gray-900">${shippingFee.toFixed(2)}</p>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <p className="text-lg font-medium text-gray-900">Total</p>
                  <p className="text-lg font-medium text-gray-900">${total.toFixed(2)}</p>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className={`w-full mt-6 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                  cartItems.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Proceed to Checkout
              </button>
              
              {!currentUser && (
                <p className="mt-2 text-sm text-gray-500 text-center">
                  You'll need to log in before checkout
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;