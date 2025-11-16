// ═══════════════════════════════════════════════════════════════
// NETSHOP CORE - Consolidated & Fixed Version
// Place this BEFORE all other scripts in your HTML
// ═══════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // 1. UTILITIES - Safe localStorage helpers
  // ═══════════════════════════════════════════════════════════════
  
  window.NetShop = window.NetShop || {};
  
  const Utils = {
    // Safe parse with fallback
    safeParse(key, fallback = null) {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
      } catch (error) {
        console.warn(`[NetShop] Failed to parse ${key}:`, error);
        return fallback;
      }
    },

    // Safe set with error handling
    safeSet(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          console.error('[NetShop] localStorage is full!');
          this.showError('Storage is full. Please clear some data.');
        } else {
          console.error('[NetShop] Failed to save:', error);
        }
        return false;
      }
    },

    // Slugify for IDs
    slugify(text) {
      return String(text || '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
    },

    // Format price consistently
    formatPrice(value) {
      const num = Number(value) || 0;
      try {
        return num.toLocaleString('en-NG', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      } catch (error) {
        return num.toFixed(2);
      }
    },

    // Normalize price input
    normalizePrice(value) {
      if (value == null || value === '') return 0;
      if (typeof value === 'number') return value;
      const cleaned = String(value).replace(/[^0-9.\-]/g, '');
      const parsed = parseFloat(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    },

    // Show error toast
    showError(message) {
      if (window.toast) {
        window.toast.error(message);
      } else if (typeof showToast === 'function') {
        showToast(message, 'error');
      } else {
        alert(message);
      }
    },

    // Show success toast
    showSuccess(message) {
      if (window.toast) {
        window.toast.success(message);
      } else if (typeof showToast === 'function') {
        showToast(message, 'success');
      } else {
        console.log(message);
      }
    }
  };

  NetShop.Utils = Utils;

  // ═══════════════════════════════════════════════════════════════
  // 2. CART MANAGER - Single source of truth for cart operations
  // ═══════════════════════════════════════════════════════════════

  const CartManager = {
    STORAGE_KEY: 'cart',

    // Get cart items
    getCart() {
      return Utils.safeParse(this.STORAGE_KEY, []);
    },

    // Save cart
    saveCart(cart) {
      return Utils.safeSet(this.STORAGE_KEY, cart);
    },

    // Add item to cart
    addItem(product) {
      if (!product || !product.name) {
        console.warn('[CartManager] Invalid product:', product);
        return false;
      }

      const cart = this.getCart();
      const price = Utils.normalizePrice(product.price);
      
      // Find existing item by ID or name
      const index = cart.findIndex(item => 
        item.id === product.id || item.name === product.name
      );

      if (index >= 0) {
        // Increment quantity
        cart[index].quantity = (cart[index].quantity || 0) + 1;
      } else {
        // Add new item
        cart.push({
          id: product.id || Utils.slugify(product.name),
          name: product.name,
          price: price,
          image: product.image || '',
          brandName: product.brandName || product.brand || '',
          quantity: 1
        });
      }

      const saved = this.saveCart(cart);
      if (saved) {
        this.updateCartCount();
        Utils.showSuccess(`${product.name} added to cart 🛒`);
      }
      return saved;
    },

    // Remove item from cart
    removeItem(productId) {
      const cart = this.getCart();
      const filtered = cart.filter(item => 
        item.id !== productId && item.name !== productId
      );
      
      if (filtered.length < cart.length) {
        this.saveCart(filtered);
        this.updateCartCount();
        return true;
      }
      return false;
    },

    // Update item quantity
    updateQuantity(productId, quantity) {
      const cart = this.getCart();
      const item = cart.find(i => i.id === productId || i.name === productId);
      
      if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
          return this.removeItem(productId);
        }
        this.saveCart(cart);
        this.updateCartCount();
        return true;
      }
      return false;
    },

    // Clear cart
    clearCart() {
      this.saveCart([]);
      this.updateCartCount();
    },

    // Get cart total (item count)
    getItemCount() {
      const cart = this.getCart();
      return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    },

    // Get cart subtotal (price)
    getSubtotal() {
      const cart = this.getCart();
      return cart.reduce((sum, item) => {
        const price = Utils.normalizePrice(item.price);
        const qty = item.quantity || 0;
        return sum + (price * qty);
      }, 0);
    },

    // Update cart count display (all instances)
    updateCartCount() {
      const count = this.getItemCount();
      const elements = document.querySelectorAll('.cart-count, #cart-count');
      
      elements.forEach(el => {
        el.textContent = count;
        
        // Add pulse animation
        el.classList.remove('pulse');
        void el.offsetWidth; // Trigger reflow
        el.classList.add('pulse');
        setTimeout(() => el.classList.remove('pulse'), 300);
      });
    }
  };

  NetShop.CartManager = CartManager;

  // ═══════════════════════════════════════════════════════════════
  // 3. PRODUCT MANAGER - Handle product catalog
  // ═══════════════════════════════════════════════════════════════

  const ProductManager = {
    STORAGE_KEY: 'shopProducts',

    // Default products (fallback)
    DEFAULT_PRODUCTS: [
      { brandName: "Nike", name: "Nike Air Sneakers", category: "men", price: 120, image: "nike1.jpeg" },
      { brandName: "Adidas", name: "Adidas Ultraboost", category: "men", price: 140, image: "adidas.jpeg" },
      { brandName: "Puma", name: "Puma Classic", category: "women", price: 100, image: "puma1.jpg" },
      { brandName: "New Balance", name: "New Balance 550", category: "men", price: 110, image: "newBalance.jpeg" },
      { brandName: "Converse", name: "Converse All Star", category: "unisex", price: 100, image: "ConverseAllStar.jpeg" },
      { brandName: "Nike", name: "Nike Stack", category: "men", price: 130, image: "nikestack.jpeg" }
    ],

    // Initialize product catalog
    init() {
      const products = this.getProducts();
      if (!products || products.length === 0) {
        this.setProducts(this.DEFAULT_PRODUCTS);
      }
    },

    // Get all products
    getProducts() {
      const products = Utils.safeParse(this.STORAGE_KEY, []);
      return products.map(p => ({
        ...p,
        id: p.id || Utils.slugify(p.name),
        price: Utils.normalizePrice(p.price)
      }));
    },

    // Set products
    setProducts(products) {
      return Utils.safeSet(this.STORAGE_KEY, products);
    },

    // Add product
    addProduct(product) {
      const products = this.getProducts();
      
      // Check for duplicates
      const exists = products.find(p => 
        p.id === product.id || p.name === product.name
      );
      
      if (exists) {
        Utils.showError('Product already exists');
        return false;
      }

      products.push({
        ...product,
        id: product.id || Utils.slugify(product.name),
        price: Utils.normalizePrice(product.price)
      });

      return this.setProducts(products);
    },

    // Get product by ID
    getProductById(id) {
      const products = this.getProducts();
      return products.find(p => p.id === id || p.name === id);
    },

    // Search products
    search(query) {
      if (!query || query.trim().length === 0) {
        return this.getProducts();
      }

      const searchTerm = query.toLowerCase().trim();
      return this.getProducts().filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        (product.brandName && product.brandName.toLowerCase().includes(searchTerm)) ||
        (product.category && product.category.toLowerCase().includes(searchTerm))
      );
    },

    // Filter by category
    filterByCategory(category) {
      if (!category || category === 'all') {
        return this.getProducts();
      }
      return this.getProducts().filter(p => p.category === category);
    },

    // Sort products
    sort(products, sortBy) {
      const sorted = [...products];
      
      switch(sortBy) {
        case 'priceLow':
          return sorted.sort((a, b) => a.price - b.price);
        case 'priceHigh':
          return sorted.sort((a, b) => b.price - a.price);
        case 'name':
          return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'latest':
          return sorted.reverse();
        default:
          return sorted;
      }
    }
  };

  NetShop.ProductManager = ProductManager;

  // ═══════════════════════════════════════════════════════════════
  // 4. IMAGE MANAGER - Handle product images with IndexedDB
  // ═══════════════════════════════════════════════════════════════

  const ImageManager = {
    // Check if ImageDB is available
    isAvailable() {
      return window.ImageDB && typeof window.ImageDB.init === 'function';
    },

    // Initialize ImageDB
    async init() {
      if (!this.isAvailable()) {
        console.warn('[ImageManager] ImageDB not available');
        return false;
      }

      try {
        await window.ImageDB.init();
        return true;
      } catch (error) {
        console.error('[ImageManager] Failed to initialize:', error);
        return false;
      }
    },

    // Save image
    async saveImage(productId, imageData) {
      if (!this.isAvailable()) return false;

      try {
        await window.ImageDB.saveImage(productId, imageData);
        return true;
      } catch (error) {
        console.error('[ImageManager] Failed to save image:', error);
        return false;
      }
    },

    // Get image (with fallback)
    async getImage(product) {
      // Try IndexedDB first
      if (this.isAvailable() && product.hasImage) {
        try {
          const imageData = await window.ImageDB.getImage(product.id);
          if (imageData) return imageData;
        } catch (error) {
          console.warn('[ImageManager] Failed to load from IndexedDB:', error);
        }
      }

      // Fallback to legacy image field
      return product.image || '';
    }
  };

  NetShop.ImageManager = ImageManager;

  // ═══════════════════════════════════════════════════════════════
  // 5. INITIALIZATION
  // ═══════════════════════════════════════════════════════════════

  document.addEventListener('DOMContentLoaded', () => {
    // Initialize modules
    ProductManager.init();
    CartManager.updateCartCount();
    
    // Initialize ImageDB if available
    if (ImageManager.isAvailable()) {
      ImageManager.init().catch(err => 
        console.warn('[NetShop] ImageDB initialization failed:', err)
      );
    }

    // Setup mobile menu (if present)
    setupMobileMenu();

    // Setup search (if present)
    setupSearch();

    console.log('[NetShop] Core initialized successfully');
  });

  // ═══════════════════════════════════════════════════════════════
  // 6. MOBILE MENU - Consolidated handler
  // ═══════════════════════════════════════════════════════════════

  function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    const menuOverlay = document.getElementById('menu-overlay');

    if (!menuToggle || !navbar) return;

    menuToggle.addEventListener('click', () => {
      navbar.classList.toggle('show');
      menuToggle.classList.toggle('active');
      if (menuOverlay) menuOverlay.classList.toggle('show');
    });

    if (menuOverlay) {
      menuOverlay.addEventListener('click', () => {
        navbar.classList.remove('show');
        menuToggle.classList.remove('active');
        menuOverlay.classList.remove('show');
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 7. SEARCH FUNCTIONALITY
  // ═══════════════════════════════════════════════════════════════

  function setupSearch() {
    const searchInput = document.querySelector('.search-box input[type="search"]');
    const searchButton = document.querySelector('.search-box button[type="submit"]');

    if (!searchInput) return;

    // Handle search input
    searchInput.addEventListener('input', debounce((e) => {
      const query = e.target.value;
      if (query.length >= 2) {
        performSearch(query);
      }
    }, 300));

    // Handle search button
    if (searchButton) {
      searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        const query = searchInput.value;
        if (query.trim()) {
          window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
        }
      });
    }

    // Handle Enter key
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value;
        if (query.trim()) {
          window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }

  function performSearch(query) {
    // Only show live results on shop page
    if (!window.location.pathname.includes('shop.html')) return;

    const results = ProductManager.search(query);
    
    // Trigger custom event for shop.js to handle
    document.dispatchEvent(new CustomEvent('netshop:search', {
      detail: { query, results }
    }));
  }

  // Debounce helper
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // 8. GLOBAL EXPORTS (for backward compatibility)
  // ═══════════════════════════════════════════════════════════════

  // Export commonly used functions globally
  window.addToCart = (product) => CartManager.addItem(product);
  window.updateCartCount = () => CartManager.updateCartCount();
  window.safeParse = (key, fallback) => Utils.safeParse(key, fallback);
  window.safeSet = (key, value) => Utils.safeSet(key, value);
  window.formatPrice = (value) => Utils.formatPrice(value);

})();

// Add pulse animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes cartPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
  .cart-count.pulse {
    animation: cartPulse 0.3s ease;
  }
`;
document.head.appendChild(style);