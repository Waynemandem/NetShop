/**
 * Category Controller
 * ========================================
 * CRUD operations for product categories
 */

const Category = require('../models/Category');
const { sendSuccess, ApiError, handleError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * Get all categories with pagination and filtering
 * GET /api/categories
 */
async function getCategories(req, res, next) {
  try {
    const { page = 1, limit = 10, search, sortBy = 'displayOrder' } = req.query;

    const skip = (page - 1) * limit;

    // Build filter
    const filter = { isActive: true };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Get categories
    const categories = await Category.find(filter)
      .sort({ [sortBy]: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Category.countDocuments(filter);

    sendSuccess(res, 200, 'Categories retrieved', {
      categories,
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
 * Get single category by ID or slug
 * GET /api/categories/:id
 */
async function getCategory(req, res, next) {
  try {
    const { id } = req.params;

    // Try to find by ID first, then by slug
    let category = await Category.findById(id);
    if (!category) {
      category = await Category.findOne({ slug: id });
    }

    if (!category) {
      return handleError(
        new ApiError(404, 'Category not found'),
        res
      );
    }

    sendSuccess(res, 200, 'Category retrieved', category);
  } catch (error) {
    next(error);
  }
}

/**
 * Create new category (Admin only)
 * POST /api/categories
 */
async function createCategory(req, res, next) {
  try {
    const { name, description, image, icon, displayOrder } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return handleError(
        new ApiError(409, 'Category already exists'),
        res
      );
    }

    const category = new Category({
      name,
      description,
      image,
      icon,
      displayOrder,
    });

    await category.save();
    logger.info(`✅ Category created: ${name}`);

    sendSuccess(res, 201, 'Category created successfully', category);
  } catch (error) {
    next(error);
  }
}

/**
 * Update category (Admin only)
 * PUT /api/categories/:id
 */
async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, image, icon, displayOrder, isActive } = req.body;

    let category = await Category.findById(id);
    if (!category) {
      return handleError(
        new ApiError(404, 'Category not found'),
        res
      );
    }

    // Update fields
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (icon !== undefined) category.icon = icon;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    logger.info(`✅ Category updated: ${category.name}`);

    sendSuccess(res, 200, 'Category updated successfully', category);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete category (Admin only)
 * DELETE /api/categories/:id
 */
async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return handleError(
        new ApiError(404, 'Category not found'),
        res
      );
    }

    logger.info(`✅ Category deleted: ${category.name}`);
    sendSuccess(res, 200, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
