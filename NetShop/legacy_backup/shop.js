/**
 * shop.js - Modern Product Management System
 * 
 * Handles fetching, displaying, and managing products via API.
 * Uses a modular approach with scoped variables to avoid global pollution.
 */

(function () {
  'use strict';

  // =========================================================================
  // CONFIGURATION & STATE
  // =========================================================================

  const API_BASE_URL = '/api/products';

  const state = {
    products: [],
    filter: 'all',
    sortBy: 'default',
    searchQuery: '',
    isLoading: false,
    error: null
  };

  // =========================================================================
  // DOM ELEMENTS
  // =========================================================================

  const elements = {
    grid: document.getElementById('product-grid'),
    categoryFilter: document.getElementById('categoryFilter'),
    sortBy: document.getElementById('sortBy'),
    toastContainer: document.getElementById('toastContainer') || createToastContainer()
  };

  // =========================================================================
  // API MODULE
  // =========================================================================

  const API = {
    /**
     * Fetch all products from the backend
     * @returns {Promise<Array>} List of products
     */
    async fetchProducts() {
      try {
        console.log('[Shop] Fetching products from API...');
        const response = await fetch(API_BASE_URL, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`[Shop] Successfully fetched ${data.length} products.`);
        return data;
      } catch (error) {
        console.error('[Shop] Fetch failed:', error);
        throw error;
      }
    },

    /**
     * Create a new product
     * @param {Object} productData 
     * @returns {Promise<Object>} Created product
     */
    async createProduct(productData) {
      try {
        console.log('[Shop] Creating new product:', productData);
        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });

        if (!response.ok) {
          throw new Error(`Failed to create product: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('[Shop] Create failed:', error);
        throw error;
      }
    }
  };

  // =========================================================================
  // UI RENDERER MODULE
  // =========================================================================

  const UI = {
    /**
     * Render the product grid based on current state
     */
    render() {
      if (!elements.grid) return;

      // Clear grid
      elements.grid.innerHTML = '';

      // 1. Loading State
      if (state.isLoading) {
        elements.grid.innerHTML = this.getLoadingTemplate();
        return;
      }

      // 2. Error State
      if (state.error) {
        elements.grid.innerHTML = this.getErrorTemplate(state.error);
        return;
      }

      // 3. Filter & Sort Data
      let displayProducts = [...state.products];

      // Filter
      if (state.filter !== 'all') {
        displayProducts = displayProducts.filter(p => p.category === state.filter);
      }

      // Search
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        displayProducts = displayProducts.filter(p =>
          (p.name && p.name.toLowerCase().includes(query)) ||
          (p.brand && p.brand.toLowerCase().includes(query)) ||
          (p.brandName && p.brandName.toLowerCase().includes(query)) ||
          (p.category && p.category.toLowerCase().includes(query))
        );
      }

      // Sort
      if (state.sortBy === 'priceLow') {
        displayProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (state.sortBy === 'priceHigh') {
        displayProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
      } else if (state.sortBy === 'latest') {
        displayProducts.reverse(); // Assuming API returns oldest first
      }

      // 4. Empty State
      if (displayProducts.length === 0) {
        elements.grid.innerHTML = this.getEmptyTemplate();
        return;
      }

      // 5. Render Products
      const fragment = document.createDocumentFragment();
      displayProducts.forEach(product => {
        const card = this.createProductCard(product);
        fragment.appendChild(card);
      });
      elements.grid.appendChild(fragment);
    },

    createProductCard(product) {
      const card = document.createElement('article');
      card.className = 'product-card';

      // Safe accessors
      const image = product.image || 'placeholder.jpg'; // TODO: Add a real placeholder
      const name = product.name || 'Untitled Product';
      const price = parseFloat(product.price || 0).toLocaleString('en-NG', {
        style: 'currency',
        currency: 'NGN'
      });
      const brand = product.brand || product.brandName || '';
      const rating = product.rating || 4;

      card.innerHTML = `
                <div class="card-media">
                    <img src="${image}" alt="${name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
                    ${product.discount ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
                </div>
                <div class="card-body">
                    ${brand ? `<p class="brandName">${brand}</p>` : ''}
                    <h3 class="product-name">${name}</h3>
                    <div class="price-row">
                        <span class="product-price">${price}</span>
                        ${product.oldPrice ? `<span class="old-price">₦${product.oldPrice}</span>` : ''}
                    </div>
                    <div class="rating">
                        ${this.getStarRating(rating)}
                    </div>
                    <div class="card-buttons">
                        <button class="cart-btn" data-id="${product.id}" aria-label="Add to Cart">
                            <i class="fas fa-shopping-cart"></i> Add
                        </button>
                        <button class="buy-btn" data-id="${product.id}" aria-label="Buy Now">
                            Buy Now
                        </button>
                    </div>
                </div>
            `;

      // Add Event Listeners to Buttons
      const cartBtn = card.querySelector('.cart-btn');
      const buyBtn = card.querySelector('.buy-btn');

      cartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleAddToCart(product);
      });

      buyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleBuyNow(product);
      });

      // Card Click (Details)
      card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          window.location.href = `product.html?id=${product.id}`;
        }
      });

      return card;
    },

    getStarRating(rating) {
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
          stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
          stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
          stars += '<i class="far fa-star"></i>';
        }
      }
      return stars;
    },

    getLoadingTemplate() {
      return `
                <div class="loading-state" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--primary-color, #007bff);"></i>
                    <p style="margin-top: 15px; color: #666;">Loading products...</p>
                </div>
            `;
    },

    getErrorTemplate(msg) {
      return `
                <div class="error-state" style="grid-column: 1/-1; text-align: center; padding: 50px; color: #dc3545;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <h3>Oops! Something went wrong.</h3>
                    <p>${msg}</p>
                    <button onclick="window.location.reload()" style="margin-top: 15px; padding: 8px 16px; cursor: pointer;">Try Again</button>
                </div>
            `;
    },

    getEmptyTemplate() {
      return `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 50px; color: #888;">
                    <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                    <h3>No products found</h3>
                    <p>Try changing your filters or check back later.</p>
                </div>
            `;
    },

    showToast(message, type = 'success') {
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.style.cssText = `
                background: ${type === 'error' ? '#ff4444' : '#00C851'};
                color: white;
                padding: 12px 24px;
                border-radius: 4px;
                margin-bottom: 10px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                animation: slideIn 0.3s ease-out;
                display: flex;
                align-items: center;
                gap: 10px;
            `;

      toast.innerHTML = `
                <i class="fas ${type === 'error' ? 'fa-times-circle' : 'fa-check-circle'}"></i>
                <span>${message}</span>
            `;

      elements.toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  };

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================

  function handleAddToCart(product) {
    console.log('[Shop] Adding to cart:', product.name);
    // Dispatch event for other components (navbar cart count, etc.)
    // Using CustomEvent to communicate with legacy/other parts of the app
    const event = new CustomEvent('netshop:addToCart', { detail: product });
    document.dispatchEvent(event);

    // Also try global function if available (legacy support)
    if (window.addToCart) {
      window.addToCart(product);
    } else {
      UI.showToast(`${product.name} added to cart!`);
    }
  }

  function handleBuyNow(product) {
    handleAddToCart(product);
    window.location.href = 'cart.html';
  }

  function setupEventListeners() {
    // Category Filter
    if (elements.categoryFilter) {
      elements.categoryFilter.addEventListener('change', (e) => {
        state.filter = e.target.value;
        console.log('[Shop] Filter changed to:', state.filter);
        UI.render();
      });
    }

    // Sort By
    if (elements.sortBy) {
      elements.sortBy.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        console.log('[Shop] Sort changed to:', state.sortBy);
        UI.render();
      });
    }

    // Navbar Search Listener
    document.addEventListener('navbarSearch', (e) => {
      if (e.detail && typeof e.detail.query === 'string') {
        state.searchQuery = e.detail.query;
        console.log('[Shop] Search query updated:', state.searchQuery);
        UI.render();
      }
    });
  }

  function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        `;
    document.body.appendChild(container);
    return container;
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  async function init() {
    console.log('[Shop] Initializing...');

    setupEventListeners();

    // Check URL for search query
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      state.searchQuery = searchParam;
      // Update navbar input if possible
      if (window.NavbarAPI && window.NavbarAPI.setSearchQuery) {
        window.NavbarAPI.setSearchQuery(searchParam);
      }
    }

    state.isLoading = true;
    UI.render();

    try {
      const products = await API.fetchProducts();
      state.products = products;
      state.isLoading = false;
      UI.render();
    } catch (err) {
      state.isLoading = false;
      state.error = "Could not load products. Please check your connection.";
      UI.render();

      // Fallback for demo purposes if API fails (REMOVE IN PRODUCTION)
      console.warn('[Shop] API failed, checking for local fallback...');
      if (window.NetShop && window.NetShop.ProductManager) {
        const localProducts = window.NetShop.ProductManager.getProducts();
        if (localProducts.length > 0) {
          console.log('[Shop] Using local fallback data.');
          state.products = localProducts;
          state.error = null;
          UI.render();
        }
      }
    }
  }

  // Start the app
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();