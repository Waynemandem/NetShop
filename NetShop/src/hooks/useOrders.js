/**
 * useOrders Hook
 * Manages order state and provides order-related methods to components
 * Handles loading/error states for order operations
 */

import { useState, useCallback } from 'react';
import * as orderService from '../services/orderService';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  /**
   * Get user's orders
   */
  const getOrders = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrders(options);
      setOrders(response.data.orders || []);
      setPagination(response.data.pagination || {});
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch orders';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get single order details
   */
  const getOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrder(orderId);
      setCurrentOrder(response.data);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch order';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new order
   */
  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.createOrder(orderData);
      setCurrentOrder(response.data);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create order';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cancel order
   */
  const cancelOrder = useCallback(async (orderId, reason = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.cancelOrder(orderId, reason);
      setOrders(orders.map(o => o._id === orderId ? response.data : o));
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder(response.data);
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to cancel order';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [orders, currentOrder]);

  /**
   * Get orders by status
   */
  const getOrdersByStatus = useCallback(async (status, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrders({ status, page });
      setOrders(response.data.orders || []);
      setPagination(response.data.pagination || {});
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch orders';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get all orders (Admin only)
   */
  const getAllOrders = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getAllOrders(options);
      setOrders(response.data.orders || []);
      setPagination(response.data.pagination || {});
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch orders';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update order status (Admin only)
   */
  const updateOrderStatus = useCallback(async (orderId, status, notes = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.updateOrderStatus(orderId, status, notes);
      setOrders(orders.map(o => o._id === orderId ? response.data : o));
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder(response.data);
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update order status';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [orders, currentOrder]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    orders,
    currentOrder,
    loading,
    error,
    pagination,

    // Methods
    getOrders,
    getOrder,
    createOrder,
    cancelOrder,
    getOrdersByStatus,
    getAllOrders,
    updateOrderStatus,
    clearError,
  };
};

export default useOrders;
