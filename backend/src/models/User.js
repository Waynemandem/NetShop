/**
 * User Model
 * ========================================
 * Defines user schema with roles (customer/admin)
 * - Authentication details
 * - Personal information
 * - Address for orders
 */

const mongoose = require('mongoose');
const { hashPassword, comparePassword } = require('../utils/password');

const userSchema = new mongoose.Schema(
  {
    // User identification
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't return password by default
    },

    // Profile information
    phone: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String, // Cloudinary URL
    },

    // Address information
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },

    // Account settings
    role: {
      type: String,
      enum: ['customer', 'admin', 'seller'],
      default: 'customer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // Seller-specific
    shopName: String,
    shopDescription: String,
    bankDetails: {
      accountHolder: String,
      accountNumber: String,
      bankName: String,
    },

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
 * Hash password before saving
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare password method
 * @param {string} plainPassword - Plain text password to compare
 * @returns {Promise<boolean>}
 */
userSchema.methods.matchPassword = async function (plainPassword) {
  return await comparePassword(plainPassword, this.password);
};

/**
 * Get public user data (without sensitive info)
 * @returns {Object}
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
