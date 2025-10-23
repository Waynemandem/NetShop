// shop.js — runs only on shop.html

const shopGrid = document.getElementById("product-grid");
const categoryFilter = document.getElementById("categoryFilter");
const sortBy = document.getElementById("sortBy");

if (shopGrid) {
  // Product data
  const shopProducts = [
    { brand: "Nike", name: "Air Max", category: "men", price: 120, image: "nike1.jpeg" },
    { brand: "Adidas", name: "Ultraboost", category: "men", price: 140, image: "adidas.jpeg" },
    { brand: "Puma", name: "Classic Runner", category: "women", price: 110, image: "puma1.jpg" },
    { brand: "Apple", name: "AirPods Pro", category: "electronics", price: 250, image: "airpods.jpeg" },
    { brand: "Casio", name: "Digital Watch", category: "accessories", price: 75, image: "watch.jpeg" },
    { brand: "Vans", name: "Converse All Star", category: "unisex", price: 99.99, image: "ConverseAllStar.jpeg" },
    { brand: "New Balance", name: "NB 550", category: "men", price: 110, image: "newBalance.jpeg" },
    { brand: "Big 4", name: "Suit", category: "men", price: 310, image: "suit.jpg" }
  ];

  // --- Render products ---
  function renderProducts(products) {
    shopGrid.innerHTML = "";
    products.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <p class="brandName">${product.brand}</p>
        <p class="product-name">${product.name}</p>
        <p class="product-price">$${product.price}</p>
        <div class="card-buttons">
          <button class="buy-btn">Buy Now</button>
          <button class="cart-btn">Add to Cart</button>
        </div>
      `;

      // Clicking the image or text goes to product page
      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("buy-btn") || e.target.classList.contains("cart-btn")) return;
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        window.location.href = "product.html";
      });

      shopGrid.appendChild(card);
    });
  }

  renderProducts(shopProducts);

  // --- Filter ---
  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      const category = categoryFilter.value;
      const filtered = category === "all"
        ? shopProducts
        : shopProducts.filter(p => p.category === category);
      renderProducts(filtered);
    });
  }

  // --- Sort ---
  if (sortBy) {
    sortBy.addEventListener("change", () => {
      const value = sortBy.value;
      let sorted = [...shopProducts];
      if (value === "priceLow") sorted.sort((a, b) => a.price - b.price);
      if (value === "priceHigh") sorted.sort((a, b) => b.price - a.price);
      renderProducts(sorted);
    });
  }

  // --- Handle cart and buy ---
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-btn")) {
      const name = e.target.closest(".product-card").querySelector(".product-name").textContent;
      if (typeof showToast === "function") {
        showToast(`${name} added to cart 🛒`, "success");
      } else {
        alert(`${name} added to cart 🛒`);
      }
    }

    if (e.target.classList.contains("buy-btn")) {
      const name = e.target.closest(".product-card").querySelector(".product-name").textContent;
      if (typeof showToast === "function") {
        showToast(`Proceeding to buy ${name} 💳`, "success");
      } else {
        alert(`Proceeding to buy ${name} 💳`);
      }
    }
  });
}
