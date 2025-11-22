// shop.js — safe, self-contained
// Make sure this file is included with <script defer src="shop.js"></script>

document.addEventListener("DOMContentLoaded", async () => {
  // Ensure ImageDB is loaded
  if (!window.ImageDB) {
    console.error('ImageDB not loaded! Make sure db.js is included before shop.js');
    return;
  }

  const shopGrid = document.getElementById("product-grid");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortBy = document.getElementById("sortBy");

  if (!shopGrid) return; // stop if not on shop page

  // Initialize IndexedDB
  try {
    await ImageDB.init();
  } catch (err) {
    console.error('Failed to initialize IndexedDB:', err);
    showMessage?.('Could not initialize image storage. Some images may not load.', 'error');
  }

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

  // Fetch product image from IndexedDB
  async function getProductImage(product) {
    if (!product.hasImage) return ''; // No image to fetch
    try {
      const imageData = await ImageDB.getImage(product.id);
      return imageData || '';
    } catch (err) {
      console.warn('Failed to fetch image for product:', product.id, err);
      return '';
    }
  }

  // Render products
  async function renderProducts(products) {
    shopGrid.innerHTML = "";
    
    // Create a DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Load all products in parallel
    await Promise.all(products.map(async product => {
      // Get the image for this product if it has one
      const imageData = await getProductImage(product);
      
      const card = document.createElement("div");
      card.className = "product-card";

      // Use Jumia-like structure: media, badge, body with brand, name, price, rating and buttons
      const priceNum = Number(product.price) || 0;
      const oldPrice = product.oldPrice ? Number(product.oldPrice) : null;
      const discount = product.discount || (oldPrice ? Math.round((1 - (priceNum / oldPrice)) * 100) : null);
      
      // Build card using DOM methods for better security than innerHTML
      const cardMedia = document.createElement('div');
      cardMedia.className = 'card-media';
      
      const img = document.createElement('img');
      img.src = imageData || product.image || ''; // Fallback to legacy image or empty
      img.alt = product.name;
      cardMedia.appendChild(img);

      if (discount) {
        const badge = document.createElement('div');
        badge.className = 'discount-badge';
        badge.textContent = `${discount}% OFF`;
        cardMedia.appendChild(badge);
      }

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      const brand = document.createElement('p');
      brand.className = 'brandName';
      brand.textContent = product.brand || '';
      cardBody.appendChild(brand);

      const name = document.createElement('p');
      name.className = 'product-name';
      name.textContent = product.name;
      cardBody.appendChild(name);

      const priceRow = document.createElement('div');
      priceRow.className = 'price-row';

      const price = document.createElement('span');
      price.className = 'product-price';
      price.textContent = `₦${priceNum.toLocaleString()}`;
      priceRow.appendChild(price);

      if (oldPrice) {
        const oldPriceEl = document.createElement('span');
        oldPriceEl.className = 'old-price';
        oldPriceEl.textContent = `₦${oldPrice.toLocaleString()}`;
        priceRow.appendChild(oldPriceEl);
      }
      cardBody.appendChild(priceRow);

      const rating = document.createElement('div');
      rating.className = 'rating';
      for (let i = 0; i < 5; i++) {
        const star = document.createElement('i');
        star.className = i < 4 ? 'fa-solid fa-star' : 'fa-regular fa-star';
        rating.appendChild(star);
      }
      cardBody.appendChild(rating);

      const buttons = document.createElement('div');
      buttons.className = 'card-buttons';
      
      const cartBtn = document.createElement('button');
      cartBtn.className = 'cart-btn';
      cartBtn.textContent = 'Add to Cart';
      
      const buyBtn = document.createElement('button');
      buyBtn.className = 'buy-btn';
      buyBtn.textContent = 'Buy Now';
      
      buttons.appendChild(cartBtn);
      buttons.appendChild(buyBtn);
      cardBody.appendChild(buttons);

      card.appendChild(cardMedia);
      card.appendChild(cardBody);

      // Click the card (but not buttons) -> save and go to product page
      card.addEventListener("click", async (e) => {
        if (e.target.classList.contains("buy-btn") || e.target.classList.contains("cart-btn")) return;
        
        // Include image data when saving selectedProduct
        const productWithImage = { ...product };
        if (productWithImage.hasImage) {
          productWithImage.image = imageData;
        }
        
        try {
          localStorage.setItem("selectedProduct", JSON.stringify(productWithImage));
        } catch (err) {
          console.error("Could not save selectedProduct to localStorage:", err);
        }
        window.location.href = "product.html";
      });

      fragment.appendChild(card);
    }));

    // Add all products to the grid at once
    shopGrid.appendChild(fragment);
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
    }
  });

  // initial render
  await renderProducts(shopProducts);

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
});