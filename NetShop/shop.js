// shop.js — safe, self-contained
// Make sure this file is included with <script defer src="shop.js"></script>

document.addEventListener("DOMContentLoaded", () => {
  const shopGrid = document.getElementById("product-grid");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortBy = document.getElementById("sortBy");

  if (!shopGrid) return; // stop if not on shop page

  const defaultProducts = [
    { brand: "Nike", name: "Air Max", category: "men", price: 120, image: "nike1.jpeg" },
    { brand: "Adidas", name: "Ultraboost", category: "men", price: 140, image: "adidas.jpeg" },
    { brand: "Puma", name: "Classic Runner", category: "women", price: 110, image: "puma1.jpg" },
    { brand: "Apple", name: "AirPods Pro", category: "electronics", price: 250, image: "airpods.jpeg" },
    { brand: "Casio", name: "Digital Watch", category: "accessories", price: 75, image: "watch.jpeg" },
    { brand: "Vans", name: "Converse All Star", category: "unisex", price: 99.99, image: "ConverseAllStar.jpeg" },
    { brand: "New Balance", name: "NB 550", category: "men", price: 110, image: "newBalance.jpeg" },
    { brand: "Big 4", name: "Suit", category: "men", price: 310, image: "suit.jpg" }
  ];

  // Read products from localStorage if present (so seller-added items show up). Fall back to defaultProducts.
  const safeParse = (key, fallback = null) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      console.warn('safeParse failed for', key, e);
      return fallback;
    }
  };

  let shopProducts = safeParse('shopProducts', defaultProducts);

  // normalize price fields to numbers (migrate older entries that used strings like "$120")
  const normalizePrice = (v) => {
    if (v == null || v === '') return null;
    if (typeof v === 'number') return v;
    const cleaned = String(v).replace(/[^0-9.\-]/g, '');
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : null;
  };

  shopProducts = (shopProducts || []).map(p => ({ ...p, price: normalizePrice(p.price), oldPrice: normalizePrice(p.oldPrice) }));

  // Ensure there's a persisted catalog for other pages to read (write only if absent)
  if (!localStorage.getItem('shopProducts')) {
    try {
      localStorage.setItem('shopProducts', JSON.stringify(shopProducts));
    } catch (err) {
      console.warn('Could not write shopProducts to localStorage:', err);
    }
  }

  // Render products
  function renderProducts(products) {
    shopGrid.innerHTML = "";
    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";

      // Use Jumia-like structure: media, badge, body with brand, name, price, rating and buttons
      const priceNum = Number(product.price) || 0;
      const oldPrice = product.oldPrice ? Number(product.oldPrice) : null;
      const discount = product.discount || (oldPrice ? Math.round((1 - (priceNum / oldPrice)) * 100) : null);
      card.innerHTML = `
        <div class="card-media">
          <img src="${product.image}" alt="${product.name}">
          ${discount ? `<div class="discount-badge">${discount}% OFF</div>` : ''}
        </div>
        <div class="card-body">
          <p class="brandName">${product.brand || ''}</p>
          <p class="product-name">${product.name}</p>
          <div class="price-row">
            <span class="product-price">₦${priceNum.toLocaleString()}</span>
            ${oldPrice ? `<span class="old-price">₦${oldPrice.toLocaleString()}</span>` : ''}
          </div>
          <div class="rating">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-regular fa-star"></i>
          </div>
          <div class="card-buttons">
            <button class="cart-btn">Add to Cart</button>
            <button class="buy-btn">Buy Now</button>
          </div>
        </div>
      `;

      // Click the card (but not buttons) -> save and go to product page
      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("buy-btn") || e.target.classList.contains("cart-btn")) return;
        try {
          localStorage.setItem("selectedProduct", JSON.stringify(product));
        } catch (err) {
          console.error("Could not save selectedProduct to localStorage:", err);
        }
        window.location.href = "product.html";
      });

      shopGrid.appendChild(card);
    });
  }

  // initial
  renderProducts(shopProducts);

  // filter
  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      const cat = categoryFilter.value;
      const filtered = cat === "all" ? shopProducts : shopProducts.filter(p => p.category === cat);
      renderProducts(filtered);
    });
  }

  // sort
  if (sortBy) {
    sortBy.addEventListener("change", () => {
      const val = sortBy.value;
      let sorted = [...shopProducts];
      if (val === "priceLow") sorted.sort((a, b) => a.price - b.price);
      if (val === "priceHigh") sorted.sort((a, b) => b.price - a.price);
      renderProducts(sorted);
    });
  }

  // localStorage helper for cart persistence (safeParse is declared above)
  const safeSet = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.warn('safeSet', e); }
  };

  function addToCart(product) {
    if (!product || !product.name) return;
    const cart = safeParse('cart', []) || [];
    const idx = cart.findIndex(i => i.name === product.name);
    const price = Number(product.price) || 0;
    if (idx >= 0) {
      cart[idx].quantity = (cart[idx].quantity || 0) + 1;
    } else {
      cart.push({ name: product.name, price, image: product.image || '', quantity: 1 });
    }
    safeSet('cart', cart);
    // update visible cart count
    const el = document.getElementById('cart-count') || document.querySelector('.cart-count');
    if (el) {
      const total = cart.reduce((s, it) => s + (it.quantity || 0), 0);
      el.textContent = total;
    }
  }

  // Add / Buy global handlers (toasts + cart persistence)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-btn')) {
      const card = e.target.closest('.product-card');
      if (!card) return;
      const name = card.querySelector('.product-name')?.textContent?.trim() || 'Item';
      const priceText = card.querySelector('.product-price')?.textContent || '';
      const price = parseFloat(String(priceText).replace(/[^0-9.]/g, '')) || 0;
      const image = card.querySelector('img')?.src || '';
      addToCart({ name, price, image });
      if (typeof showToast === 'function') showToast(`${name} added to cart 🛒`, 'success');
      else console.log(`${name} added to cart 🛒`);
      return;
    }

    if (e.target.classList.contains('buy-btn')) {
      const card = e.target.closest('.product-card');
      const name = card?.querySelector('.product-name')?.textContent?.trim() || 'Item';
      // add to cart and go to checkout
      const priceText = card?.querySelector('.product-price')?.textContent || '';
      const price = parseFloat(String(priceText).replace(/[^0-9.]/g, '')) || 0;
      const image = card?.querySelector('img')?.src || '';
      addToCart({ name, price, image });
      if (typeof showToast === 'function') showToast(`Proceeding to buy ${name} 💳`, 'success');
      else console.log(`Proceeding to buy ${name} 💳`);
      // go to cart/checkout
      window.location.href = 'cart.html';
      return;
    }
  });
});
