/**
 * Product Controller
 * ========================================
 * CRUD operations, search, filter, and sort products
 */

const Product = require('../models/Product');
const Category = require('../models/Category');
const { sendSuccess, ApiError, handleError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * Get all products with advanced filtering, search, sorting, and pagination
 * GET /api/products
 */
async function getProducts(req, res, next) {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category,
      brand,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'desc',
      inStock = false,
    } = req.query;

    const skip = (page - 1) * limit;

    // Build filter
    const filter = { isActive: true };

    // Search by name, description, or brand
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category) {
      // Support both category ID and slug
      let categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        categoryDoc = await Category.findOne({ slug: category });
      }
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    // Filter by brand
    if (brand) {
      filter.brand = { $regex: brand, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Filter by stock
    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    // Get products with sorting
    const sortObj = { [sortBy]: order === 'asc' ? 1 : -1 };
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('seller', 'firstName lastName email shopName')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    sendSuccess(res, 200, 'Products retrieved', {
      products,
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
 * Get single product by ID or slug
 * GET /api/products/:id
 */
async function getProduct(req, res, next) {
  try {
    const { id } = req.params;

    // Try by ID first, then by slug
    let product = await Product.findById(id)
      .populate('category')
      .populate('seller', 'firstName lastName email shopName')
      .populate('reviews.userId', 'firstName lastName');

    if (!product) {
      product = await Product.findOne({ slug: id })
        .populate('category')
        .populate('seller', 'firstName lastName email shopName')
        .populate('reviews.userId', 'firstName lastName');
    }

    if (!product) {
      return handleError(
        new ApiError(404, 'Product not found'),
        res
      );
    }

    sendSuccess(res, 200, 'Product retrieved', product);
  } catch (error) {
    next(error);
  }
}

/**
 * Create new product (Seller/Admin)
 * POST /api/products
 */
async function createProduct(req, res, next) {
  try {
    const {
      name,
      description,
      shortDescription,
      category,
      brand,
      price,
      originalPrice,
      discount,
      discountType,
      tax,
      stock,
      lowStockThreshold,
      sku,
      tags,
      specifications,
    } = req.body;

    // Validate category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return handleError(
        new ApiError(404, 'Category not found'),
        res
      );
    }

    // Check for duplicate SKU
    if (sku) {
      const existingSku = await Product.findOne({ sku });
      if (existingSku) {
        return handleError(
          new ApiError(409, 'SKU already exists'),
          res
        );
      }
    }

    const product = new Product({
      name,
      description,
      shortDescription,
      category,
      brand,
      price,
      originalPrice,
      discount,
      discountType,
      tax,
      stock,
      lowStockThreshold,
      sku,
      tags,
      specifications,
      seller: req.user._id, // Current user is the seller
    });

    await product.save();
    await product.populate('category');
    logger.info(`✅ Product created: ${name}`);

    sendSuccess(res, 201, 'Product created successfully', product);
  } catch (error) {
    next(error);
  }
}

/**
 * Update product (Seller/Admin)
 * PUT /api/products/:id
 */
async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;

    let product = await Product.findById(id);
    if (!product) {
      return handleError(
        new ApiError(404, 'Product not found'),
        res
      );
    }

    // Check authorization
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return handleError(
        new ApiError(403, 'Not authorized to update this product'),
        res
      );
    }

    // Update fields
    const {
      name,
      description,
      shortDescription,
      category,
      brand,
      price,
      originalPrice,
      discount,
      discountType,
      tax,
      stock,
      tags,
      specifications,
      isActive,
      isFeatured,
    } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (shortDescription) product.shortDescription = shortDescription;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (price !== undefined) product.price = price;
    if (originalPrice) product.originalPrice = originalPrice;
    if (discount !== undefined) product.discount = discount;
    if (discountType) product.discountType = discountType;
    if (tax !== undefined) product.tax = tax;
    if (stock !== undefined) product.stock = stock;
    if (tags) product.tags = tags;
    if (specifications) product.specifications = specifications;
    if (isActive !== undefined) product.isActive = isActive;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;

    await product.save();
    logger.info(`✅ Product updated: ${product.name}`);

    sendSuccess(res, 200, 'Product updated successfully', product);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete product (Seller/Admin)
 * DELETE /api/products/:id
 */
async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return handleError(
        new ApiError(404, 'Product not found'),
        res
      );
    }

    // Check authorization
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return handleError(
        new ApiError(403, 'Not authorized to delete this product'),
        res
      );
    }

    await Product.findByIdAndDelete(id);
    logger.info(`✅ Product deleted: ${product.name}`);

    sendSuccess(res, 200, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Add review to product
 * POST /api/products/:id/reviews
 */
async function addReview(req, res, next) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return handleError(
        new ApiError(404, 'Product not found'),
        res
      );
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      (r) => r.userId.toString() === req.user._id.toString()
    );
    if (existingReview) {
      return handleError(
        new ApiError(409, 'You have already reviewed this product'),
        res
      );
    }

    // Add review
    product.reviews.push({
      userId: req.user._id,
      rating,
      comment,
    });

    // Calculate average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = Math.round((totalRating / product.reviews.length) * 10) / 10;
    product.totalReviews = product.reviews.length;

    await product.save();
    logger.info(`✅ Review added to product: ${product.name}`);

    sendSuccess(res, 201, 'Review added successfully', product);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
};
