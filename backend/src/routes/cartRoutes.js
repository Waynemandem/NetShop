/**
 * Cart Routes
 * ========================================
 */

const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  applyCoupon,
} = require('../controllers/cartController');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeFromCart);
router.delete('/', clearCart);
router.post('/coupon', applyCoupon);

module.exports = router;
