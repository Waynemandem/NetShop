/**
 * Product Model
 * ========================================
 * Complete product schema with inventory, pricing, and ratings
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // Product identification
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    shortDescription: {
      type: String,
    },

    // Categorization
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    brand: {
      type: String,
      trim: true,
    },
    tags: [String],

    // Pricing
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number, // Price before discount
    },
    discount: {
      type: Number, // Percentage or fixed amount
      default: 0,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    tax: {
      type: Number,
      default: 0, // Percentage
    },

    // Inventory
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: 0,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Media
    images: [
      {
        url: String,
        publicId: String, // Cloudinary public ID
        alt: String,
        isMain: { type: Boolean, default: false },
      },
    ],

    // Ratings & Reviews
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Seller info
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller is required'],
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Specifications (flexible)
    specifications: mongoose.Schema.Types.Mixed,

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
 * Generate slug from name
 */
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

/**
 * Calculate final price with discount and tax
 * @returns {Object} - { basePrice, discount, tax, total }
 */
productSchema.methods.getPriceBreakdown = function () {
  const basePrice = this.price;
  let discountAmount = 0;

  if (this.discount > 0) {
    if (this.discountType === 'percentage') {
      discountAmount = (basePrice * this.discount) / 100;
    } else {
      discountAmount = this.discount;
    }
  }

  const priceAfterDiscount = basePrice - discountAmount;
  const taxAmount = (priceAfterDiscount * this.tax) / 100;
  const finalPrice = priceAfterDiscount + taxAmount;

  return {
    basePrice,
    discountAmount: Math.round(discountAmount * 100) / 100,
    priceAfterDiscount: Math.round(priceAfterDiscount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
  };
};

/**
 * Check if product is in stock
 * @param {number} quantity - Quantity to check
 * @returns {boolean}
 */
productSchema.methods.isInStock = function (quantity = 1) {
  return this.stock >= quantity;
};

module.exports = mongoose.model('Product', productSchema);
