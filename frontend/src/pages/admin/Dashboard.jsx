import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!stats) return <ErrorMessage message="No data available" />;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Orders Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.orders.total}</dd>
            </dl>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Pending</span>
                <span className="font-medium text-gray-900">{stats.orders.pending}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Processing</span>
                <span className="font-medium text-gray-900">{stats.orders.processing}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipped</span>
                <span className="font-medium text-gray-900">{stats.orders.shipped}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivered</span>
                <span className="font-medium text-gray-900">{stats.orders.delivered}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Users Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.users.total}</dd>
            </dl>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Customers</span>
                <span className="font-medium text-gray-900">{stats.users.customers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Riders</span>
                <span className="font-medium text-gray-900">{stats.users.riders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Admins</span>
                <span className="font-medium text-gray-900">{stats.users.admins}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Stats (Placeholder) */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">$9,850</dd>
            </dl>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">This Week</span>
                <span className="font-medium text-gray-900">$1,250</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">This Month</span>
                <span className="font-medium text-gray-900">$5,480</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Stats (Placeholder) */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">12</dd>
            </dl>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Fans</span>
                <span className="font-medium text-gray-900">7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Air Conditioners</span>
                <span className="font-medium text-gray-900">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            stats.recentOrders.map((order) => (
              <li key={order._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">Order #{order._id.substring(0, 8)}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                          order.orderStatus === 'Shipped' ? 'bg-indigo-100 text-indigo-800' : 
                          order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 
                          order.orderStatus === 'Undelivered' ? 'bg-orange-100 text-orange-800' : 
                          order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {order.orderStatus}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <span>Total: ${order.totalAmount.toFixed(2)}</span>
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <span>
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 sm:px-6 text-center text-gray-500">No recent orders</li>
          )}
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="px-4 py-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/admin/orders"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              View All Orders
            </a>
            <a
              href="/admin/users"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Manage Users
            </a>
            <a
              href="/admin/approved-emails"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              Approved Emails
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;