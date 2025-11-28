/**
 * Cart Controller
 * ========================================
 * Shopping cart operations and calculations
 */

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendSuccess, ApiError, handleError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * Get user's cart
 * GET /api/cart
 */
async function getCart(req, res, next) {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart) {
      cart = new Cart({ user: req.user._id });
      await cart.save();
    }

    sendSuccess(res, 200, 'Cart retrieved', cart);
  } catch (error) {
    next(error);
  }
}

/**
 * Add item to cart
 * POST /api/cart/items
 */
async function addToCart(req, res, next) {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return handleError(
        new ApiError(404, 'Product not found'),
        res
      );
    }

    // Check stock
    if (!product.isInStock(quantity)) {
      return handleError(
        new ApiError(409, 'Insufficient stock available'),
        res
      );
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id });
    }

    // Calculate item pricing
    const priceBreakdown = product.getPriceBreakdown();

    // Prepare item
    const newItem = {
      product: productId,
      quantity,
      price: product.price,
      discount: priceBreakdown.discountAmount,
      tax: priceBreakdown.taxAmount,
    };

    // Add item to cart
    cart.addItem(newItem);
    await cart.save();

    // Populate for response
    await cart.populate('items.product');
    logger.info(`✅ Item added to cart: ${product.name}`);

    sendSuccess(res, 200, 'Item added to cart', cart);
  } catch (error) {
    next(error);
  }
}

/**
 * Remove item from cart
 * DELETE /api/cart/items/:productId
 */
async function removeFromCart(req, res, next) {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return handleError(
        new ApiError(404, 'Cart not found'),
        res
      );
    }

    cart.removeItem(productId);
    await cart.save();

    await cart.populate('items.product');
    logger.info(`✅ Item removed from cart: ${productId}`);

    sendSuccess(res, 200, 'Item removed from cart', cart);
  } catch (error) {
    next(error);
  }
}

/**
 * Update cart item quantity
 * PUT /api/cart/items/:productId
 */
async function updateCartItem(req, res, next) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return handleError(
        new ApiError(404, 'Cart not found'),
        res
      );
    }

    // Validate product and stock
    const product = await Product.findById(productId);
    if (!product) {
      return handleError(
        new ApiError(404, 'Product not found'),
        res
      );
    }

    if (quantity > 0 && !product.isInStock(quantity)) {
      return handleError(
        new ApiError(409, 'Insufficient stock available'),
        res
      );
    }

    cart.updateItemQuantity(productId, quantity);
    await cart.save();

    await cart.populate('items.product');
    logger.info(`✅ Cart item quantity updated: ${productId}`);

    sendSuccess(res, 200, 'Cart updated', cart);
  } catch (error) {
    next(error);
  }
}

/**
 * Clear entire cart
 * DELETE /api/cart
 */
async function clearCart(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return handleError(
        new ApiError(404, 'Cart not found'),
        res
      );
    }

    cart.clearCart();
    await cart.save();

    logger.info(`✅ Cart cleared`);
    sendSuccess(res, 200, 'Cart cleared', cart);
  } catch (error) {
    next(error);
  }
}

/**
 * Apply coupon code
 * POST /api/cart/coupon
 */
async function applyCoupon(req, res, next) {
  try {
    const { couponCode } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return handleError(
        new ApiError(404, 'Cart not found'),
        res
      );
    }

    // Validate coupon (implement based on your coupon system)
    // For now, simple validation
    if (!couponCode || couponCode.length < 3) {
      return handleError(
        new ApiError(400, 'Invalid coupon code'),
        res
      );
    }

    // TODO: Validate coupon against Coupon collection
    // const coupon = await Coupon.findOne({ code: couponCode, isActive: true });

    cart.couponCode = couponCode;
    // cart.couponDiscount = coupon.discountAmount; // Set based on coupon
    await cart.save();

    logger.info(`✅ Coupon applied: ${couponCode}`);
    sendSuccess(res, 200, 'Coupon applied', cart);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  applyCoupon,
};
