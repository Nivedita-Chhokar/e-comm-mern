// common/api/users.js
import apiClient from './index';

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Admin: Get all users
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

// Admin: Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error;
  }
};

// Admin: Update user role
export const updateUserRole = async (userId, role) => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error(`Error updating role for user ID ${userId}:`, error);
    throw error;
  }
};

// Admin: Toggle user status (activate/deactivate)
export const toggleUserStatus = async (userId) => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error(`Error toggling status for user ID ${userId}:`, error);
    throw error;
  }
};

// Admin: Get all riders
export const getAllRiders = async () => {
  try {
    const response = await apiClient.get('/admin/riders');
    return response.data;
  } catch (error) {
    console.error('Error fetching all riders:', error);
    throw error;
  }
};

// Admin: Get approved emails
export const getApprovedEmails = async () => {
  try {
    const response = await apiClient.get('/admin/approved-emails');
    return response.data;
  } catch (error) {
    console.error('Error fetching approved emails:', error);
    throw error;
  }
};

// Admin: Create approved email
export const createApprovedEmail = async (email, role) => {
  try {
    const response = await apiClient.post('/admin/approved-emails', { email, role });
    return response.data;
  } catch (error) {
    console.error('Error creating approved email:', error);
    throw error;
  }
};

// Admin: Delete approved email
export const deleteApprovedEmail = async (emailId) => {
  try {
    const response = await apiClient.delete(`/admin/approved-emails/${emailId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting approved email with ID ${emailId}:`, error);
    throw error;
  }
};

// Admin: Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    throw error;
  }
};

// Rider: Get rider profile
export const getRiderProfile = async () => {
  try {
    const response = await apiClient.get('/rider/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching rider profile:', error);
    throw error;
  }
};

// Rider: Update rider profile
export const updateRiderProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/rider/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating rider profile:', error);
    throw error;
  }
};

// Rider: Get rider statistics
export const getRiderStats = async () => {
  try {
    const response = await apiClient.get('/rider/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching rider statistics:', error);
    throw error;
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  getAllRiders,
  getApprovedEmails,
  createApprovedEmail,
  deleteApprovedEmail,
  getDashboardStats,
  getRiderProfile,
  updateRiderProfile,
  getRiderStats
};