/**
 * Cart Service
 * Handles all shopping cart-related API calls
 */

import { apiGet, apiPost, apiPut, apiDelete } from './api';

/**
 * Get user's shopping cart
 * @returns {Promise<Object>} Cart data with items and totals
 */
export const getCart = async () => {
  const response = await apiGet('/cart', true);
  return response;
};

/**
 * Add item to cart
 * @param {Object} itemData - Item to add
 * @param {string} itemData.productId - Product ID
 * @param {number} itemData.quantity - Quantity to add
 * @returns {Promise<Object>} Updated cart
 */
export const addToCart = async (itemData) => {
  const response = await apiPost('/cart', itemData, true);
  return response;
};

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated cart
 */
export const updateCartItem = async (itemId, quantity) => {
  const response = await apiPut(`/cart/${itemId}`, { quantity }, true);
  return response;
};

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 * @returns {Promise<Object>} Updated cart
 */
export const removeFromCart = async (itemId) => {
  const response = await apiDelete(`/cart/${itemId}`, true);
  return response;
};

/**
 * Clear entire cart
 * @returns {Promise<Object>} Empty cart
 */
export const clearCart = async () => {
  const response = await apiDelete('/cart', true);
  return response;
};

/**
 * Apply coupon code to cart
 * @param {string} couponCode - Coupon code to apply
 * @returns {Promise<Object>} Updated cart with discount applied
 */
export const applyCoupon = async (couponCode) => {
  const response = await apiPost('/cart/coupon', { couponCode }, true);
  return response;
};

/**
 * Get cart summary with totals
 * Calculates: subtotal, tax, discount, total
 * This data comes from backend to ensure accuracy
 * @returns {Promise<Object>} Cart summary object
 */
export const getCartSummary = async () => {
  const cartResponse = await getCart();
  if (cartResponse.data) {
    return {
      items: cartResponse.data.items || [],
      subtotal: cartResponse.data.subtotal || 0,
      discountAmount: cartResponse.data.discountAmount || 0,
      taxAmount: cartResponse.data.taxAmount || 0,
      totalAmount: cartResponse.data.totalAmount || 0,
      couponCode: cartResponse.data.couponCode || null,
      couponDiscount: cartResponse.data.couponDiscount || 0,
    };
  }
  return null;
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  getCartSummary,
};
