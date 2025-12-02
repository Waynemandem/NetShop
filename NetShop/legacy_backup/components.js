/* components.js
   Provides a shared `loadHeader()` function that injects a consistent header across pages.
   The script also exposes a small `NetShop.UI` helper namespace for future component hooks.
*/
(function () {
  'use strict';

  window.NetShop = window.NetShop || {};
  window.NetShop.UI = window.NetShop.UI || {};

  // Inject components.css if not present
  function ensureCSS() {
    if (!document.querySelector('link[data-netshop-components]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'components.css';
      link.setAttribute('data-netshop-components', '1');
      document.head.appendChild(link);
    }
  }

  // Small safe helper to fetch product names for autocomplete (reads from localStorage 'shopProducts')
  function getProductNames() {
    try {
      const list = JSON.parse(localStorage.getItem('shopProducts')) || [];
      return list.map(p => ({ name: p.name, id: p.id, image: p.image }));
    } catch (e) { return []; }
  }

  // Build header HTML and wire interactions
  function loadHeader() {
    ensureCSS();

    const headerEls = document.querySelectorAll('.main-header');
    if (!headerEls || headerEls.length === 0) return;

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const cartCount = JSON.parse(localStorage.getItem('cart') || '[]').length || 0;

    const headerHTML = `
      <div class="header-container container">
        <div class="header-left">
          <button class="hamburger icon-btn" aria-label="Open menu"><i class="fas fa-bars"></i></button>
          <a class="logo" href="netshop.html">NetShop</a>
        </div>

        <div class="header-search" style="position:relative;">
          <input aria-label="Search products" id="ns-search-input" placeholder="Search products, brands..." autocomplete="off">
          <div id="ns-autocomplete" class="autocomplete-list hide" aria-hidden="true"></div>
        </div>

        <div class="header-actions">
          <nav class="nav">
            <a class="nav-link" href="netshop.html">Home</a>
            <a class="nav-link" href="shop.html">Shop</a>
            <a class="nav-link" href="orders.html">Orders</a>
            <a class="nav-link" href="seller.html">Seller</a>
            <a class="nav-link" href="dashboard.html">Dashboard</a>
            <a class="nav-link" href="cart.html"> <i class="fas fa-shopping-cart"></i> <span class="badge" id="ns-cart-count">${cartCount}</span></a>
          </nav>
          <div>
            ${user ? `<a class="nav-link" href="dashboard.html">Hello, ${user.name.split(' ')[0]}</a>` : `<a class="nav-link" href="#" id="ns-login">Login</a>`}
          </div>
        </div>
      </div>

      <div class="mobile-nav-panel" id="ns-mobile-panel" aria-hidden="true">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
          <a class="logo" href="netshop.html">NetShop</a>
          <button class="icon-btn" id="ns-close-panel" aria-label="Close menu"><i class="fas fa-times"></i></button>
        </div>
        <nav>
          <a class="nav-link" href="netshop.html">Home</a>
          <a class="nav-link" href="shop.html">Shop</a>
          <a class="nav-link" href="orders.html">Orders</a>
          <a class="nav-link" href="seller.html">Seller</a>
          <a class="nav-link" href="dashboard.html">Dashboard</a>
          <a class="nav-link" href="cart.html">Cart</a>
        </nav>
        <div style="margin-top:1rem;">
          ${user ? `<a class="nav-link" href="dashboard.html">Account</a><a class="nav-link" href="#" id="ns-logout-mobile">Logout</a>` : `<a class="nav-link" href="#" id="ns-login-mobile">Login / Sign up</a>`}
        </div>
      </div>
    `;

    headerEls.forEach(el => el.innerHTML = headerHTML);

    // Wire interactions
    const hamburger = document.querySelector('.hamburger');
    const panel = document.getElementById('ns-mobile-panel');
    const closeBtn = document.getElementById('ns-close-panel');
    const login = document.getElementById('ns-login');
    const loginMobile = document.getElementById('ns-login-mobile');
    const logoutMobile = document.getElementById('ns-logout-mobile');
    const cartCountEl = document.getElementById('ns-cart-count');

    function openPanel() { panel.classList.add('show'); panel.setAttribute('aria-hidden', 'false'); }
    function closePanel() { panel.classList.remove('show'); panel.setAttribute('aria-hidden', 'true'); }

    if (hamburger) hamburger.addEventListener('click', openPanel);
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && !hamburger.contains(e.target)) closePanel();
    });

    // Login placeholders (will be implemented in auth step)
    if (login) login.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'login.html'; });
    if (loginMobile) loginMobile.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'login.html'; });
    if (logoutMobile) logoutMobile.addEventListener('click', (e) => { e.preventDefault(); localStorage.removeItem('user'); window.location.reload(); });

    // Simple search autocomplete mock
    const searchInput = document.getElementById('ns-search-input');
    const autocomplete = document.getElementById('ns-autocomplete');

    function showAutocomplete(items) {
      if (!items || items.length === 0) { autocomplete.classList.add('hide'); autocomplete.setAttribute('aria-hidden', 'true'); autocomplete.innerHTML = ''; return; }
      autocomplete.classList.remove('hide'); autocomplete.setAttribute('aria-hidden', 'false');
      autocomplete.innerHTML = items.slice(0, 8).map(it => `\n        <div class="autocomplete-item" data-name="${it.name}">\n          <img src="${it.image || ''}" alt="" style="width:40px;height:40px;object-fit:cover;border-radius:6px;">\n          <div>\n            <div style=\"font-weight:600;\">${it.name}</div>\n          </div>\n        </div>\n      `).join('');

      // wire clicks
      autocomplete.querySelectorAll('.autocomplete-item').forEach(node => {
        node.addEventListener('click', () => {
          const name = node.dataset.name;
          window.location.href = `product.html?name=${encodeURIComponent(name)}`;
        });
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = (e.target.value || '').toLowerCase().trim();
        if (!q) return showAutocomplete([]);
        const names = getProductNames();
        const matches = names.filter(n => n.name.toLowerCase().includes(q));
        showAutocomplete(matches);
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = (e.target.value || '').trim();
          if (!q) return;
          window.location.href = `shop.html?search=${encodeURIComponent(q)}`;
        }
      });

      document.addEventListener('click', (e) => { if (!autocomplete.contains(e.target) && e.target !== searchInput) showAutocomplete([]); });
    }

    // expose small updater
    window.NetShop.UI.updateCartCount = function () {
      const c = JSON.parse(localStorage.getItem('cart') || '[]').length || 0;
      if (cartCountEl) cartCountEl.textContent = c;
    };

  }

  // expose
  window.loadHeader = loadHeader;

  // Auto-run if DOM already ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    try { loadHeader(); } catch (e) { }
  } else {
    document.addEventListener('DOMContentLoaded', loadHeader);
  }

})();
