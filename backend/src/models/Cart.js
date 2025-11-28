/**
 * Cart Model
 * ========================================
 * Shopping cart with items and totals
 */

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number, // Price at time of adding to cart
          required: true,
        },
        discount: Number,
        tax: Number,
      },
    ],

    // Cart totals
    subtotal: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },

    // Coupon/Promo
    couponCode: String,
    couponDiscount: {
      type: Number,
      default: 0,
    },

    // Additional info
    notes: String,
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/**
 * Calculate cart totals
 * Called before save to update total amounts
 */
cartSchema.methods.calculateTotals = function () {
  this.subtotal = this.items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    return sum + itemTotal;
  }, 0);

  this.discountAmount = this.items.reduce((sum, item) => {
    const discount = item.discount || 0;
    return sum + discount * item.quantity;
  }, 0);

  this.taxAmount = this.items.reduce((sum, item) => {
    const tax = item.tax || 0;
    return sum + tax * item.quantity;
  }, 0);

  this.totalAmount =
    this.subtotal +
    this.taxAmount -
    this.discountAmount -
    this.couponDiscount;

  // Ensure no negative totals
  this.totalAmount = Math.max(0, this.totalAmount);
};

/**
 * Add item to cart
 * @param {Object} item - Item object with product, quantity, price, etc
 */
cartSchema.methods.addItem = function (item) {
  const existingItem = this.items.find(
    (i) => i.product.toString() === item.product.toString()
  );

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    this.items.push(item);
  }

  this.calculateTotals();
};

/**
 * Remove item from cart
 * @param {string} productId - Product ID to remove
 */
cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter(
    (i) => i.product.toString() !== productId.toString()
  );
  this.calculateTotals();
};

/**
 * Update item quantity
 * @param {string} productId - Product ID
 * @param {number} quantity - New quantity
 */
cartSchema.methods.updateItemQuantity = function (productId, quantity) {
  const item = this.items.find(
    (i) => i.product.toString() === productId.toString()
  );

  if (item) {
    if (quantity <= 0) {
      this.removeItem(productId);
    } else {
      item.quantity = quantity;
      this.calculateTotals();
    }
  }
};

/**
 * Clear cart
 */
cartSchema.methods.clearCart = function () {
  this.items = [];
  this.calculateTotals();
};

module.exports = mongoose.model('Cart', cartSchema);
