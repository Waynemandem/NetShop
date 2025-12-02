// ═══════════════════════════════════════════════════════════════
// NETSHOP CORE - CLEANED VERSION (Menu code removed)
// ═══════════════════════════════════════════════════════════════

(function () {
  'use strict';

  console.log('[NetShop Core] Loading...');

  // ═══════════════════════════════════════════════════════════════
  // 1. TOAST MANAGER
  // ═══════════════════════════════════════════════════════════════

  const ToastManager = {
    container: null,

    init() {
      if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        container.id = 'toastContainer';
        document.body.appendChild(container);
      }
      this.container = document.querySelector('.toast-container');
    },

    show(message, type = 'success') {
      if (!this.container) this.init();

      const toast = document.createElement('div');
      toast.className = `toast ${type}`;

      let icon = 'fa-info-circle';
      switch (type) {
        case 'success': icon = 'fa-check-circle'; break;
        case 'error': icon = 'fa-times-circle'; break;
        case 'warning': icon = 'fa-exclamation-circle'; break;
      }

      toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close">&times;</button>
      `;

      this.container.appendChild(toast);

      const closeBtn = toast.querySelector('.toast-close');
      closeBtn?.addEventListener('click', () => this.close(toast));

      setTimeout(() => this.close(toast), 3000);
    },

    close(toast) {
      toast.style.animation = 'slideOut 0.3s ease-out forwards';
      setTimeout(() => toast.remove(), 300);
    },

    success(message) { this.show(message, 'success'); },
    error(message) { this.show(message, 'error'); },
    warning(message) { this.show(message, 'warning'); },
    info(message) { this.show(message, 'info'); }
  };

  // ═══════════════════════════════════════════════════════════════
  // 2. UTILITIES
  // ═══════════════════════════════════════════════════════════════

  window.NetShop = window.NetShop || {};

  const Utils = {
    safeParse(key, fallback = null) {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
      } catch (error) {
        console.warn(`[NetShop] Failed to parse ${key}:`, error);
        return fallback;
      }
    },

    safeSet(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          console.error('[NetShop] localStorage is full!');
          ToastManager.error('Storage is full. Please clear some data.');
        } else {
          console.error('[NetShop] Failed to save:', error);
        }
        return false;
      }
    },

    slugify(text) {
      return String(text || '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
    },

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

    normalizePrice(value) {
      if (value == null || value === '') return 0;
      if (typeof value === 'number') return value;
      const cleaned = String(value).replace(/[^0-9.\-]/g, '');
      const parsed = parseFloat(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }
  };

  NetShop.Utils = Utils;

  // ═══════════════════════════════════════════════════════════════
  // 3. CART MANAGER
  // ═══════════════════════════════════════════════════════════════

  const CartManager = {
    STORAGE_KEY: 'cart',

    getCart() {
      return Utils.safeParse(this.STORAGE_KEY, []);
    },

    saveCart(cart) {
      return Utils.safeSet(this.STORAGE_KEY, cart);
    },

    addItem(product) {
      console.log('[CartManager] Adding item:', product);

      if (!product || !product.name) {
        console.warn('[CartManager] Invalid product:', product);
        ToastManager.error('Invalid product');
        return false;
      }

      const cart = this.getCart();
      const price = Utils.normalizePrice(product.price);

      const index = cart.findIndex(item =>
        item.id === product.id || item.name === product.name
      );

      if (index >= 0) {
        cart[index].quantity = (cart[index].quantity || 0) + 1;
      } else {
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
        ToastManager.success(`${product.name} added to cart 🛒`);
        console.log('[CartManager] Item added successfully');
      } else {
        ToastManager.error('Failed to add item to cart');
      }
      return saved;
    },

    removeItem(productId) {
      const cart = this.getCart();
      const filtered = cart.filter(item =>
        item.id !== productId && item.name !== productId
      );

      if (filtered.length < cart.length) {
        this.saveCart(filtered);
        this.updateCartCount();
        ToastManager.success('Item removed from cart');
        return true;
      }
      return false;
    },

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

    clearCart() {
      this.saveCart([]);
      this.updateCartCount();
    },

    getItemCount() {
      const cart = this.getCart();
      return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    },

    getSubtotal() {
      const cart = this.getCart();
      return cart.reduce((sum, item) => {
        const price = Utils.normalizePrice(item.price);
        const qty = item.quantity || 0;
        return sum + (price * qty);
      }, 0);
    },

    updateCartCount() {
      const count = this.getItemCount();
      const elements = document.querySelectorAll('.cart-count, #cart-count');

      elements.forEach(el => {
        el.textContent = count;
        el.classList.add('pulse');
        setTimeout(() => el.classList.remove('pulse'), 300);
      });
    }
  };

  NetShop.CartManager = CartManager;

  // ═══════════════════════════════════════════════════════════════
  // 4. PRODUCT MANAGER
  // ═══════════════════════════════════════════════════════════════

  const ProductManager = {
    STORAGE_KEY: 'shopProducts',
    _products: [],

    DEFAULT_PRODUCTS: [
      { brandName: "Nike", name: "Nike Air Sneakers", category: "men", price: 120, image: "nike1.jpeg" },
      { brandName: "Adidas", name: "Adidas Ultraboost", category: "men", price: 140, image: "adidas.jpeg" },
      { brandName: "Puma", name: "Puma Classic", category: "women", price: 100, image: "puma1.jpg" },
      { brandName: "New Balance", name: "New Balance 550", category: "men", price: 110, image: "newBalance.jpeg" },
      { brandName: "Converse", name: "Converse All Star", category: "unisex", price: 100, image: "ConverseAllStar.jpeg" },
      { brandName: "Nike", name: "Nike Stack", category: "men", price: 130, image: "nikestack.jpeg" }
    ],

    async init() {
      try {
        // Try to load from IndexedDB first
        if (window.getProducts) {
          const dbProducts = await window.getProducts();
          if (dbProducts && dbProducts.length > 0) {
            this._products = dbProducts;
            console.log(`[ProductManager] Loaded ${dbProducts.length} products from DB`);
            return;
          }
        }
      } catch (e) {
        console.error('[ProductManager] Failed to load from DB:', e);
      }

      // Fallback to localStorage or defaults
      const localProducts = Utils.safeParse(this.STORAGE_KEY, []);
      if (localProducts.length > 0) {
        this._products = localProducts;
      } else {
        this._products = this.DEFAULT_PRODUCTS.map(p => ({
          ...p,
          id: p.id || Utils.slugify(p.name),
          price: Utils.normalizePrice(p.price)
        }));
      }

      // Sync to DB if we have products but DB was empty
      if (this._products.length > 0 && window.saveProduct) {
        this._products.forEach(p => window.saveProduct(p));
      }
    },

    getProducts() {
      return this._products;
    },

    async addProduct(product) {
      const exists = this._products.find(p =>
        p.id === product.id || p.name === product.name
      );

      if (exists) {
        ToastManager.error('Product already exists');
        return false;
      }

      const newProduct = {
        ...product,
        id: product.id || Utils.slugify(product.name),
        price: Utils.normalizePrice(product.price)
      };

      this._products.push(newProduct);

      // Save to DB
      if (window.saveProduct) {
        try {
          await window.saveProduct(newProduct);
        } catch (e) {
          console.error('[ProductManager] Failed to save to DB:', e);
        }
      }

      // Backup to localStorage
      Utils.safeSet(this.STORAGE_KEY, this._products);

      return true;
    },

    getProductById(id) {
      return this._products.find(p => p.id === id || p.name === id);
    },

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

    filterByCategory(category) {
      if (!category || category === 'all') {
        return this.getProducts();
      }
      return this.getProducts().filter(p => p.category === category);
    },

    sort(products, sortBy) {
      const sorted = [...products];

      switch (sortBy) {
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
  // 5. SEARCH FUNCTIONALITY
  // ═══════════════════════════════════════════════════════════════

  function setupSearch() {
    const searchInput = document.querySelector('.search-box input[type="search"]');
    const searchButton = document.querySelector('.search-box button[type="submit"]');

    if (!searchInput) return;

    searchInput.addEventListener('input', debounce((e) => {
      const query = e.target.value;
      if (query.length >= 2) {
        performSearch(query);
      }
    }, 300));

    if (searchButton) {
      searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        const query = searchInput.value;
        if (query.trim()) {
          window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
        }
      });
    }

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
    if (!window.location.pathname.includes('shop.html')) return;

    const results = ProductManager.search(query);
    document.dispatchEvent(new CustomEvent('netshop:search', {
      detail: { query, results }
    }));
  }

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
  // 6. INITIALIZATION
  // ═══════════════════════════════════════════════════════════════

  function init() {
    console.log('[NetShop Core] Initializing...');

    init();
  }

  // ═══════════════════════════════════════════════════════════════
  // 7. GLOBAL EXPORTS
  // ═══════════════════════════════════════════════════════════════

  window.addToCart = (product) => CartManager.addItem(product);
  window.updateCartCount = () => CartManager.updateCartCount();
  window.safeParse = (key, fallback) => Utils.safeParse(key, fallback);
  window.safeSet = (key, value) => Utils.safeSet(key, value);
  window.formatPrice = (value) => Utils.formatPrice(value);
  window.showToast = (message, type) => ToastManager.show(message, type);
  window.toast = ToastManager;

})();

// Toast styles (keep existing)
const style = document.createElement('style');
style.textContent = `
  @keyframes cartPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
  .cart-count.pulse {
    animation: cartPulse 0.3s ease;
  }
  
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 99999;
    pointer-events: none;
  }
  
  .toast {
    background: white;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideIn 0.3s ease-out;
    min-width: 250px;
    max-width: 400px;
    pointer-events: all;
  }
  
  .toast.success { border-left: 4px solid #28a745; }
  .toast.success i { color: #28a745; }
  .toast.error { border-left: 4px solid #dc3545; }
  .toast.error i { color: #dc3545; }
  .toast.warning { border-left: 4px solid #ffc107; }
  .toast.warning i { color: #ffc107; }
  .toast.info { border-left: 4px solid #17a2b8; }
  .toast.info i { color: #17a2b8; }
  
  .toast i { font-size: 20px; }
  .toast-message { flex: 1; color: #333; font-size: 14px; }
  .toast-close {
    background: none;
    border: none;
    font-size: 18px;
    color: #999;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }
  .toast-close:hover { color: #333; }
`;
document.head.appendChild(style);