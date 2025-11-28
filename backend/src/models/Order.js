/**
 * Order Model
 * ========================================
 * Complete order schema with status tracking and payment info
 */

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // Order identification
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Items
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
        },
        price: Number,
        discount: Number,
        tax: Number,
      },
    ],

    // Pricing
    subtotal: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    // Shipping address
    shippingAddress: {
      firstName: String,
      lastName: String,
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      phone: String,
    },

    // Billing address
    billingAddress: {
      firstName: String,
      lastName: String,
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },

    // Status tracking
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
      ],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },

    // Payment info
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'bank_transfer', 'wallet', 'cash_on_delivery'],
      default: 'credit_card',
    },
    transactionId: String,
    paymentGateway: String,

    // Shipping
    trackingNumber: String,
    shippingMethod: {
      type: String,
      default: 'standard',
    },
    estimatedDelivery: Date,
    actualDelivery: Date,

    // Additional info
    notes: String,
    adminNotes: String,

    // Timestamps
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
 * Generate unique order number
 */
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

/**
 * Update order status
 * @param {string} status - New status
 * @param {string} notes - Status update notes
 */
orderSchema.methods.updateStatus = function (status, notes = '') {
  this.status = status;
  if (notes) {
    this.adminNotes = `${this.adminNotes || ''}\n${new Date().toISOString()}: ${notes}`;
  }
};

/**
 * Calculate order totals from items
 */
orderSchema.methods.calculateTotals = function () {
  this.subtotal = this.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
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
    this.discountAmount +
    this.shippingCost;
};

module.exports = mongoose.model('Order', orderSchema);
