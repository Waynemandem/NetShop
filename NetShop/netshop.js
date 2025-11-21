// ═══════════════════════════════════════════════════════════════
// NETSHOP.JS - CLEANED VERSION
// All menu code removed - handled by netshop_menu_final.js
// ═══════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // Ensure shared components (header, utilities) are available.
  // If `loadHeader` is not defined, dynamically load `components.js` so pages don't need manual script edits.
  if (typeof window.loadHeader !== 'function') {
    const _s = document.createElement('script');
    _s.src = 'components.js';
    _s.defer = true;
    document.head.appendChild(_s);
  }

  console.log('[NetShop Page] Loading...');

  // ═══════════════════════════════════════════════════════════════
  // DOM ELEMENTS
  // ═══════════════════════════════════════════════════════════════
  const productGrid = document.getElementById("productGrid");
  const productGrid2 = document.getElementById("productGrid2");
  const promoSection = document.getElementById("promo-section");
  const categoryGrid = document.getElementById("category-grid");

  // ═══════════════════════════════════════════════════════════════
  // PRODUCT DATA
  // ═══════════════════════════════════════════════════════════════
  const products = [
    { brandName: "Nike", name: "Nike Air Sneakers", price: 120, image: "nike1.jpeg" },
    { brandName: "Adidas", name: "Adidas Ultraboost", price: 140, image: "adidas.jpeg" },
    { brandName: "Puma", name: "Puma Classic", price: 100, image: "puma1.jpg" },
    { brandName: "New Balance", name: "New Balance 550", price: 110, image: "newBalance.jpeg" },
    { brandName: "Converse", name: "Converse All Star", price: 100, image: "ConverseAllStar.jpeg" },
    { brandName: "Nike", name: "Nike Stack", price: 130, image: "nikestack.jpeg" }
  ].map(p => ({ 
    ...p, 
    id: NetShop.Utils.slugify(p.name)
  }));

  const products2 = [
    { brandName: "Big 4", name: "Rema Swag", price: 499.99, image: "starboy.jpg" },
    { brandName: "Africon", name: "Africa", price: 199.99, image: "ConverseAllStar.jpeg" },
    { brandName: "Wayne Real Estates", name: "4 Bedroom House", price: 31000000, image: "mistressHome.jpg" },
    { brandName: "Big 4", name: "Suit", price: 310, image: "suit.jpg" },
    { brandName: "Big 4", name: "Track Suit", price: 350, image: "tracktech.jpg" },
    { brandName: "Big 4", name: "Sharp Fit", price: 310.99, image: "sharpfit.jpg" },
    { brandName: "Big 4", name: "Cloth Collection", price: 699.99, image: "tops&bottom.jpg" },
    { brandName: "Big 4", name: "Shoe Collection", price: 999.99, image: "shoes.jpg" },
    { brandName: "Big 4", name: "Jogger and Shoes", price: 699.99, image: "track&shoe.jpg" }
  ].map(p => ({ 
    ...p, 
    id: NetShop.Utils.slugify(p.name)
  }));

  // Save combined catalog if not present
  const existingProducts = NetShop.Utils.safeParse("shopProducts");
  if (!existingProducts || existingProducts.length === 0) {
    NetShop.Utils.safeSet("shopProducts", [...products, ...products2]);
  }

  // ═══════════════════════════════════════════════════════════════
  // PRODUCT CARD BUILDER
  // ═══════════════════════════════════════════════════════════════
  function buildProductCard(p, className = "product-card") {
    const card = document.createElement("article");
    card.className = className;
    card.dataset.id = p.id;
    card.dataset.name = p.name;

    const link = document.createElement("a");
    link.className = "product-link";
    link.href = `product.html?name=${encodeURIComponent(p.name)}`;
    link.setAttribute("aria-label", `${p.name} details`);

    const img = document.createElement("img");
    img.src = p.image || "";
    img.alt = p.name || "Product image";
    img.loading = "lazy";

    link.appendChild(img);
    
    const brand = document.createElement("p");
    brand.className = "brandName";
    brand.textContent = p.brandName || "";
    link.appendChild(brand);

    const name = document.createElement("p");
    name.className = "product-name";
    name.textContent = p.name || "";
    link.appendChild(name);

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = `₦${NetShop.Utils.formatPrice(p.price)}`;
    link.appendChild(price);

    // Buttons
    const buttons = document.createElement("div");
    buttons.className = "card-buttons";

     const buyBtn = document.createElement("button");
    buyBtn.type = "button";
    buyBtn.className = "buy-btn";
    buyBtn.textContent = "Buy Now";
    buyBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      NetShop.CartManager.addItem(p);
      window.location.href = "cart.html";
    });

    const cartBtn = document.createElement("button");
    cartBtn.type = "button";
    cartBtn.className = "cart-btn";
    cartBtn.textContent = "Add to Cart";
    cartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      NetShop.CartManager.addItem(p);
    });

    buttons.appendChild(buyBtn);
    buttons.appendChild(cartBtn);
    card.appendChild(link);
    card.appendChild(buttons);

    return card;
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER GRIDS
  // ═══════════════════════════════════════════════════════════════
  function renderGrid(container, list, className) {
    if (!container) return;
    container.innerHTML = "";
    const fragment = document.createDocumentFragment();
    list.forEach(p => fragment.appendChild(buildProductCard(p, className)));
    container.appendChild(fragment);
  }

  // Render products
  if (productGrid) renderGrid(productGrid, products, "product-card");
  if (productGrid2) renderGrid(productGrid2, products2, "product-card2");

  // ═══════════════════════════════════════════════════════════════
  // PROMO SECTION
  // ═══════════════════════════════════════════════════════════════
  const promos = [
    { image: "iphone-promo.jpg", title: "New Arrivals", subtitle: "Fresh styles for 2025", link: "#" },
    { image: "food-banner.jpg", title: "Flash Sale", subtitle: "Up to 50% off", link: "#" }
  ];

  if (promoSection) {
    promoSection.innerHTML = "";
    const fragment = document.createDocumentFragment();
    
    promos.forEach(({ image, title, subtitle, link }) => {
      const promo = document.createElement("div");
      promo.className = "promo-card";
      
      const a = document.createElement("a");
      a.href = link;
      
      const img = document.createElement("img");
      img.src = image;
      img.alt = title;
      img.loading = "lazy";
      
      const overlay = document.createElement("div");
      overlay.className = "promo-overlay";
      overlay.innerHTML = `<strong>${title}</strong><span>${subtitle}</span>`;
      
      a.appendChild(img);
      a.appendChild(overlay);
      promo.appendChild(a);
      fragment.appendChild(promo);
    });
    
    promoSection.appendChild(fragment);
  }

  // ═══════════════════════════════════════════════════════════════
  // CATEGORIES SECTION
  // ═══════════════════════════════════════════════════════════════
  const categories = [
    { image: "crocs.jpg", name: "Unisex Footwear", link: "#" },
    { image: "perfume.jpg", name: "Hygiene and Self Care", link: "#" },
    { image: "nikestyle.jpg", name: "Nike", link: "#" },
    { image: "iphone-promo.jpg", name: "Tech Gadgets", link: "#" },
    { image: "mistressHome.jpg", name: "Home & Living", link: "#" },
    { image: "burger.jpg", name: "Fast Food", link: "#" },
    { image: "Menclothing.jpg", name: "Men's Clothing", link: "#" },
    { image: "womanclothing.jpg", name: "Women's Clothing", link: "#" }
  ];

  if (categoryGrid) {
    categoryGrid.innerHTML = "";
    const fragment = document.createDocumentFragment();
    
    categories.forEach(({ image, name, link }) => {
      const a = document.createElement("a");
      a.className = "category-card";
      a.href = link;
      
      const img = document.createElement("img");
      img.src = image;
      img.alt = name;
      img.loading = "lazy";
      
      const info = document.createElement("div");
      info.className = "category-name";
      info.textContent = name;
      
      a.appendChild(img);
      a.appendChild(info);
      fragment.appendChild(a);
    });
    
    categoryGrid.appendChild(fragment);
  }

  // ═══════════════════════════════════════════════════════════════
  // HELP DROPDOWN
  // ═══════════════════════════════════════════════════════════════
  const helpBtn = document.getElementById('help-btn');
  const helpDropdown = document.getElementById('help-dropdown');
  const closeHelp = document.querySelector('.close-help');

  if (helpBtn && helpDropdown) {
    helpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      helpDropdown.classList.toggle('show');
    });

    if (closeHelp) {
      closeHelp.addEventListener('click', () => {
        helpDropdown.classList.remove('show');
      });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!helpDropdown.contains(e.target) && !helpBtn.contains(e.target)) {
        helpDropdown.classList.remove('show');
      }
    });
  }

  console.log('[NetShop Page] ✓ Initialized successfully');

})();