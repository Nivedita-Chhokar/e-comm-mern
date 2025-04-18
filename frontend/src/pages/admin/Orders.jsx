import React, { useEffect, useState } from 'react';
import useOrders from '../../hooks/useOrders';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

const Orders = () => {
  const { fetchAllOrders, orders, loading, error, changeOrderStatus, getOrderStatusInfo } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [selectedRider, setSelectedRider] = useState('');
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        setLoadingRiders(true);
        const response = await api.get('/admin/riders');
        setRiders(response.data);
      } catch (err) {
        console.error('Error fetching riders:', err);
      } finally {
        setLoadingRiders(false);
      }
    };

    fetchRiders();
  }, []);

  // Filter orders by status
  const filteredOrders = statusFilter
    ? orders.filter(order => order.orderStatus === statusFilter)
    : orders;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    
    if (!newStatus) {
      setUpdateError('Please select a status');
      return;
    }

    if (newStatus === 'Shipped' && !selectedRider) {
      setUpdateError('Please assign a rider for shipping');
      return;
    }

    try {
      setUpdatingStatus(true);
      setUpdateError(null);
      
      await changeOrderStatus(
        selectedOrder._id, 
        newStatus, 
        newStatus === 'Shipped' ? selectedRider : null
      );
      
      setShowModal(false);
      setSelectedOrder(null);
      setNewStatus('');
      setSelectedRider('');
      
      fetchAllOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
      setUpdateError(err.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus); 
    setSelectedRider(order.assignedRider || '');
    setUpdateError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setNewStatus('');
    setSelectedRider('');
    setUpdateError(null);
  };

  const renderTableHead = () => (
    <thead className="bg-gray-50">
      <tr>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Order ID
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Date
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Customer
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Total
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Rider
        </th>
        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  );

  const renderStatusModal = () => (
    <div className={`fixed inset-0 overflow-y-auto z-50 ${showModal ? '' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true" 
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Update Order Status
                </h3>
                
                {/* Error message */}
                {updateError && (
                  <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {updateError}
                  </div>
                )}
                
                <form onSubmit={handleStatusUpdate}>
                  {/* Order details summary */}
                  <div className="mb-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Order:</span> #{selectedOrder?._id.substring(0, 8)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Current Status:</span> {selectedOrder?.orderStatus}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Customer:</span> {selectedOrder?.shippingAddress?.name}
                    </p>
                  </div>
                  
                  {/* Status selection */}
                  <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      New Status
                    </label>
                    <select
                      id="status"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="">Select status</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  {/* Rider selection (only for Shipped status) */}
                  {newStatus === 'Shipped' && (
                    <div className="mb-4">
                      <label htmlFor="rider" className="block text-sm font-medium text-gray-700 mb-1">
                        Assign Rider
                      </label>
                      <select
                        id="rider"
                        value={selectedRider}
                        onChange={(e) => setSelectedRider(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        required
                      >
                        <option value="">Select rider</option>
                        {loadingRiders ? (
                          <option value="" disabled>Loading riders...</option>
                        ) : (
                          riders.map(rider => (
                            <option key={rider._id} value={rider.firebaseUID}>
                              {rider.displayName}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={updatingStatus}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {updatingStatus ? 'Updating...' : 'Update Status'}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Orders</h1>
      
      {/* Filters Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Undelivered">Undelivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <button
            onClick={fetchAllOrders}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {/* Orders Table */}
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">No orders found</h2>
          <p className="text-gray-600">
            {statusFilter
              ? `There are no orders with status "${statusFilter}"`
              : 'There are no orders in the system yet'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {renderTableHead()}
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map(order => {
                  const statusInfo = getOrderStatusInfo(order.orderStatus);
                  
                  let assignedRiderName = "None";
                  if (order.assignedRider) {
                    const rider = riders.find(r => r.firebaseUID === order.assignedRider);
                    assignedRiderName = rider ? rider.displayName : "Assigned";
                  }
                  
                  return (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        #{order._id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.shippingAddress?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.colorClass}`}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.assignedRider ? (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                            {assignedRiderName}
                          </span>
                        ) : (
                          <span className="text-gray-400">
                            None
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openStatusModal(order)}
                            className="text-blue-600 hover:text-blue-900"
                            disabled={['Delivered', 'Undelivered'].includes(order.orderStatus)}
                          >
                            Update Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Status Update Modal */}
      {showModal && renderStatusModal()}
    </div>
  );
};

export default Orders;