import { useState, useCallback } from 'react';
import { 
  getAllOrders, 
  getOrderById, 
  getMyOrders, 
  updateOrderStatus,
  updateDeliveryStatus,
  getRiderOrders
} from '../services/orderService';

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all orders (admin only)
  const fetchAllOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllOrders();
      setOrders(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch order by ID
  const fetchOrderById = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrderById(orderId);
      setCurrentOrder(data);
      return data;
    } catch (err) {
      setError(err.message || `Failed to fetch order ${orderId}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch current user's orders
  const fetchMyOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyOrders();
      setOrders(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch your orders');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const changeOrderStatus = useCallback(async (orderId, status, riderId = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedOrder = await updateOrderStatus(orderId, status, riderId);
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? updatedOrder : order
        )
      );

      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder(updatedOrder);
      }
      
      return updatedOrder;
    } catch (err) {
      setError(err.message || `Failed to update order status for ${orderId}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentOrder]);

  // Rider: Update delivery status
  const changeDeliveryStatus = useCallback(async (orderId, status, notes = '') => {
    try {
      setLoading(true);
      setError(null);
      const updatedOrder = await updateDeliveryStatus(orderId, status, notes);
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? updatedOrder : order
        )
      );
      
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder(updatedOrder);
      }
      
      return updatedOrder;
    } catch (err) {
      setError(err.message || `Failed to update delivery status for ${orderId}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentOrder]);

  // Rider: Fetch assigned orders
  const fetchRiderOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRiderOrders();
      setOrders(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch assigned orders');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get order status text with appropriate color class
  const getOrderStatusInfo = (status) => {
    switch (status) {
      case 'Pending':
        return { text: 'Pending', colorClass: 'bg-yellow-100 text-yellow-800' };
      case 'Processing':
        return { text: 'Processing', colorClass: 'bg-blue-100 text-blue-800' };
      case 'Shipped':
        return { text: 'Shipped', colorClass: 'bg-indigo-100 text-indigo-800' };
      case 'Delivered':
        return { text: 'Delivered', colorClass: 'bg-green-100 text-green-800' };
      case 'Undelivered':
        return { text: 'Undelivered', colorClass: 'bg-orange-100 text-orange-800' };
      case 'Cancelled':
        return { text: 'Cancelled', colorClass: 'bg-red-100 text-red-800' };
      default:
        return { text: status, colorClass: 'bg-gray-100 text-gray-800' };
    }
  };

  return {
    orders,
    currentOrder,
    loading,
    error,
    fetchAllOrders,
    fetchOrderById,
    fetchMyOrders,
    changeOrderStatus,
    changeDeliveryStatus,
    fetchRiderOrders,
    getOrderStatusInfo
  };
};

export default useOrders;