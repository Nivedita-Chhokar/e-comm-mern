// src/pages/customer/Checkout.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    name: currentUser?.displayName || '',
    street: currentUser?.address?.street || '',
    city: currentUser?.address?.city || '',
    state: currentUser?.address?.state || '',
    zipCode: currentUser?.address?.zipCode || '',
    country: currentUser?.address?.country || 'USA',
    phone: currentUser?.phone || '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  
  // Calculate totals
  const subtotal = getCartTotal();
  const shippingFee = 10; // Fixed shipping fee
  const total = subtotal + shippingFee;
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    });
  };
  
  // Validate form
  const validateForm = () => {
    const requiredFields = ['name', 'street', 'city', 'state', 'zipCode', 'country', 'phone'];
    for (const field of requiredFields) {
      if (!shippingInfo[field]) {
        setError(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };
  
  // Handle order submission
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
        })),
        totalAmount: total,
        shippingAddress: shippingInfo,
        paymentMethod,
      };
      
      // Send order to backend
      const response = await api.post('/orders', orderData);
      
      // Clear cart on successful order
      clearCart();
      
      // Redirect to success page
      navigate(`/orders?success=true&orderId=${response.data._id}`);
      
    } catch (err) {
      console.error('Order submission error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {cartItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">You cannot proceed to checkout with an empty cart.</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={shippingInfo.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      id="street"
                      value={shippingInfo.street}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                      ZIP / Postal Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      id="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      id="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="p-6 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="credit-card"
                      name="payment-method"
                      type="radio"
                      checked={paymentMethod === 'Credit Card'}
                      onChange={() => setPaymentMethod('Credit Card')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                      Credit Card
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="paypal"
                      name="payment-method"
                      type="radio"
                      checked={paymentMethod === 'PayPal'}
                      onChange={() => setPaymentMethod('PayPal')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                      PayPal
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="cash"
                      name="payment-method"
                      type="radio"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="cash" className="ml-3 block text-sm font-medium text-gray-700">
                      Cash on Delivery
                    </label>
                  </div>
                </div>
                
                <p className="mt-4 text-sm text-gray-500">
                  Note: This is a demo checkout. No actual payment will be processed.
                </p>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {/* Product List */}
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <li key={index} className="py-2 flex justify-between">
                      <div>
                        <p className="text-gray-700">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.size}, {item.color} x {item.quantity}
                        </p>
                      </div>
                      <p className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
                
                {/* Totals */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="text-gray-900">${subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-gray-600">Shipping</p>
                    <p className="text-gray-900">${shippingFee.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between mt-4 font-bold">
                    <p className="text-gray-900">Total</p>
                    <p className="text-gray-900">${total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;