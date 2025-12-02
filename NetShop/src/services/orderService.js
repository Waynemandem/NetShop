/**
 * Order Service
 * Handles all order-related API calls
 */

import { apiGet, apiPost, apiPut } from './api';

/**
 * Create new order from cart
 * @param {Object} orderData - Order data
 * @param {string} orderData.shippingAddress - Full shipping address
 * @param {string} orderData.billingAddress - Full billing address (optional)
 * @param {string} orderData.paymentMethod - Payment method (e.g., 'credit_card')
 * @returns {Promise<Object>} Created order with order number
 */
export const createOrder = async (orderData) => {
  const response = await apiPost('/orders', orderData, true);
  return response;
};

/**
 * Get user's orders
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 10)
 * @param {string} options.status - Filter by status (pending, confirmed, processing, shipped, delivered, cancelled)
 * @returns {Promise<Object>} User's orders with pagination
 */
export const getOrders = async (options = {}) => {
  const { page = 1, limit = 10, status = '' } = options;

  const queryParams = new URLSearchParams({
    page,
    limit,
    ...(status && { status }),
  });

  const response = await apiGet(`/orders?${queryParams}`, true);
  return response;
};

/**
 * Get single order details
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order details with items, totals, and status
 */
export const getOrder = async (orderId) => {
  const response = await apiGet(`/orders/${orderId}`, true);
  return response;
};

/**
 * Cancel an order
 * Restores product stock and updates order status
 * Only works for pending/confirmed orders
 * @param {string} orderId - Order ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} Updated order
 */
export const cancelOrder = async (orderId, reason = '') => {
  const response = await apiPut(`/orders/${orderId}/cancel`, { reason }, true);
  return response;
};

/**
 * Update order status (Admin only)
 * @param {string} orderId - Order ID
 * @param {string} status - New status (confirmed, processing, shipped, delivered, cancelled)
 * @param {string} notes - Optional status update notes
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (orderId, status, notes = '') => {
  const response = await apiPut(
    `/orders/${orderId}/status`,
    { status, notes },
    true
  );
  return response;
};

/**
 * Update order payment status (Admin only)
 * @param {string} orderId - Order ID
 * @param {string} paymentStatus - Payment status (pending, paid, failed, refunded)
 * @param {string} transactionId - Transaction ID from payment gateway
 * @returns {Promise<Object>} Updated order
 */
export const updatePaymentStatus = async (orderId, paymentStatus, transactionId = '') => {
  const response = await apiPut(
    `/orders/${orderId}/payment`,
    { paymentStatus, transactionId },
    true
  );
  return response;
};

/**
 * Get all orders (Admin dashboard)
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {string} options.status - Filter by status
 * @param {string} options.userId - Filter by user ID
 * @returns {Promise<Object>} All orders (admin view)
 */
export const getAllOrders = async (options = {}) => {
  const { page = 1, limit = 10, status = '', userId = '' } = options;

  const queryParams = new URLSearchParams({
    page,
    limit,
    ...(status && { status }),
    ...(userId && { userId }),
  });

  const response = await apiGet(`/orders/admin/all?${queryParams}`, true);
  return response;
};

/**
 * Get order by order number
 * @param {string} orderNumber - Order number (e.g., "ORD-2024-001")
 * @returns {Promise<Object>} Order details
 */
export const getOrderByNumber = async (orderNumber) => {
  const response = await apiGet(`/orders/number/${orderNumber}`, true);
  return response;
};

/**
 * Get user's order history with status counts
 * @returns {Promise<Object>} Order summary
 */
export const getOrderHistory = async () => {
  return getOrders({ limit: 100 });
};

export default {
  createOrder,
  getOrders,
  getOrder,
  cancelOrder,
  updateOrderStatus,
  updatePaymentStatus,
  getAllOrders,
  getOrderByNumber,
  getOrderHistory,
};
