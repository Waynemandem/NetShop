// ...existing code...
// --- Helpers ---

document.addEventListener("DOMContentLoaded", () => {
  const cartCountElement = document.querySelector('.cart-count');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cartCountElement) {
    cartCountElement.textContent = cart.length;
  }
});


const productGrid = document.getElementById("productGrid");
const productGrid2 = document.getElementById("productGrid2");
const toastContainer = document.getElementById("toastContainer");
const promoSection = document.getElementById("promo-section");
const categoryGrid = document.getElementById("category-grid");

// Consolidated and upgraded netshop.js
// Single entry point, safer localStorage helpers, consistent selectors, accessible cards

document.addEventListener("DOMContentLoaded", () => {
  // --- Utility helpers ---
  const safeParse = (key, fallback = null) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      console.warn(`safeParse: invalid JSON for ${key}`);
      return fallback;
    }
  };

  const safeSet = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`safeSet: could not save ${key}`, e);
    }
  };

  const el = (selector) => document.querySelector(selector);
  const elById = (id) => document.getElementById(id);

  // DOM roots
  const productGrid = elById("productGrid");
  const productGrid2 = elById("productGrid2");
  const toastContainer = elById("toastContainer");
  const promoSection = elById("promo-section");
  const categoryGrid = elById("category-grid");

  function showToast(message, type = "success") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.setAttribute("role", "status");
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
  // expose globally so other scripts can reuse the same toast UI
  try { window.showToast = showToast; } catch (e) { /* ignore in non-browser env */ }

  function slugify(text = "") {
    return String(text).toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
  }

  function createTextElement(tag, className, text) {
    const o = document.createElement(tag);
    if (className) o.className = className;
    o.textContent = text;
    return o;
  }

  // --- Data ---
  const products = [
    { brandName: "Nike", name: "Nike Air Sneakers", price: 120, image: "nike1.jpeg" },
    { brandName: "Adidas", name: "Adidas Ultraboost", price: 140, image: "adidas.jpeg" },
    { brandName: "Puma", name: "Puma Classic", price: 100, image: "puma1.jpg" },
    { brandName: "New Balance", name: "New Balance 550", price: 110, image: "newBalance.jpeg" },
    { brandName: "Converse", name: "Converse All Star", price: 100, image: "ConverseAllStar.jpeg" },
    { brandName: "Nike", name: "Nike Stack", price: 130, image: "nikestack.jpeg" }
  ].map(p => ({ ...p, id: slugify(p.name) }));

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
  ].map(p => ({ ...p, id: slugify(p.name) }));

  // persist combined catalog if not present
  if (!safeParse("shopProducts")) safeSet("shopProducts", [...products, ...products2]);

  // --- Builder ---
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
    img.decoding = "async";

    link.appendChild(img);
    link.appendChild(createTextElement("p", "brandName", p.brandName || ""));
    link.appendChild(createTextElement("p", "product-name", p.name || ""));
    link.appendChild(createTextElement("p", "product-price", p.price || ""));

    const buttons = document.createElement("div");
    buttons.className = "card-buttons";

    const buy = document.createElement("button");
    buy.type = "button";
    buy.className = "buy-btn";
    buy.dataset.action = "buy";
    buy.setAttribute("aria-label", `Buy ${p.name}`);
    buy.textContent = "Buy Now";

    const cart = document.createElement("button");
    cart.type = "button";
    cart.className = "cart-btn";
    cart.dataset.action = "cart";
    cart.setAttribute("aria-label", `Add ${p.name} to cart`);
    cart.textContent = "Add to Cart";

    buttons.appendChild(buy);
    buttons.appendChild(cart);

    card.appendChild(link);
    card.appendChild(buttons);

    // keyboard support for entire card
    card.tabIndex = 0;
    card.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        window.location.href = link.href;
      }
    });

    return card;
  }

  // --- Render grids ---
  const renderGrid = (container, list, className) => {
    if (!container) return;
    container.innerHTML = "";
    const frag = document.createDocumentFragment();
    list.forEach(p => frag.appendChild(buildProductCard(p, className)));
    container.appendChild(frag);
  };

  renderGrid(productGrid, products, "product-card");
  renderGrid(productGrid2, products2, "product-card2");

  // --- Cart functions ---
  function readCart() {
    return safeParse("cart", []);
  }

  function writeCart(cart) {
    safeSet("cart", cart);
  }

  function updateCartCount() {
    const cartCountEl = elById("cart-count") || el(".cart-count");
    if (!cartCountEl) return;
    const cart = readCart();
    const total = cart.reduce((s, it) => s + (it.quantity || 0), 0);
    cartCountEl.textContent = total;
  }

  function addToCart(product) {
    const cart = readCart();
    const idx = cart.findIndex(i => i.id === product.id || i.name === product.name);
    const normalizePrice = (price) => {
      if (price == null) return 0;
      const n = String(price).replace(/[^0-9.]/g, "");
      return Number(n) || 0;
    };
    const price = normalizePrice(product.price);
    if (idx >= 0) {
      cart[idx].quantity = (cart[idx].quantity || 0) + 1;
    } else {
      cart.push({ id: product.id || slugify(product.name), name: product.name, price, quantity: 1, image: product.image, brandName: product.brandName });
    }
    writeCart(cart);
    updateCartCount();
  }

  // ensure cart count initial
  updateCartCount();

  // --- Event delegation: clicks for buttons and card navigation ---
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (btn) {
      const action = btn.dataset.action;
      const card = btn.closest(".product-card, .product-card2");
      const id = card?.dataset?.id;
      const name = card?.dataset?.name;
      const product = [...products, ...products2].find(p => p.id === id || p.name === name);
      if (!product) return;

      if (action === "cart") {
        addToCart(product);
        showToast(`${product.name} added to cart 🛒`);
      }

      if (action === "buy") {
        addToCart(product);
        showToast(`Proceeding to checkout for ${product.name} 💳`);
        window.location.href = "cart.html";
      }

      return;
    }

    // click on a card (but not on its buttons)
    const card = e.target.closest(".product-card, .product-card2");
    if (card && !e.target.closest("button")) {
      const id = card.dataset.id;
      const name = card.dataset.name;
      const product = [...products, ...products2].find(p => p.id === id || p.name === name);
      if (!product) return console.warn("Product not found for:", name);
      safeSet("selectedProduct", product);
      window.location.href = "product.html";
    }
  });

  // --- Promo Section ---
  const promos = [
    { image: "iphone-promo.jpg", title: "New Arrivals", subtitle: "Fresh styles for 2025", link: "#" },
    { image: "food-banner.jpg", title: "Flash Sale", subtitle: "Up to 50% off", link: "#" }
  ];

  if (promoSection) {
    promoSection.innerHTML = "";
    const frag = document.createDocumentFragment();
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
      overlay.innerHTML = `<strong>${title}</strong><span>${subtitle}</span><div class="promo-button">Shop Now</div>`;

      a.appendChild(img);
      a.appendChild(overlay);
      promo.appendChild(a);
      frag.appendChild(promo);
    });
    promoSection.appendChild(frag);
  }

  // --- Categories ---
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
    const frag = document.createDocumentFragment();
    categories.forEach(({ image, name, link }) => {
      const a = document.createElement("a");
      a.className = "category-card";
      a.href = link;
      const img = document.createElement("img");
      img.src = image;
      img.alt = name;
      img.loading = "lazy";
      const info = document.createElement("div");
      info.className = "category-info";
      info.textContent = name;
      a.appendChild(img);
      a.appendChild(info);
      frag.appendChild(a);
    });
    categoryGrid.appendChild(frag);
  }

  // --- Nav links active state ---
  document.querySelectorAll('.nav-link').forEach(link => {
    try { if (link.href === location.href) link.classList.add('active'); } catch(e){}
  });

  // Seller button behavior
  if (location.pathname.endsWith("netshop.html")) {
    const btn = elById("seller-btn");
    if (btn) btn.addEventListener("click", () => location.href = "seller.html");
  } else {
    elById("seller-btn")?.remove();
  }

  // Dynamic navbar login state
  const navLinks = document.querySelector(".nav-links");
  const loggedInUser = safeParse("loggedInUser");
  if (loggedInUser && navLinks) {
    navLinks.insertAdjacentHTML("beforeend", `<li class="nav-user">👋 ${loggedInUser.name}</li><li><a href="#" id="logout" class="nav-link logout-btn">Logout</a></li>`);
    document.getElementById("logout")?.addEventListener("click", (ev) => {
      ev.preventDefault();
      localStorage.removeItem("loggedInUser");
      showToast("You have logged out.");
      setTimeout(() => location.reload(), 500);
    });
  }

});


    a.appendChild(img);
    a.appendChild(overlay);
    promo.appendChild(a);
    frag.appendChild(promo);
  promoSection.appendChild(frag);


// --- Categories ---
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
  const frag = document.createDocumentFragment();
  categories.forEach(({ image, name, link }) => {
    const a = document.createElement("a");
    a.className = "category-card";
    a.href = link;
    const img = document.createElement("img");
    img.src = image;
    img.alt = name;
    img.loading = "lazy";
    const info = document.createElement("div");
    info.className = "category-info";
    info.textContent = name;
    a.appendChild(img);
    a.appendChild(info);
    frag.appendChild(a);
  });
  categoryGrid.appendChild(frag);
}

// --- Nav links active state ---
const links = document.querySelectorAll('.nav-link');
const currentUrl = window.location.href;
links.forEach(link => {
  if (link.href === currentUrl) link.classList.add('active');
});

function addToCart(product){
   let cart = 
   JSON.parse(localStorage.getItem("cart")) || [];

   // check if item exists
   const existingItem = cart.find(item => item.name === product.name);

   const price = parseFloat(String(product.price).replace(/[^0-9.]/g, "")) || 0;

   if (existingItem) {
    existingItem.quantity += 1;
   } else {
    cart.push({ ...product, price, quantity: 1});
   }
   try {
   localStorage.setItem("cart",
    JSON.stringify(cart)
   );
  } catch (err) {
    console.warn("could not save cart:", err);
    }
   updateCartCount();
  }

  function updateCartCount() {
  // prefer element with id 'cart-count' (update your markup to use this id)  
  const cartCountEl = document.getElementById("cart-count") || document.querySelector('.cart-count') ;
  if (!cartCountEl) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  cartCountEl.textContent = totalItems;
}



document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("netshop.html")) {
    const btn = document.getElementById("seller-btn");
    if (btn) {
      btn.addEventListener("click", () => {
        window.location.href = "seller.html";
      });
    }
  } else {
    const existingBtn = document.getElementById("seller-btn");
    if (existingBtn) existingBtn.remove();
  }
});



// --- Dynamic Navbar Login State ---
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelector(".nav-links");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // If logged in, show logout + username
  if (loggedInUser) {
    navLinks.insertAdjacentHTML(
      "beforeend",
      `<li class="nav-user">👋 ${loggedInUser.name}</li>
       <li><a href="#" id="logout" class="nav-link logout-btn">Logout</a></li>`
    );
  }

  // Handle logout
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      alert("You have logged out.");
      window.location.reload();
    });
  }
});

// ...existing code...