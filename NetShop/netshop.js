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

function showToast(message, type = "success") {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function slugify(text = "") {
  return String(text).toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

function createTextElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.textContent = text;
  return el;
}

// --- Data ---
const products = [
  { brandName: "Nike", name: "Nike Air Sneakers", price: "$120", image: "nike1.jpeg" },
  { brandName: "Adidas", name: "Adidas Ultraboost", price: "$140", image: "adidas.jpeg" },
  { brandName: "Puma", name: "Puma Classic", price: "$100", image: "puma1.jpg" },
  { brandName: "New Balance", name: "New Balance 550", price: "$110", image: "newBalance.jpeg" },
  { brandName: "Converse", name: "Converse All Star", price: "$100", image: "ConverseAllStar.jpeg" },
  { brandName: "Nike", name: "Nike Stack", price: "$130", image: "nikestack.jpeg" }
].map(p => ({ ...p, id: slugify(p.name) }));

const products2 = [
  { brandName: "Big 4", name: "Rema Swag", price: "$499.99", image: "starboy.jpg" },
  { brandName: "Africon", name: "Africa", price: "$199.99", image: "ConverseAllStar.jpeg" },
  { brandName: "Wayne Real Estates", name: "4 Bedroom House", price: "$31,000,000", image: "mistressHome.jpg" },
  { brandName: "Big 4", name: "Suit", price: "$310", image: "suit.jpg" },
  { brandName: "Big 4", name: "Track Suit", price: "$350", image: "tracktech.jpg" },
  { brandName: "Big 4", name: "Sharp Fit", price: "$310.99", image: "sharpfit.jpg" },
  { brandName: "Big 4", name: "Cloth Collection", price: "$699.99", image: "tops&bottom.jpg" },
  { brandName: "Big 4", name: "Shoe Collection", price: "$999.99", image: "shoes.jpg" },
  { brandName: "Big 4", name: "Jogger and Shoes", price: "$699.99", image: "track&shoe.jpg" }
].map(p => ({ ...p, id: slugify(p.name) }));

localStorage.setItem("shopProducts", JSON.stringify([...products, ...products2]));


// --- Builders ---
function buildProductCard(p, cardClass = "product-card") {
  const card = document.createElement("div");
  card.className = cardClass;
  card.dataset.name = p.name;
  card.dataset.id = p.id;

  const link = document.createElement("a");
  link.className = "product-link";
  link.href = `product.html?name=${encodeURIComponent(p.name)}`;
  link.setAttribute("aria-label", `${p.name} details`);

  const img = document.createElement("img");
  img.src = p.image;
  img.alt = p.name;
  img.loading = "lazy";

  link.appendChild(img);
  link.appendChild(createTextElement("p", "brandName", p.brandName));
  link.appendChild(createTextElement("p", "product-name", p.name));
  link.appendChild(createTextElement("p", "product-price", p.price));

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

  // keyboard support: Enter/Space on card navigates
  card.tabIndex = 0;
  card.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && document.activeElement === card) {
      window.location.href = `product.html?name=${encodeURIComponent(p.name)}`;
    }
  });

  return card;
}

// --- Render Section 1 ---
if (productGrid) {
  productGrid.innerHTML = "";
  const frag = document.createDocumentFragment();
  products.forEach(p => frag.appendChild(buildProductCard(p, "product-card")));
  productGrid.appendChild(frag);
}

// --- Render Section 2 ---
if (productGrid2) {
  productGrid2.innerHTML = "";
  const frag2 = document.createDocumentFragment();
  products2.forEach(p => frag2.appendChild(buildProductCard(p, "product-card2")));
  productGrid2.appendChild(frag2);
}

// --- Global click handling (event delegation) ---
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const card = btn.closest(".product-card, .product-card2");
  const name = card?.dataset?.name;

  if (!name) return;

  const product = [...products, ...products2].find(p => p.name === name);
  if (!product) return;

  if (action === "cart") {
    addToCart(product);
    showToast(`${name} added to cart 🛒`);
    return;
  }

  if (action === "buy") {
    addToCart(product);
    showToast(`Proceeding to checkout for ${name} 💳`);
    window.location.href = "cart.html";
    return;
  }
});

  // If click landed on a product card but not on buttons, open product page
const card = e.target.closest(".product-card, .product-card2");
if (card && !e.target.closest("button")) {
  const name = card.dataset.name;
  const product = [...products, ...products2].find(p => p.name === name);

  if (product) {
    // Store full product data for product.html to use
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "product.html";
  } else {
    console.warn("Product not found for:", name);
  }
}


// --- Promo Section ---
const promos = [
  { image: "iphone-promo.jpg", title: "New Arrivals", subtitle: "Fresh styles for 2025", link: "#" },
  { image: "food-banner.jpg", title: "Flash Sale", subtitle: "Up to 50% off", link: "#" },
  { image: "banner3.jpg", title: "Trending Now", subtitle: "Hot picks of the week", link: "#" }
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
    overlay.innerHTML = `${title}<span>${subtitle}</span><div class="promo-button">Shop Now</div>`;

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

   const price = parseFloat(product.price.replace(/[^0-9.]/g, "")) || 0;

   if (existingItem) {
    existingItem.quantity += 1;
   } else {
    cart.push({ ...product, price, quantity: 1});
   }
   localStorage.setItem("cart",
    JSON.stringify(cart)
   );
   updateCartCount();
  }

  function updateCartCount() {
  const cartCountEl = document.getElementById("cart-count");
  if (!cartCountEl) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = totalItems;
}

// ...existing code...