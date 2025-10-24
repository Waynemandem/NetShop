// --- Main Script ---

// Safe element references
const productGrid = document.getElementById("productGrid");
const productGrid2 = document.getElementById("productGrid2");
const toastContainer = document.getElementById("toastContainer");
const promoSection = document.getElementById("promo-section");
const categoryGrid = document.getElementById("category-grid");

// --- Toast Function ---
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// --- Product Section 1 ---
const products = [
  { brandName: "Nike", name: "Nike Air Sneakers", price: "$120", image: "nike1.jpeg" },
  { brandName: "Adidas", name: "Adidas Ultraboost", price: "$140", image: "adidas.jpeg" },
  { brandName: "Puma", name: "Puma Classic", price: "$100", image: "puma1.jpg" },
  { brandName: "New Balance", name: "New Balance 550", price: "$110", image: "newBalance.jpeg" },
  { brandName: "Vans", name: "Converse All Star", price: "$99.99", image: "ConverseAllStar.jpeg" },
  { brandName: "Nike", name: "Nike Stack", price: "$130", image: "nikestack.jpeg" }
];

if (productGrid) {
  productGrid.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <p class="brandName">${p.brandName}</p>
      <p class="product-name">${p.name}</p>
      <p class="product-price">${p.price}</p>
      <div class="card-buttons">
        <button class="buy-btn">Buy Now</button>
        <button class="cart-btn">Add to Cart</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// --- Product Section 2 ---
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
];

if (productGrid2) {
  productGrid2.innerHTML = "";
  products2.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("product-card2");
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <p class="brandName">${p.brandName}</p>
      <p class="product2-name">${p.name}</p>
      <p class="product2-price">${p.price}</p>
      <div class="card-buttons">
        <button class="buy-btn">Buy Now</button>
        <button class="cart-btn">Add to Cart</button>
      </div>
    `;
    productGrid2.appendChild(card);
  });
}

// --- Event Handling ---
document.addEventListener("click", e => {
  if (e.target.classList.contains("cart-btn")) {
    const name = e.target.closest(".product-card, .product-card2").querySelector("p:nth-of-type(2)").textContent;
    showToast(`${name} added to cart 🛒`);
  }
  if (e.target.classList.contains("buy-btn")) {
    const name = e.target.closest(".product-card, .product-card2").querySelector("p:nth-of-type(2)").textContent;
    showToast(`Proceeding to buy ${name} 💳`);
  }
});

// --- Promo Section ---
const promos = [
  { image: "iphone-promo.jpg", title: "New Arrivals", subtitle: "Fresh styles for 2025", link: "#" },
  { image: "food-banner.jpg", title: "Flash Sale", subtitle: "Up to 50% off", link: "#" },
  { image: "banner3.jpg", title: "Trending Now", subtitle: "Hot picks of the week", link: "#" }
];

if (promoSection) {
  promos.forEach(({ image, title, subtitle, link }) => {
    const promo = document.createElement("div");
    promo.classList.add("promo-card");
    promo.innerHTML = `
      <a href="${link}">
        <img src="${image}" alt="${title}">
        <div class="promo-overlay">
          ${title}
          <span>${subtitle}</span>
          <div class="promo-button">Shop Now</div>
        </div>
      </a>
    `;
    promoSection.appendChild(promo);
  });
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
  { image: "", name: "Women's Clothing", link: "#" }
];

if (categoryGrid) {
  categories.forEach(({ image, name, link }) => {
    const card = document.createElement("a");
    card.classList.add("category-card");
    card.href = link;
    card.innerHTML = `
      <img src="${image}" alt="${name}">
      <div class="category-info">${name}</div>
    `;
    categoryGrid.appendChild(card);
  });
}
