// new product.js

document.addEventListener("DOMContentLoaded", () => {
  const productData = JSON.parse(localStorage.getItem("selectedProduct"));
  const allProducts = JSON.parse(localStorage.getItem("shopProducts")) || [];


  if (!productData) {
    console.warn("No selectedProduct in localStorage — redirecting to shop.");
    window.location.href = "shop.html";
    return;
  }

  const productImage = document.getElementById("product-image");
  const productName = document.getElementById("product-name");
  const productBrand = document.getElementById("product-brand");
  const productCategory = document.getElementById("product-category");
  const productPrice = document.getElementById("product-price");

  productImage.src = productData.image;
  productImage.alt = productData.name;
  productName.textContent = productData.name;
  productBrand.textContent = `Brand: ${productData.brand}`;
  productCategory.textContent = `Category: ${productData.category}`;
  productPrice.textContent = `$${productData.price}`;

// Add to cart and buy now
  document.getElementById("add-to-cart").addEventListener("click", () => {
    typeof showToast === "function"
      ? showToast(`${productData.name} added to cart 🛒`)
      : alert(`${productData.name} added to cart 🛒`);
  });

  document.getElementById("buy-now").addEventListener("click", () => {
    typeof showToast === "function"
      ? showToast(`Proceeding to buy ${productData.name} 💳`)
      : alert(`Proceeding to buy ${productData.name} 💳`);
  });
});

// ---- Related Products ---- 

const relatedContainer = document.getElementById("related-products");
const relatedList = allProducts.filter(p => p.category === productData.category && p.name !== productData.name);

 if (relatedList.length === 0) {
    relatedContainer.innerHTML = "<p style='padding:12px'>No related items found.</p>";
  } else {
    relatedList.slice(0, 10).forEach(item => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <p class="brandName">${item.brand}</p>
        <p class="product-name">${item.name}</p>
        <p class="product-price">$${item.price}</p>
      `;
      card.addEventListener("click", () => {
        localStorage.setItem("selectedProduct", JSON.stringify(item));
        // update page without full redirect for speed
        location.reload();
      });
      relatedContainer.appendChild(card);
    });

    // controls
    const nextBtn = document.getElementById("next-related");
    const prevBtn = document.getElementById("prev-related");
    if (nextBtn && prevBtn) {
      nextBtn.addEventListener("click", () => relatedContainer.scrollBy({ left: 300, behavior: 'smooth' }));
      prevBtn.addEventListener("click", () => relatedContainer.scrollBy({ left: -300, behavior: 'smooth' }));
    }
  };