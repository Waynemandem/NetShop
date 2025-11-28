/**
 * Order Controller
 * ========================================
 * Order management, creation, and status tracking
 */

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendSuccess, ApiError, handleError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * Get user's orders with pagination
 * GET /api/orders
 */
async function getOrders(req, res, next) {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { user: req.user._id };
    if (status) {
      filter.status = status;
    }

    // Get orders
    const orders = await Order.find(filter)
      .populate('items.product', 'name price images')
      .populate('user', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    sendSuccess(res, 200, 'Orders retrieved', {
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single order details
 * GET /api/orders/:id
 */
async function getOrder(req, res, next) {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('items.product')
      .populate('user', 'firstName lastName email phone');

    if (!order) {
      return handleError(
        new ApiError(404, 'Order not found'),
        res
      );
    }

    // Check if user is owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return handleError(
        new ApiError(403, 'Not authorized to view this order'),
        res
      );
    }

    sendSuccess(res, 200, 'Order retrieved', order);
  } catch (error) {
    next(error);
  }
}

/**
 * Create order from cart
 * POST /api/orders
 */
async function createOrder(req, res, next) {
  try {
    const {
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return handleError(
        new ApiError(400, 'Cart is empty'),
        res
      );
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (!item.product.isInStock(item.quantity)) {
        return handleError(
          new ApiError(
            409,
            `Insufficient stock for ${item.product.name}`
          ),
          res
        );
      }
    }

    // Create order object
    const orderData = {
      user: req.user._id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        discount: item.discount,
        tax: item.tax,
      })),
      shippingAddress: {
        ...shippingAddress,
        firstName: shippingAddress.firstName || req.user.firstName,
        lastName: shippingAddress.lastName || req.user.lastName,
      },
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      notes,
    };

    // Create order
    const order = new Order(orderData);
    order.calculateTotals();
    await order.save();

    // Reduce product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    cart.clearCart();
    await cart.save();

    logger.info(`✅ Order created: ${order.orderNumber}`);

    await order.populate('items.product');
    sendSuccess(res, 201, 'Order created successfully', order);
  } catch (error) {
    next(error);
  }
}

/**
 * Update order status (Admin only)
 * PUT /api/orders/:id/status
 */
async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return handleError(
        new ApiError(404, 'Order not found'),
        res
      );
    }

    order.updateStatus(status, notes);
    await order.save();

    logger.info(`✅ Order status updated: ${order.orderNumber} - ${status}`);
    sendSuccess(res, 200, 'Order status updated', order);
  } catch (error) {
    next(error);
  }
}

/**
 * Update payment status
 * PUT /api/orders/:id/payment
 */
async function updatePaymentStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { paymentStatus, transactionId, paymentGateway } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      {
        paymentStatus,
        transactionId,
        paymentGateway,
      },
      { new: true }
    );

    if (!order) {
      return handleError(
        new ApiError(404, 'Order not found'),
        res
      );
    }

    logger.info(`✅ Payment status updated: ${order.orderNumber} - ${paymentStatus}`);
    sendSuccess(res, 200, 'Payment status updated', order);
  } catch (error) {
    next(error);
  }
}

/**
 * Cancel order
 * PUT /api/orders/:id/cancel
 */
async function cancelOrder(req, res, next) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return handleError(
        new ApiError(404, 'Order not found'),
        res
      );
    }

    // Check if user is owner or admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return handleError(
        new ApiError(403, 'Not authorized to cancel this order'),
        res
      );
    }

    // Only allow cancellation if order is not shipped or delivered
    if (['shipped', 'delivered', 'cancelled', 'refunded'].includes(order.status)) {
      return handleError(
        new ApiError(400, `Cannot cancel order with status: ${order.status}`),
        res
      );
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    // Update order status
    order.status = 'cancelled';
    order.adminNotes = `Cancelled by user: ${reason || 'No reason provided'}`;
    await order.save();

    logger.info(`✅ Order cancelled: ${order.orderNumber}`);
    sendSuccess(res, 200, 'Order cancelled successfully', order);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all orders (Admin only)
 * GET /api/orders/admin/all
 */
async function getAllOrders(req, res, next) {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.user = userId;

    // Get orders
    const orders = await Order.find(filter)
      .populate('items.product')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    sendSuccess(res, 200, 'All orders retrieved', {
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getAllOrders,
};
