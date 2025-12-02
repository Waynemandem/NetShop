/**
 * useProducts Hook
 * Manages product state and provides product-related methods to components
 * Handles loading/error states for product operations
 */

import { useState, useCallback } from 'react';
import * as productService from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  /**
   * Get all products with filtering and pagination
   */
  const getProducts = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts(options);
      setProducts(response.data.products || []);
      setPagination(response.data.pagination || {});
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch products';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get single product by ID or slug
   */
  const getProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProduct(id);
      setCurrentProduct(response.data);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch product';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new product (Admin/Seller)
   */
  const createProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.createProduct(productData);
      setProducts([...products, response.data]);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create product';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [products]);

  /**
   * Update product (Admin/Seller)
   */
  const updateProduct = useCallback(async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.updateProduct(id, productData);
      setProducts(products.map(p => p._id === id ? response.data : p));
      if (currentProduct && currentProduct._id === id) {
        setCurrentProduct(response.data);
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update product';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [products, currentProduct]);

  /**
   * Delete product (Admin/Seller)
   */
  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete product';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [products]);

  /**
   * Add review to product
   */
  const addReview = useCallback(async (productId, reviewData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.addReview(productId, reviewData);
      if (currentProduct && currentProduct._id === productId) {
        setCurrentProduct(response.data);
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to add review';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProduct]);

  /**
   * Search products
   */
  const searchProducts = useCallback(async (query, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.searchProducts(query, limit);
      setProducts(response.data.products || []);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Search failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get products by category
   */
  const getProductsByCategory = useCallback(async (categoryId, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProductsByCategory(categoryId, page);
      setProducts(response.data.products || []);
      setPagination(response.data.pagination || {});
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch products';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get in-stock products
   */
  const getInStockProducts = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getInStockProducts(page);
      setProducts(response.data.products || []);
      setPagination(response.data.pagination || {});
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch in-stock products';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    products,
    currentProduct,
    loading,
    error,
    pagination,

    // Methods
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    addReview,
    searchProducts,
    getProductsByCategory,
    getInStockProducts,
    clearError,
  };
};

export default useProducts;
