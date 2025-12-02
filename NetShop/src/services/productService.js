/**
 * Product Service
 * Handles all product-related API calls including CRUD, search, filter, and sort
 */

import { apiGet, apiPost, apiPut, apiDelete } from './api';

/**
 * Get all products with advanced filtering, search, and pagination
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 10)
 * @param {string} options.search - Search query
 * @param {string} options.category - Category ID or slug
 * @param {string} options.brand - Brand name
 * @param {number} options.minPrice - Minimum price
 * @param {number} options.maxPrice - Maximum price
 * @param {string} options.sortBy - Sort field (name, price, rating, createdAt)
 * @param {string} options.order - Sort order (asc, desc)
 * @param {boolean} options.inStock - Filter in-stock items only
 * @returns {Promise<Object>} Products array and pagination info
 */
export const getProducts = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    category = '',
    brand = '',
    minPrice = '',
    maxPrice = '',
    sortBy = 'createdAt',
    order = 'desc',
    inStock = false,
  } = options;

  // Build query string
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...(search && { search }),
    ...(category && { category }),
    ...(brand && { brand }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(sortBy && { sortBy }),
    ...(order && { order }),
    ...(inStock && { inStock }),
  });

  const response = await apiGet(`/products?${queryParams}`, false);
  return response;
};

/**
 * Get single product by ID or slug
 * @param {string} id - Product ID or slug
 * @returns {Promise<Object>} Product data with category and reviews
 */
export const getProduct = async (id) => {
  const response = await apiGet(`/products/${id}`, false);
  return response;
};

/**
 * Create new product (Admin/Seller only)
 * @param {Object} productData - Product data to create
 * @param {string} productData.name - Product name
 * @param {string} productData.description - Product description
 * @param {string} productData.category - Category ID
 * @param {string} productData.brand - Brand name
 * @param {number} productData.price - Product price
 * @param {number} productData.stock - Stock quantity
 * @param {Array<string>} productData.images - Image URLs
 * @returns {Promise<Object>} Created product data
 */
export const createProduct = async (productData) => {
  const response = await apiPost('/products', productData, true);
  return response;
};

/**
 * Update product (Admin/Seller only)
 * @param {string} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>} Updated product data
 */
export const updateProduct = async (id, productData) => {
  const response = await apiPut(`/products/${id}`, productData, true);
  return response;
};

/**
 * Delete product (Admin/Seller only)
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Success response
 */
export const deleteProduct = async (id) => {
  const response = await apiDelete(`/products/${id}`, true);
  return response;
};

/**
 * Add review to product
 * @param {string} id - Product ID
 * @param {Object} reviewData - Review data
 * @param {number} reviewData.rating - Rating (1-5)
 * @param {string} reviewData.comment - Review comment
 * @returns {Promise<Object>} Updated product with new review
 */
export const addReview = async (id, reviewData) => {
  const response = await apiPost(`/products/${id}/reviews`, reviewData, true);
  return response;
};

/**
 * Search products by name or description
 * @param {string} query - Search query
 * @param {number} limit - Results limit
 * @returns {Promise<Object>} Search results
 */
export const searchProducts = async (query, limit = 10) => {
  return getProducts({
    search: query,
    limit,
  });
};

/**
 * Get products by category
 * @param {string} categoryId - Category ID or slug
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} Products in category
 */
export const getProductsByCategory = async (categoryId, page = 1, limit = 10) => {
  return getProducts({
    category: categoryId,
    page,
    limit,
  });
};

/**
 * Get products by price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @param {number} page - Page number
 * @returns {Promise<Object>} Products in price range
 */
export const getProductsByPriceRange = async (minPrice, maxPrice, page = 1) => {
  return getProducts({
    minPrice,
    maxPrice,
    page,
  });
};

/**
 * Get in-stock products only
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} In-stock products
 */
export const getInStockProducts = async (page = 1, limit = 10) => {
  return getProducts({
    inStock: true,
    page,
    limit,
  });
};

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  searchProducts,
  getProductsByCategory,
  getProductsByPriceRange,
  getInStockProducts,
};
