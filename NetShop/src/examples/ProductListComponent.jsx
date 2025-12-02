/**
 * Complete Example: ProductListComponent.jsx
 * 
 * This component demonstrates how to:
 * - Fetch products from the backend
 * - Display products in a list
 * - Implement search and filtering
 * - Handle loading and error states
 * - Add items to cart
 */

import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';

export const ProductListComponent = () => {
  // Get products hook
  const {
    products,
    loading: productsLoading,
    error: productsError,
    pagination,
    getProducts,
    searchProducts,
    getProductsByCategory,
  } = useProducts();

  // Cart hook
  const { addToCart, loading: cartLoading } = useCart();

  // Local state for filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [currentPage, setCurrentPage] = useState(1);

  // Load products on component mount and when filters change
  useEffect(() => {
    loadProducts();
  }, [currentPage]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) {
        searchProducts(search, 20);
      } else if (selectedCategory) {
        getProductsByCategory(selectedCategory, currentPage);
      } else {
        loadProducts();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

  const loadProducts = async () => {
    try {
      await getProducts({
        page: currentPage,
        limit: 10,
        sortBy,
        order: 'desc',
      });
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      alert('Product added to cart!');
    } catch (error) {
      alert('Error adding to cart: ' + error.message);
    }
  };

  if (productsLoading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="products-container">
      {/* Error Message */}
      {productsError && (
        <div className="error-message">
          Error: {productsError}
        </div>
      )}

      {/* Filters Section */}
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products.length === 0 ? (
          <p className="no-products">No products found</p>
        ) : (
          products.map(product => (
            <div key={product._id} className="product-card">
              {/* Product Image */}
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="product-image"
                />
              )}

              {/* Product Info */}
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="description">{product.description?.substring(0, 100)}...</p>

                {/* Rating */}
                {product.averageRating && (
                  <div className="rating">
                    <span>⭐ {product.averageRating.toFixed(1)}</span>
                    <span>({product.reviews?.length || 0} reviews)</span>
                  </div>
                )}

                {/* Price */}
                <div className="price-section">
                  <span className="price">${product.price}</span>
                  {product.discount > 0 && (
                    <span className="discount">
                      Save {product.discount}%
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="stock-status">
                  {product.stock > 0 ? (
                    <span className="in-stock">In Stock ({product.stock})</span>
                  ) : (
                    <span className="out-of-stock">Out of Stock</span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product._id)}
                  disabled={product.stock === 0 || cartLoading}
                  className="add-to-cart-btn"
                >
                  {cartLoading ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <span>
            Page {currentPage} of {pagination.pages}
          </span>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
            disabled={currentPage === pagination.pages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductListComponent;
