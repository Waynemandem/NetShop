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

  // --- Cart helpers (local to this page) ---
  const readCart = () => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch (e) { return []; }
  };

  const writeCart = (cart) => {
    try { localStorage.setItem('cart', JSON.stringify(cart)); } catch (e) { console.warn('writeCart:', e); }
  };

  const updateCartCount = () => {
    const el = document.getElementById('cart-count') || document.querySelector('.cart-count');
    if (!el) return;
    const cart = readCart();
    const total = cart.reduce((s, it) => s + (it.quantity || 0), 0);
    el.textContent = total;
  };

  const formatPrice = (v) => {
    const n = Number(v) || 0;
    try { return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); } catch (e) { return n.toFixed(2); }
  };

  const addToCart = (product) => {
    if (!product) return;
    const cart = readCart();
    const idx = cart.findIndex(i => i.id === product.id || i.name === product.name);
    if (idx >= 0) {
      cart[idx].quantity = (cart[idx].quantity || 0) + 1;
    } else {
      // store a minimal normalized product in cart
      cart.push({ id: product.id || product.name, name: product.name, price: product.price, image: product.image, quantity: 1 });
    }
    writeCart(cart);
    updateCartCount();
  };

  setImage("product-image", productData.image, productData.name);
  setText("product-name", productData.name || "");
  // normalise brand field (some files use brand, others brandName)
  setText("product-brand", `Brand: ${productData.brand || productData.brandName || "—"}`);
  setText("product-category", `Category: ${productData.category || "—"}`);
  setText("product-price", productData.price != null ? `₦${formatPrice(productData.price)}` : "Price not available");

  // safe button handlers (add to cart and buy now)
  document.getElementById("add-to-cart")?.addEventListener("click", () => {
    addToCart(productData);
    if (typeof showToast === "function") showToast(`${productData.name} added to cart 🛒`);
    else alert(`${productData.name} added to cart 🛒`);
  });

  document.getElementById("buy-now")?.addEventListener("click", () => {
    addToCart(productData);
    if (typeof showToast === "function") showToast(`Proceeding to buy ${productData.name} 💳`);
    else alert(`Proceeding to buy ${productData.name} 💳`);
    // small delay so the toast can be seen; then open cart/checkout
    setTimeout(() => { window.location.href = 'cart.html'; }, 300);
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
            <p class="product-price">${item.price != null ? '₦' + formatPrice(item.price) : ""}</p>
          `;
        card.addEventListener("click", () => {
          try { localStorage.setItem("selectedProduct", JSON.stringify(item)); }
          catch (err) { console.warn("Could not save selectedProduct:", err); }
          // update contents on the same page instead of full reload:
          setImage("product-image", item.image, item.name);
          setText("product-name", item.name);
          setText("product-brand", `Brand: ${item.brand || item.brandName || "—"}`);
          setText("product-category", item.category || "");
          setText("product-price", item.price != null ? `₦${formatPrice(item.price)}` : "Price not available");
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
  setText("product-price", found.price != null ? `₦${formatPrice(found.price)}` : "");
      setText("product-category", found.category || "");
      setText("product-description", found.description || "");
    }
  }
});

// (removed stray top-level listener; add-to-cart now wired inside DOMContentLoaded)
// ...existing code...