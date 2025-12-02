/**
 * useCart Hook
 * Manages shopping cart state and provides cart methods to components
 * Handles loading/error states and cart totals calculations from backend
 */

import { useState, useCallback, useEffect } from 'react';
import * as cartService from '../services/cartService';

export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 0,
  });

  /**
   * Fetch cart from backend
   */
  const getCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.getCart();
      setCart(response.data);
      setItems(response.data.items || []);
      setTotals({
        subtotal: response.data.subtotal || 0,
        discountAmount: response.data.discountAmount || 0,
        taxAmount: response.data.taxAmount || 0,
        totalAmount: response.data.totalAmount || 0,
      });
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch cart';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add item to cart
   */
  const addToCart = useCallback(async (productId, quantity = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.addToCart({ productId, quantity });
      setCart(response.data);
      setItems(response.data.items || []);
      setTotals({
        subtotal: response.data.subtotal || 0,
        discountAmount: response.data.discountAmount || 0,
        taxAmount: response.data.taxAmount || 0,
        totalAmount: response.data.totalAmount || 0,
      });
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to add item to cart';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update item quantity in cart
   */
  const updateCartItem = useCallback(async (itemId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      setCart(response.data);
      setItems(response.data.items || []);
      setTotals({
        subtotal: response.data.subtotal || 0,
        discountAmount: response.data.discountAmount || 0,
        taxAmount: response.data.taxAmount || 0,
        totalAmount: response.data.totalAmount || 0,
      });
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Remove item from cart
   */
  const removeFromCart = useCallback(async (itemId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.removeFromCart(itemId);
      setCart(response.data);
      setItems(response.data.items || []);
      setTotals({
        subtotal: response.data.subtotal || 0,
        discountAmount: response.data.discountAmount || 0,
        taxAmount: response.data.taxAmount || 0,
        totalAmount: response.data.totalAmount || 0,
      });
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to remove item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.clearCart();
      setCart(response.data);
      setItems([]);
      setTotals({
        subtotal: 0,
        discountAmount: 0,
        taxAmount: 0,
        totalAmount: 0,
      });
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to clear cart';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Apply coupon code
   */
  const applyCoupon = useCallback(async (couponCode) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.applyCoupon(couponCode);
      setCart(response.data);
      setTotals({
        subtotal: response.data.subtotal || 0,
        discountAmount: response.data.discountAmount || 0,
        taxAmount: response.data.taxAmount || 0,
        totalAmount: response.data.totalAmount || 0,
      });
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to apply coupon';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get cart count
   */
  const getCartCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    cart,
    items,
    loading,
    error,
    totals,

    // Methods
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    getCartCount,
    clearError,
  };
};

export default useCart;
