import api from './api';

export const getAllOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with ID ${orderId}:`, error);
    throw error;
  }
};

export const getMyOrders = async () => {
  try {
    const response = await api.get('/orders/my-orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, orderStatus, assignedRider = null) => {
  try {
    const data = { orderStatus };
    
    if (assignedRider) {
      data.assignedRider = assignedRider;
    }
    
    const response = await api.put(`/orders/${orderId}/status`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating order status for ID ${orderId}:`, error);
    throw error;
  }
};

// Rider: Update delivery status
export const updateDeliveryStatus = async (orderId, orderStatus, deliveryNotes = '') => {
  try {
    const data = { orderStatus };
    if (deliveryNotes) {
      data.deliveryNotes = deliveryNotes;
    }
    
    const response = await api.put(`/orders/${orderId}/delivery`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating delivery status for order ID ${orderId}:`, error);
    throw error;
  }
};

export const getRiderOrders = async () => {
  try {
    const response = await api.get('/orders/rider/assigned');
    return response.data;
  } catch (error) {
    console.error('Error fetching rider assigned orders:', error);
    throw error;
  }
};