import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useOrders from '../../hooks/useOrders';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const OrderDelivery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchOrderById, currentOrder, loading, error, changeDeliveryStatus, getOrderStatusInfo } = useOrders();
  
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    fetchOrderById(id);
  }, [fetchOrderById, id]);

  useEffect(() => {
    if (currentOrder && currentOrder.orderStatus === 'Shipped') {
      setDeliveryStatus('Delivered');
    }
  }, [currentOrder]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle delivery status update
  const handleUpdateStatus = async () => {
    if (!deliveryStatus) {
      setUpdateError('Please select a delivery status');
      return;
    }

    try {
      setUpdateLoading(true);
      setUpdateError(null);
      setUpdateSuccess(false);

      await changeDeliveryStatus(id, deliveryStatus, deliveryNotes);
      
      setUpdateSuccess(true);
      
      setDeliveryNotes('');
      
      fetchOrderById(id);
      
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      setUpdateError(err.message || 'Failed to update delivery status');
    } finally {
      setUpdateLoading(false);
    }
  };

  const renderOrderItems = (items) => {
    return items.map((item, index) => (
      <div key={index} className="flex items-center py-3">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <img
            src={item.productId.imageURLs?.[0] || 'https://via.placeholder.com/150'}
            alt={item.productId.name}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-900">{item.productId.name}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {item.size} / {item.color}
          </p>
          <div className="flex justify-between mt-1">
            <p className="text-sm text-gray-500">Qty {item.quantity}</p>
            <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        </div>
      </div>
    ));
  };

  const canUpdate = currentOrder && currentOrder.orderStatus === 'Shipped';

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!currentOrder) return <ErrorMessage message="Order not found" />;

  const statusInfo = getOrderStatusInfo(currentOrder.orderStatus);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        <button
          onClick={() => navigate('/rider/orders')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Orders
        </button>
      </div>

      {/* Order Status Card */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Order #{currentOrder._id.substring(0, 8)}...
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Placed on {formatDate(currentOrder.createdAt)}
            </p>
          </div>
          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.colorClass}`}>
            {statusInfo.text}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer and Shipping Information */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Information</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{currentOrder.shippingAddress?.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{currentOrder.shippingAddress?.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Shipping address</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {currentOrder.shippingAddress?.street}<br />
                    {currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.state} {currentOrder.shippingAddress?.zipCode}<br />
                    {currentOrder.shippingAddress?.country}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Delivery Status Update Form */}
          {canUpdate ? (
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Update Delivery Status</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                {updateError && (
                  <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {updateError}
                  </div>
                )}
                
                {updateSuccess && (
                  <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    Delivery status updated successfully
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Status</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="delivered"
                        name="delivery-status"
                        type="radio"
                        checked={deliveryStatus === 'Delivered'}
                        onChange={() => setDeliveryStatus('Delivered')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="delivered" className="ml-3 block text-sm font-medium text-gray-700">
                        Delivered successfully
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="undelivered"
                        name="delivery-status"
                        type="radio"
                        checked={deliveryStatus === 'Undelivered'}
                        onChange={() => setDeliveryStatus('Undelivered')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="undelivered" className="ml-3 block text-sm font-medium text-gray-700">
                        Could not deliver
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Any notes about the delivery"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <button
                  onClick={handleUpdateStatus}
                  disabled={updateLoading || !deliveryStatus}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {updateLoading ? 'Updating...' : 'Update Delivery Status'}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Delivery Information</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentOrder.orderStatus}</dd>
                  </div>
                  {currentOrder.deliveryNotes && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Notes</dt>
                      <dd className="mt-1 text-sm text-gray-900">{currentOrder.deliveryNotes}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(currentOrder.updatedAt)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>

        {/* Order Items and Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Items</h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <div className="space-y-2 divide-y divide-gray-200">
                  {currentOrder.items && currentOrder.items.length > 0 ? (
                    renderOrderItems(currentOrder.items)
                  ) : (
                    <p className="text-gray-500 text-center py-4">No items found</p>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="flex justify-between text-sm">
                <p className="text-gray-500">Subtotal</p>
                <p className="text-gray-900 font-medium">${currentOrder.totalAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <p className="text-gray-500">Shipping</p>
                <p className="text-gray-900 font-medium">$0.00</p>
              </div>
              <div className="flex justify-between mt-4 text-base">
                <p className="font-medium text-gray-900">Total</p>
                <p className="font-bold text-gray-900">${currentOrder.totalAmount.toFixed(2)}</p>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>Payment Method: {currentOrder.paymentMethod}</p>
                <p>Payment Status: {currentOrder.paymentStatus}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDelivery;