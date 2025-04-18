import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useOrders from '../../hooks/useOrders';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const OrderHistory = () => {
  const location = useLocation();
  const { fetchMyOrders, orders, loading, error, getOrderStatusInfo } = useOrders();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get('success') === 'true';
    const orderId = queryParams.get('orderId');
    
    if (success && orderId) {
      setShowSuccess(true);
      setSuccessOrderId(orderId);
      
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setSuccessOrderId(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderOrderItems = (items) => {
    return items.map(item => (
      `${item.quantity}x ${item.productId?.name || 'Product'} (${item.size}, ${item.color})`
    )).join(', ');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>
      
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6" role="alert">
          <p className="font-bold">Order Placed Successfully!</p>
          <p>Your order has been received and is now being processed. Order ID: {successOrderId}</p>
        </div>
      )}
      
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">No orders found</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => {
                  const statusInfo = getOrderStatusInfo(order.orderStatus);
                  
                  return (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {order._id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.colorClass}`}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                        {order.items && order.items.length > 0 
                          ? renderOrderItems(order.items)
                          : 'No items'
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;