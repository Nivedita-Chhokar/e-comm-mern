// src/pages/rider/RiderDashboard.js
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Link } from 'react-router-dom';

const RiderDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRiderStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/rider/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching rider stats:', err);
        setError('Failed to load rider statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchRiderStats();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!stats) return <ErrorMessage message="No data available" />;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Rider Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Assigned</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.stats.totalAssigned}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Deliveries</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.stats.pendingDeliveries}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Delivered</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.stats.deliveredOrders}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Undelivered</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.stats.undeliveredOrders}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
          <Link
            to="/rider/orders"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            View All Orders
          </Link>
        </div>
        <ul className="divide-y divide-gray-200">
          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            stats.recentOrders.map((order) => (
              <li key={order._id}>
                <Link to={`/rider/orders/${order._id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">Order #{order._id.substring(0, 8)}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.orderStatus === 'Shipped' ? 'bg-indigo-100 text-indigo-800' : 
                            order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 
                            order.orderStatus === 'Undelivered' ? 'bg-orange-100 text-orange-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {order.orderStatus}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {order.shippingAddress?.name || 'N/A'}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          {order.shippingAddress?.city}, {order.shippingAddress?.state}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {new Date(order.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 sm:px-6 text-center text-gray-500">No orders assigned</li>
          )}
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="px-4 py-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/rider/orders"
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Manage Deliveries
            </Link>
            <Link
              to="/rider/profile"
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;