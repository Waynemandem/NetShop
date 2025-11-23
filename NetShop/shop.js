// shop.js - PRODUCT DISPLAY & FILTERING
// Handles product rendering, filtering, sorting, and search

document.addEventListener("DOMContentLoaded", async () => {
  // ═══════════════════════════════════════════════════════════════
  // DOM ELEMENTS
  // ═══════════════════════════════════════════════════════════════
  const shopGrid = document.getElementById("product-grid");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortBy = document.getElementById("sortBy");

  // Debug: Log if grid element exists
  if (!shopGrid) {
    console.error('[Shop] Product grid container not found! Looking for #product-grid');
    return;
  }
  console.log('[Shop] Product grid found, initializing...');

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
  if (NetShop && NetShop.ImageManager && NetShop.ImageManager.isAvailable()) {
    await NetShop.ImageManager.init();
    console.log('[Shop] ImageManager initialized');
  }

  // ═══════════════════════════════════════════════════════════════
  // GET PRODUCTS (Use Core Manager)
  // ═══════════════════════════════════════════════════════════════
  let shopProducts = [];
  try {
    if (NetShop && NetShop.ProductManager) {
      shopProducts = NetShop.ProductManager.getProducts();
      console.log(`[Shop] Loaded ${shopProducts.length} products from ProductManager`);
    } else {
      console.warn('[Shop] ProductManager not available, using fallback products');
      shopProducts = [
        { brandName: "Nike", name: "Nike Air Sneakers", category: "men", price: 120, image: "nike1.jpeg" },
        { brandName: "Adidas", name: "Adidas Ultraboost", category: "men", price: 140, image: "adidas.jpeg" },
        { brandName: "Puma", name: "Puma Classic", category: "women", price: 100, image: "puma1.jpg" },
        { brandName: "New Balance", name: "New Balance 550", category: "men", price: 110, image: "newBalance.jpeg" },
        { brandName: "Converse", name: "Converse All Star", category: "unisex", price: 100, image: "ConverseAllStar.jpeg" },
        { brandName: "Nike", name: "Nike Stack", category: "men", price: 130, image: "nikestack.jpeg" }
      ];
    }
  } catch (err) {
    console.error('[Shop] Error loading products:', err);
    shopProducts = [];
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER PRODUCTS
  // ═══════════════════════════════════════════════════════════════
  async function renderProducts(products) {
    shopGrid.innerHTML = "";
    
    if (!products || products.length === 0) {
      shopGrid.innerHTML = `
        <div style="
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #999;
        ">
          <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
          <p style="font-size: 16px; margin: 0;">No products found.</p>
          <p style="font-size: 14px; margin: 5px 0 0 0; opacity: 0.7;">Try adjusting your filters or search terms.</p>
        </div>
      `;
      console.log('[Shop] No products to display');
      return;
    }

    console.log(`[Shop] Rendering ${products.length} products...`);
    const fragment = document.createDocumentFragment();
    
    // Render products in parallel
    try {
      await Promise.all(products.map(async product => {
        try {
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
          img.alt = product.name || 'Product';
          img.loading = "lazy";
          img.onerror = () => {
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="14" font-family="Arial"%3ENo Image%3C/text%3E%3C/svg%3E';
          };
          cardMedia.appendChild(img);

          // Discount badge
          if (discount && discount > 0) {
            const badge = document.createElement('div');
            badge.className = 'discount-badge';
            badge.textContent = `${discount}% OFF`;
            cardMedia.appendChild(badge);
          }

          // Card body
          const cardBody = document.createElement('div');
          cardBody.className = 'card-body';

          // Brand name
          if (product.brandName || product.brand) {
            const brand = document.createElement('p');
            brand.className = 'brandName';
            brand.textContent = product.brandName || product.brand;
            cardBody.appendChild(brand);
          }

          // Product name
          const name = document.createElement('p');
          name.className = 'product-name';
          name.textContent = product.name || 'Unknown Product';
          cardBody.appendChild(name);

          // Price row
          const priceRow = document.createElement('div');
          priceRow.className = 'price-row';

          const price = document.createElement('span');
          price.className = 'product-price';
          const formattedPrice = NetShop.Utils.formatPrice(priceNum);
          price.textContent = `₦${formattedPrice}`; 
          priceRow.appendChild(price);

          if (oldPrice) {
            const oldPriceEl = document.createElement('span');
            oldPriceEl.className = 'old-price';
            const formattedOldPrice = NetShop.Utils.formatPrice(oldPrice);
            oldPriceEl.textContent = `₦${formattedOldPrice}`;
            priceRow.appendChild(oldPriceEl);
          }
          cardBody.appendChild(priceRow);

          // Rating
          const rating = document.createElement('div');
          rating.className = 'rating';
          const ratingValue = product.rating || 4;
          for (let i = 0; i < 5; i++) {
            const star = document.createElement('i');
            star.className = i < ratingValue ? 'fa-solid fa-star' : 'fa-regular fa-star';
            rating.appendChild(star);
          }
          cardBody.appendChild(rating);

          // Buttons
          const buttons = document.createElement('div');
          buttons.className = 'card-buttons';
          
          const cartBtn = document.createElement('button');
          cartBtn.className = 'cart-btn';
          cartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
          cartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            try {
              NetShop.CartManager.addItem(product);
            } catch (err) {
              console.error('[Shop] Error adding to cart:', err);
            }
          });
          
          const buyBtn = document.createElement('button');
          buyBtn.className = 'buy-btn';
          buyBtn.innerHTML = '<i class="fas fa-bolt"></i> Buy Now';
          buyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            try {
              NetShop.CartManager.addItem(product);
              window.location.href = 'cart.html';
            } catch (err) {
              console.error('[Shop] Error processing buy now:', err);
            }
          });
          
          buttons.appendChild(cartBtn);
          buttons.appendChild(buyBtn);
          cardBody.appendChild(buttons);

          // Assemble card
          card.appendChild(cardMedia);
          card.appendChild(cardBody);

          // Click card to view details
          card.addEventListener("click", async (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
            
            try {
              // Save product with image
              const productWithImage = { ...product };
              if (productWithImage.hasImage || imageData) {
                productWithImage.image = imageData;
              }
              
              NetShop.Utils.safeSet("selectedProduct", productWithImage);
              window.location.href = "product.html";
            } catch (err) {
              console.error('[Shop] Error navigating to product:', err);
            }
          });

          fragment.appendChild(card);
        } catch (err) {
          console.error('[Shop] Error rendering product:', product.name, err);
        }
      }));
    } catch (err) {
      console.error('[Shop] Error in parallel rendering:', err);
    }

    shopGrid.appendChild(fragment);
    console.log('[Shop] Products rendered successfully');
  }

  // ═══════════════════════════════════════════════════════════════
  // INITIAL RENDER
  // ═══════════════════════════════════════════════════════════════
  console.log('[Shop] Initial render starting...');
  await renderProducts(shopProducts);

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY FILTER
  // ═══════════════════════════════════════════════════════════════
  if (categoryFilter) {
    categoryFilter.addEventListener("change", async () => {
      try {
        const category = categoryFilter.value;
        console.log(`[Shop] Filtering by category: ${category}`);
        
        const filtered = NetShop.ProductManager 
          ? NetShop.ProductManager.filterByCategory(category)
          : shopProducts.filter(p => category === 'all' || p.category === category);
        
        await renderProducts(filtered);
      } catch (err) {
        console.error('[Shop] Error in category filter:', err);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SORT
  // ═══════════════════════════════════════════════════════════════
  if (sortBy) {
    sortBy.addEventListener("change", async () => {
      try {
        const sortValue = sortBy.value;
        console.log(`[Shop] Sorting by: ${sortValue}`);
        
        const sorted = NetShop.ProductManager 
          ? NetShop.ProductManager.sort(shopProducts, sortValue)
          : sortProducts(shopProducts, sortValue);
        
        await renderProducts(sorted);
      } catch (err) {
        console.error('[Shop] Error in sort:', err);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SEARCH LISTENER (from core)
  // ═══════════════════════════════════════════════════════════════
  document.addEventListener('netshop:search', async (e) => {
    try {
      const { results } = e.detail;
      console.log(`[Shop] Search results: ${results.length} products`);
      await renderProducts(results);
    } catch (err) {
      console.error('[Shop] Error in search listener:', err);
    }
  });

  // Check for search query in URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  if (searchQuery) {
    try {
      console.log(`[Shop] Searching for: "${searchQuery}"`);
      const results = NetShop.ProductManager 
        ? NetShop.ProductManager.search(searchQuery)
        : shopProducts.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.brandName && p.brandName.toLowerCase().includes(searchQuery.toLowerCase()))
          );
      await renderProducts(results);
    } catch (err) {
      console.error('[Shop] Error in URL search:', err);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // FALLBACK SORT FUNCTION (if ProductManager not available)
  // ═══════════════════════════════════════════════════════════════
  function sortProducts(products, sortBy) {
    const sorted = [...products];
    switch (sortBy) {
      case 'priceLow':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'priceHigh':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'latest':
        return sorted.reverse();
      default:
        return sorted;
    }
  }

  console.log('[Shop] Initialization complete');
});