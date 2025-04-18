// src/pages/rider/AssignedOrders.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useOrders from '../../hooks/useOrders';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const AssignedOrders = () => {
  const { fetchRiderOrders, orders, loading, error, getOrderStatusInfo } = useOrders();
  const [filterStatus, setFilterStatus] = useState('');

  // Fetch rider's assigned orders on component mount
  useEffect(() => {
    fetchRiderOrders();
  }, [fetchRiderOrders]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter orders by status
  const filteredOrders = filterStatus
    ? orders.filter(order => order.orderStatus === filterStatus)
    : orders;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Assigned Orders</h1>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Orders</option>
              <option value="Shipped">Pending Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Undelivered">Undelivered</option>
            </select>
          </div>
          <button
            onClick={() => fetchRiderOrders()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <svg
            className="h-12 w-12 text-gray-400 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h2 className="text-xl font-medium text-gray-900 mb-2">No orders found</h2>
          <p className="text-gray-500 mb-6">
            {filterStatus
              ? `You don't have any ${filterStatus.toLowerCase()} orders.`
              : 'You don\'t have any orders assigned to you yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {filteredOrders.map((order) => {
              const statusInfo = getOrderStatusInfo(order.orderStatus);
              
              return (
                <li key={order._id}>
                  <Link to={`/rider/orders/${order._id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`mr-3 flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                            order.orderStatus === 'Shipped' ? 'bg-indigo-100 text-indigo-600' :
                            order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-600' :
                            'bg-orange-100 text-orange-600'
                          }`}>
                            {order.orderStatus === 'Shipped' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                              </svg>
                            )}
                            {order.orderStatus === 'Delivered' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {order.orderStatus === 'Undelivered' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-600">Order #{order._id.substring(0, 8)}...</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.colorClass}`}>
                            {statusInfo.text}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {order.shippingAddress?.name || 'N/A'}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {order.shippingAddress?.city}, {order.shippingAddress?.state}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            ${order.totalAmount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      {order.orderStatus === 'Shipped' && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Needs Delivery
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AssignedOrders;