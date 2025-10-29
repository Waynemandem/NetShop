// ...existing code...
document.addEventListener("DOMContentLoaded", () => {
  const selectedJson = localStorage.getItem("selectedProduct");
  const productData = selectedJson ? JSON.parse(selectedJson) : null;

  // prefer persisted catalog, else fall back to global arrays if present
  const storedCatalog = localStorage.getItem("shopProducts");
  const allProducts = storedCatalog
    ? JSON.parse(storedCatalog)
    : (window.products && window.products2 ? [...products, ...products2] : []);

  if (!productData) {
    console.warn("No selectedProduct in localStorage — redirecting to shop.");
    window.location.href = "shop.html";
    return;
  }

  // helper setters that safely check elements
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  const setImage = (id, src, alt) => {
    const img = document.getElementById(id);
    if (img) {
      img.src = src || "";
      img.alt = alt || "";
    }
  };

  setImage("product-image", productData.image, productData.name);
  setText("product-name", productData.name || "");
  // normalise brand field (some files use brand, others brandName)
  setText("product-brand", `Brand: ${productData.brand || productData.brandName || "—"}`);
  setText("product-category", `Category: ${productData.category || "—"}`);
  setText("product-price", productData.price != null ? `$${productData.price}` : "Price not available");

  // safe button handlers
  document.getElementById("add-to-cart")?.addEventListener("click", () => {
    if (typeof showToast === "function") showToast(`${productData.name} added to cart 🛒`);
    else alert(`${productData.name} added to cart 🛒`);
  });
  document.getElementById("buy-now")?.addEventListener("click", () => {
    if (typeof showToast === "function") showToast(`Proceeding to buy ${productData.name} 💳`);
    else alert(`Proceeding to buy ${productData.name} 💳`);
  });

  // Related products (render only if container exists)
  const relatedContainer = document.getElementById("related-products");
  if (relatedContainer && Array.isArray(allProducts)) {
    const relatedList = allProducts.filter(p => (p.category === productData.category) && (p.name !== productData.name));
    if (relatedList.length === 0) {
      relatedContainer.innerHTML = "<p style='padding:12px'>No related items found.</p>";
    } else {
      relatedContainer.innerHTML = "";
      relatedList.slice(0, 10).forEach(item => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <img src="${item.image || ""}" alt="${item.name || ""}">
          <p class="brandName">${item.brand || item.brandName || ""}</p>
          <p class="product-name">${item.name || ""}</p>
          <p class="product-price">${item.price != null ? "$" + item.price : ""}</p>
        `;
        card.addEventListener("click", () => {
          try { localStorage.setItem("selectedProduct", JSON.stringify(item)); }
          catch (err) { console.warn("Could not save selectedProduct:", err); }
          // update contents on the same page instead of full reload:
          setImage("product-image", item.image, item.name);
          setText("product-name", item.name);
          setText("product-brand", `Brand: ${item.brand || item.brandName || "—"}`);
          setText("product-category", item.category || "");
          setText("product-price", item.price != null ? `$${item.price}` : "Price not available");
        });
        relatedContainer.appendChild(card);
      });

      document.getElementById("next-related")?.addEventListener("click", () => relatedContainer.scrollBy({ left: 300, behavior: "smooth" }));
      document.getElementById("prev-related")?.addEventListener("click", () => relatedContainer.scrollBy({ left: -300, behavior: "smooth" }));
    }
  }

  // Optional: support product lookup by ?name= query (fallback)
  const urlName = new URLSearchParams(window.location.search).get("name");
  if (urlName && Array.isArray(allProducts) && allProducts.length) {
    const found = allProducts.find(p => p.name === decodeURIComponent(urlName));
    if (found) {
      try { localStorage.setItem("selectedProduct", JSON.stringify(found)); } catch {}
      setImage("product-image", found.image, found.name);
      setText("product-name", found.name);
      setText("product-brand", `Brand: ${found.brand || found.brandName || "—"}`);
      setText("product-price", found.price != null ? `$${found.price}` : "");
      setText("product-category", found.category || "");
      setText("product-description", found.description || "");
    }
  }
});

document.getElementById("add-to-cart").addEventListener("click", () => {
  addToCart(productData);
  alert(`${productData.name} added to cart 🛒`);
});
// ...existing code...