// shop.js — safe, self-contained
// Make sure this file is included with <script defer src="shop.js"></script>

document.addEventListener("DOMContentLoaded", () => {
  const shopGrid = document.getElementById("product-grid");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortBy = document.getElementById("sortBy");

  if (!shopGrid) return; // stop if not on shop page

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

  // Persist the full catalog so product page can read related items
  try {
    localStorage.setItem("shopProducts", JSON.stringify(shopProducts));
  } catch (err) {
    console.warn("Could not write shopProducts to localStorage:", err);
  }

  // Render products
  function renderProducts(products) {
    shopGrid.innerHTML = "";
    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";

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

  // Add / Buy global handlers (toasts)
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-btn")) {
      const name = e.target.closest(".product-card").querySelector(".product-name").textContent || "Item";
      if (typeof showToast === "function") showToast(`${name} added to cart 🛒`, "success");
      else console.log(`${name} added to cart 🛒`);
    }
    if (e.target.classList.contains("buy-btn")) {
      const name = e.target.closest(".product-card").querySelector(".product-name").textContent || "Item";
      if (typeof showToast === "function") showToast(`Proceeding to buy ${name} 💳`, "success");
      else console.log(`Proceeding to buy ${name} 💳`);
    }
  });
});
