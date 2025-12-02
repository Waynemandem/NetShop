/**
 * Complete Example: CartPageComponent.jsx
 * 
 * This component demonstrates how to:
 * - Display shopping cart items
 * - Update quantities
 * - Remove items
 * - Display calculated totals from backend
 * - Proceed to checkout
 */

import React, { useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

export const CartPageComponent = () => {
  const { isAuthenticated } = useAuth();
  const {
    items,
    totals,
    loading,
    error,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    getCartCount,
  } = useCart();

  // Load cart on component mount
  useEffect(() => {
    if (isAuthenticated) {
      getCart();
    }
  }, [isAuthenticated]);

  // Handle quantity change
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await handleRemoveItem(itemId);
      return;
    }
    
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      alert('Error updating quantity: ' + error.message);
    }
  };

  // Handle item removal
  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      alert('Item removed from cart');
    } catch (error) {
      alert('Error removing item: ' + error.message);
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
        alert('Cart cleared');
      } catch (error) {
        alert('Error clearing cart: ' + error.message);
      }
    }
  };

  // Handle apply coupon
  const handleApplyCoupon = async () => {
    const couponCode = prompt('Enter coupon code:');
    if (couponCode) {
      try {
        await applyCoupon(couponCode);
        alert('Coupon applied!');
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Cart is empty');
      return;
    }
    window.location.href = '/checkout';
  };

  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <p>Please log in to view your cart</p>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Empty Cart Message */}
      {items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <a href="/shop" className="continue-shopping">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="cart-content">
          {/* Cart Items Table */}
          <div className="cart-items">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id} className="cart-item">
                    <td>
                      <div className="product-name">
                        {item.productId?.images && (
                          <img
                            src={item.productId.images[0]}
                            alt={item.productId.name}
                            className="item-image"
                          />
                        )}
                        <span>{item.productId?.name}</span>
                      </div>
                    </td>
                    <td className="price">
                      ${item.productId?.price.toFixed(2)}
                    </td>
                    <td className="quantity">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="qty-btn"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                        className="qty-input"
                      />
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </td>
                    <td className="subtotal">
                      ${(item.productId?.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="action">
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <div className="summary-box">
              <h3>Order Summary</h3>

              {/* Coupon Section */}
              <div className="coupon-section">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="coupon-input"
                />
                <button onClick={handleApplyCoupon} className="coupon-btn">
                  Apply
                </button>
              </div>

              {/* Totals */}
              <div className="totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>

                {totals.discountAmount > 0 && (
                  <div className="total-row discount">
                    <span>Discount:</span>
                    <span>-${totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="total-row">
                  <span>Tax:</span>
                  <span>${totals.taxAmount.toFixed(2)}</span>
                </div>

                <div className="total-row total">
                  <span>Total:</span>
                  <span className="amount">${totals.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button onClick={handleCheckout} className="checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Actions */}
      {items.length > 0 && (
        <div className="cart-actions">
          <a href="/shop" className="continue-shopping">
            Continue Shopping
          </a>
          <button onClick={handleClearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPageComponent;

/**
 * Example CSS Styles for Cart Page
 * 
 * .cart-page {
 *   max-width: 1200px;
 *   margin: 0 auto;
 *   padding: 20px;
 * }
 * 
 * .empty-cart {
 *   text-align: center;
 *   padding: 40px;
 *   background: #f5f5f5;
 *   border-radius: 8px;
 * }
 * 
 * .cart-content {
 *   display: grid;
 *   grid-template-columns: 1fr 400px;
 *   gap: 20px;
 * }
 * 
 * .items-table {
 *   width: 100%;
 *   border-collapse: collapse;
 * }
 * 
 * .items-table th,
 * .items-table td {
 *   padding: 12px;
 *   text-align: left;
 *   border-bottom: 1px solid #ddd;
 * }
 * 
 * .summary-box {
 *   background: #f9f9f9;
 *   padding: 20px;
 *   border-radius: 8px;
 *   border: 1px solid #eee;
 * }
 * 
 * .total-row {
 *   display: flex;
 *   justify-content: space-between;
 *   margin: 10px 0;
 * }
 * 
 * .total-row.total {
 *   font-weight: bold;
 *   font-size: 18px;
 *   border-top: 2px solid #ddd;
 *   padding-top: 10px;
 * }
 * 
 * .checkout-btn {
 *   width: 100%;
 *   padding: 12px;
 *   background: #007bff;
 *   color: white;
 *   border: none;
 *   border-radius: 4px;
 *   cursor: pointer;
 *   margin-top: 20px;
 * }
 */
