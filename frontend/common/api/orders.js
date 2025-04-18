// common/api/orders.js
import apiClient from './index';

// Customer: Get my orders
export const getMyOrders = async () => {
  try {
    const response = await apiClient.get('/orders/my-orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching my orders:', error);
    throw error;
  }
};

// Customer: Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get a single order by ID (customer, admin, or rider depending on permissions)
export const getOrderById = async (orderId) => {
  try {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with ID ${orderId}:`, error);
    throw error;
  }
};

// Admin: Get all orders
export const getAllOrders = async () => {
  try {
    const response = await apiClient.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

// Admin: Update order status
export const updateOrderStatus = async (orderId, orderStatus, assignedRider = null) => {
  try {
    const data = { orderStatus };
    
    if (assignedRider) {
      data.assignedRider = assignedRider;
    }
    
    const response = await apiClient.put(`/orders/${orderId}/status`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating status for order ID ${orderId}:`, error);
    throw error;
  }
};

// Rider: Get assigned orders
export const getRiderOrders = async () => {
  try {
    const response = await apiClient.get('/rider/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching rider orders:', error);
    throw error;
  }
};

// Rider: Update delivery status
export const updateDeliveryStatus = async (orderId, orderStatus, deliveryNotes = '') => {
  try {
    const data = { 
      orderStatus,
      deliveryNotes
    };
    
    const response = await apiClient.put(`/rider/orders/${orderId}/delivery`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating delivery status for order ID ${orderId}:`, error);
    throw error;
  }
};

export default {
  getMyOrders,
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getRiderOrders,
  updateDeliveryStatus
};