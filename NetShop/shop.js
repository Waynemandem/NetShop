// shop.js - CLEANED VERSION
// Removed duplicate functions now in netshop_core_fixed.js

document.addEventListener("DOMContentLoaded", async () => {
  // ═══════════════════════════════════════════════════════════════
  // DOM ELEMENTS
  // ═══════════════════════════════════════════════════════════════
  const shopGrid = document.getElementById("product-grid");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortBy = document.getElementById("sortBy");

  if (!shopGrid) return; // Exit if not on shop page

  // ═══════════════════════════════════════════════════════════════
  // DELETED - Now in netshop_core_fixed.js:
  // - safeParse()
  // - safeSet()
  // - addToCart()
  // - normalizePrice()
  // ═══════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════
  // INITIALIZE IMAGEDB
  // ═══════════════════════════════════════════════════════════════
  if (NetShop.ImageManager.isAvailable()) {
    await NetShop.ImageManager.init();
  }

  // ═══════════════════════════════════════════════════════════════
  // GET PRODUCTS (Use Core Manager)
  // ═══════════════════════════════════════════════════════════════
  let shopProducts = NetShop.ProductManager.getProducts();

  // ═══════════════════════════════════════════════════════════════
  // RENDER PRODUCTS
  // ═══════════════════════════════════════════════════════════════
  async function renderProducts(products) {
    shopGrid.innerHTML = "";
    
    if (!products || products.length === 0) {
      shopGrid.innerHTML = '<p style="text-align:center; padding:40px;">No products found.</p>';
      return;
    }

    const fragment = document.createDocumentFragment();
    
    // Render products in parallel
    await Promise.all(products.map(async product => {
      // Get image from ImageManager (handles both IndexedDB and fallback)
      const imageData = await NetShop.ImageManager.getImage(product);
      
      const card = document.createElement("div");
      card.className = "product-card";

      // Calculate discount
      const priceNum = product.price || 0;
      const oldPrice = product.oldPrice ? Number(product.oldPrice) : null;
      const discount = product.discount || 
        (oldPrice ? Math.round((1 - (priceNum / oldPrice)) * 100) : null);
      
      // Build card structure
      const cardMedia = document.createElement('div');
      cardMedia.className = 'card-media';
      
      const img = document.createElement('img');
      img.src = imageData || product.image || '';
      img.alt = product.name;
      img.loading = "lazy";
      cardMedia.appendChild(img);

      // Discount badge
      if (discount) {
        const badge = document.createElement('div');
        badge.className = 'discount-badge';
        badge.textContent = `${discount}% OFF`;
        cardMedia.appendChild(badge);
      }

      // Card body
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      const brand = document.createElement('p');
      brand.className = 'brandName';
      brand.textContent = product.brandName || product.brand || '';
      cardBody.appendChild(brand);

      const name = document.createElement('p');
      name.className = 'product-name';
      name.textContent = product.name;
      cardBody.appendChild(name);

      // Price row
      const priceRow = document.createElement('div');
      priceRow.className = 'price-row';

      const price = document.createElement('span');
      price.className = 'product-price';
      price.textContent = `₦${NetShop.Utils.formatPrice(priceNum)}`; // USE CORE
      priceRow.appendChild(price);

      if (oldPrice) {
        const oldPriceEl = document.createElement('span');
        oldPriceEl.className = 'old-price';
        oldPriceEl.textContent = `₦${NetShop.Utils.formatPrice(oldPrice)}`; // USE CORE
        priceRow.appendChild(oldPriceEl);
      }
      cardBody.appendChild(priceRow);

      // Rating
      const rating = document.createElement('div');
      rating.className = 'rating';
      for (let i = 0; i < 5; i++) {
        const star = document.createElement('i');
        star.className = i < 4 ? 'fa-solid fa-star' : 'fa-regular fa-star';
        rating.appendChild(star);
      }
      cardBody.appendChild(rating);

      // Buttons
      const buttons = document.createElement('div');
      buttons.className = 'card-buttons';
      
      const cartBtn = document.createElement('button');
      cartBtn.className = 'cart-btn';
      cartBtn.textContent = 'Add to Cart';
      cartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        NetShop.CartManager.addItem(product); // USE CORE
      });
      
      const buyBtn = document.createElement('button');
      buyBtn.className = 'buy-btn';
      buyBtn.textContent = 'Buy Now';
      buyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        NetShop.CartManager.addItem(product); // USE CORE
        window.location.href = 'cart.html';
      });
      
      buttons.appendChild(cartBtn);
      buttons.appendChild(buyBtn);
      cardBody.appendChild(buttons);

      // Assemble card
      card.appendChild(cardMedia);
      card.appendChild(cardBody);

      // Click card to view details
      card.addEventListener("click", async (e) => {
        if (e.target.tagName === 'BUTTON') return;
        
        // Save product with image
        const productWithImage = { ...product };
        if (productWithImage.hasImage) {
          productWithImage.image = imageData;
        }
        
        NetShop.Utils.safeSet("selectedProduct", productWithImage); // USE CORE
        window.location.href = "product.html";
      });

      fragment.appendChild(card);
    }));

    shopGrid.appendChild(fragment);
  }

  // ═══════════════════════════════════════════════════════════════
  // INITIAL RENDER
  // ═══════════════════════════════════════════════════════════════
  await renderProducts(shopProducts);

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY FILTER
  // ═══════════════════════════════════════════════════════════════
  if (categoryFilter) {
    categoryFilter.addEventListener("change", async () => {
      const category = categoryFilter.value;
      const filtered = NetShop.ProductManager.filterByCategory(category); // USE CORE
      await renderProducts(filtered);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SORT
  // ═══════════════════════════════════════════════════════════════
  if (sortBy) {
    sortBy.addEventListener("change", async () => {
      const sortValue = sortBy.value;
      const sorted = NetShop.ProductManager.sort(shopProducts, sortValue); // USE CORE
      await renderProducts(sorted);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SEARCH LISTENER (from core)
  // ═══════════════════════════════════════════════════════════════
  document.addEventListener('netshop:search', async (e) => {
    const { results } = e.detail;
    await renderProducts(results);
  });

  // Check for search query in URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  if (searchQuery) {
    const results = NetShop.ProductManager.search(searchQuery); // USE CORE
    await renderProducts(results);
  }
});